# Vercel Deployment Setup

## Adding Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Navigate to **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_API_KEY`
   - **Value**: Your Google Gemini API key
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the generated key
5. Add it to Vercel as shown above

## Important Notes

- Environment variables in Vite must be prefixed with `VITE_`
- After adding environment variables, you must redeploy
- The API key will be embedded in the client-side code (this is normal for client-side apps)
- For production, consider implementing a backend proxy to hide the API key

## Redeploy

After adding the environment variable:
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Select **Redeploy**
- Or push a new commit to trigger automatic deployment
