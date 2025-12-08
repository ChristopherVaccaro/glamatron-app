# Supabase Edge Functions

This directory contains Supabase Edge Functions for Glamatron.

## Prerequisites

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (get project ref from Supabase Dashboard URL):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

## Functions

### `delete-account`

Securely deletes a user's account including:
- All gallery images from storage
- All gallery items from database
- User profile (cascades to generations, transactions, subscriptions)
- The auth.users entry (requires service role key)

#### Deploy

```bash
supabase functions deploy delete-account
```

#### Environment Variables

The function automatically has access to these Supabase-provided environment variables:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin access)

No additional configuration needed!

#### Testing

You can test the function locally:

```bash
supabase functions serve delete-account
```

Then call it with a valid JWT token:

```bash
curl -X POST http://localhost:54321/functions/v1/delete-account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### CORS Issues
The function includes CORS headers for cross-origin requests. If you're still having issues, check that your frontend URL is allowed.

### Function Not Found
Make sure you've deployed the function:
```bash
supabase functions list
```

### Permission Denied
The function uses the service role key internally. Make sure:
1. The function is deployed correctly
2. The user's JWT token is valid and not expired
