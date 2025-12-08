// Supabase Edge Function: delete-account
// Deletes a user's account completely including auth.users entry
// Deploy with: supabase functions deploy delete-account

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the user's JWT to verify identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Client with user's auth to get their ID
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = user.id

    // Create admin client with service role key for deletion
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 1. Delete gallery images from storage
    const { data: galleryItems } = await supabaseAdmin
      .from('gallery_items')
      .select('original_image_url, result_image_url')
      .eq('user_id', userId)

    if (galleryItems && galleryItems.length > 0) {
      const imagePaths: string[] = []
      
      for (const item of galleryItems) {
        // Extract file paths from URLs
        for (const url of [item.original_image_url, item.result_image_url]) {
          if (url) {
            const match = url.match(/\/storage\/v1\/object\/public\/gallery-images\/(.+)/)
            if (match) {
              imagePaths.push(match[1])
            }
          }
        }
      }

      if (imagePaths.length > 0) {
        await supabaseAdmin.storage
          .from('gallery-images')
          .remove(imagePaths)
      }
    }

    // 2. Delete gallery items (will be cascade deleted with profile, but explicit is safer)
    await supabaseAdmin
      .from('gallery_items')
      .delete()
      .eq('user_id', userId)

    // 3. Delete profile (cascades to generations, transactions, subscriptions)
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    // 4. Delete the user from auth.users (requires service role)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete auth user', details: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Account deleted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
