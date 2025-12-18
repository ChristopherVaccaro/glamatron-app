import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Initialize Supabase with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Stripe price IDs to coin amounts
// Configure via environment variables, or fallback to amount-based detection
const PRICE_TO_COINS: Record<string, number> = {
  // Add your actual Stripe price IDs here or via environment variables
  // Format: 'price_1Qxxxxxxxxx': coinAmount
  ...(process.env.STRIPE_PRICE_5_COINS ? { [process.env.STRIPE_PRICE_5_COINS]: 5 } : {}),
  ...(process.env.STRIPE_PRICE_10_COINS ? { [process.env.STRIPE_PRICE_10_COINS]: 10 } : {}),
  ...(process.env.STRIPE_PRICE_25_COINS ? { [process.env.STRIPE_PRICE_25_COINS]: 25 } : {}),
};

// Fallback: Map product names to coins (for Payment Links)
const PRODUCT_NAME_TO_COINS: Record<string, number> = {
  '5 glamcoins': 5,
  '5 GlamCoins': 5,
  '10 glamcoins': 10,
  '10 GlamCoins': 10,
  '25 glamcoins': 25,
  '25 GlamCoins': 25,
};

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body for signature verification
  },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.error('No Stripe signature found');
    return res.status(400).json({ error: 'No signature' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return res.status(400).json({ error: `Webhook Error: ${message}` });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('Processing checkout.session.completed:', session.id);
    console.log('Session metadata:', JSON.stringify({
      client_reference_id: session.client_reference_id,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
    }));
    
    // Get user ID from client_reference_id (we set this in PurchaseModal)
    const userId = session.client_reference_id;
    if (!userId) {
      console.error('No client_reference_id found in session');
      return res.status(400).json({ error: 'No user ID in session' });
    }

    // Determine coin amount from the session
    let coinsToAdd = 0;
    
    // IMPORTANT: line_items are NOT included in webhook by default - fetch them
    try {
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product'],
      });
      
      const lineItems = sessionWithLineItems.line_items?.data;
      console.log('Retrieved line items:', JSON.stringify(lineItems?.map(li => ({
        description: li.description,
        price_id: li.price?.id,
        product: typeof li.price?.product === 'object' && 'name' in li.price.product ? li.price.product.name : li.price?.product,
      }))));
      
      if (lineItems?.[0]?.price?.id) {
        const priceId = lineItems[0].price.id;
        coinsToAdd = PRICE_TO_COINS[priceId] || 0;
        console.log(`Price ID ${priceId} -> ${coinsToAdd} coins`);
      }
      
      // Fallback: Try product name
      if (coinsToAdd === 0 && lineItems?.[0]) {
        const product = lineItems[0].price?.product;
        const productName = typeof product === 'object' && product !== null && 'name' in product ? product.name : lineItems[0].description;
        console.log('Checking product name:', productName);
        
        if (productName) {
          for (const [name, coins] of Object.entries(PRODUCT_NAME_TO_COINS)) {
            if (productName.toLowerCase().includes(name.toLowerCase())) {
              coinsToAdd = coins;
              console.log(`Product name "${productName}" matched "${name}" -> ${coins} coins`);
              break;
            }
          }
        }
      }
    } catch (lineItemError) {
      console.error('Error fetching line items:', lineItemError);
    }

    // Fallback: Parse from amount (approximate)
    if (coinsToAdd === 0 && session.amount_total) {
      const amountCents = session.amount_total;
      console.log('Using amount-based fallback:', amountCents, 'cents');
      if (amountCents === 299) coinsToAdd = 5;
      else if (amountCents === 499) coinsToAdd = 10;
      else if (amountCents === 999) coinsToAdd = 25;
    }

    if (coinsToAdd === 0) {
      console.error('Could not determine coin amount from session:', session.id);
      // Still return 200 to acknowledge receipt
      return res.status(200).json({ received: true, warning: 'Could not determine coin amount' });
    }

    console.log(`Adding ${coinsToAdd} coins to user ${userId}`);

    // Add coins to user's profile in Supabase
    try {
      // First, get current profile
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('glam_coins, has_purchased')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
      }

      const currentCoins = profile?.glam_coins || 0;
      const newBalance = currentCoins + coinsToAdd;

      // Update profile with new coin balance and mark as purchased
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          glam_coins: newBalance,
          has_purchased: true, // Unlocks full style library
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return res.status(500).json({ error: 'Failed to update user profile' });
      }

      console.log(`Successfully added ${coinsToAdd} coins. New balance: ${newBalance}`);

      // Log the purchase (optional - table may not exist)
      try {
        await supabaseAdmin
          .from('purchase_history')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            coins_added: coinsToAdd,
            amount_cents: session.amount_total,
            currency: session.currency,
          });
      } catch (logError) {
        console.warn('Could not log purchase (table may not exist):', logError);
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  }

  // Return 200 to acknowledge receipt of the event
  return res.status(200).json({ received: true });
}
