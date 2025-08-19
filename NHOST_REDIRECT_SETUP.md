# NHost Email Verification Redirect Setup

## Problem
NHost email verification links are redirecting to `localhost:3000` instead of the production URL `https://mouseai.netlify.app`.

## Solution
You need to configure the allowed redirect URLs in your NHost dashboard.

## Steps to Configure

### 1. Access NHost Dashboard
1. Go to [NHost Console](https://console.nhost.io/)
2. Sign in to your account
3. Select your project: `bnqvukehntkdxvfennwr`

### 2. Configure Authentication Settings
1. In your project dashboard, navigate to **Authentication** section
2. Go to **Settings** or **Configuration** tab
3. Look for **Allowed Redirect URLs** or **Client URLs** section

### 3. Add Production URL
Add the following URLs to the allowed redirect list:
```
https://mouseai.netlify.app
https://mouseai.netlify.app/
```

### 4. Optional: Keep Localhost for Development
You may also want to keep localhost for development:
```
http://localhost:3000
http://localhost:3000/
```

### 5. Save Configuration
Save the settings in the NHost dashboard.

## Alternative Method: Environment Variables
Some NHost configurations also support setting these via environment variables. Check if your project supports:
```bash
NHOST_AUTH_CLIENT_URL=https://mouseai.netlify.app
```

## Verification
After configuring:
1. Try creating a new account
2. Check that the verification email links now point to `https://mouseai.netlify.app`
3. Test that clicking the verification link properly redirects to your production site

## Notes
- Changes may take a few minutes to propagate
- Make sure to use HTTPS for production URLs
- Ensure the URL format matches exactly (with or without trailing slash as configured)

## Troubleshooting
If you still get "redirectTo not allowed" errors:
1. Double-check the URL spelling in the dashboard
2. Try adding both with and without trailing slash
3. Clear your browser cache
4. Wait a few minutes for changes to propagate
5. Contact NHost support if the issue persists
