# NHost Troubleshooting Guide

## 🚨 Current Issues Detected

1. **401 Unauthorized Error** - Authentication endpoint not accessible
2. **Hydration Mismatch** - Server/client rendering differences (FIXED)
3. **Duplicate React Keys** - Message ID collisions (FIXED)

## 🔍 NHost Configuration Checklist

### 1. Verify NHost Project Status
Go to [NHost Dashboard](https://app.nhost.io) and check:

- [ ] Project is **Active** (not paused/sleeping)
- [ ] Project subdomain: `bnqvukehntkdxvfennwr`
- [ ] Project region: `ap-south-1`
- [ ] Database is running
- [ ] Hasura is running

### 2. Check Authentication Settings
In your NHost project dashboard:

- [ ] Go to **Settings → Authentication**
- [ ] Ensure **Email & Password** is enabled
- [ ] Check **Email Verification** settings:
  - If enabled: Users must verify email before login
  - If disabled: Users can login immediately after signup

### 3. Verify Environment Variables
In your `.env.local` file:

```bash
NEXT_PUBLIC_NHOST_SUBDOMAIN=bnqvukehntkdxvfennwr
NEXT_PUBLIC_NHOST_REGION=ap-south-1
```

### 4. Test Connection Steps

1. **Open browser console** (F12)
2. **Click "Test NHost Connection"** button
3. **Review console output** for detailed error messages
4. **Check network tab** for failed requests

## 🔧 Common Solutions

### If Project is Sleeping/Inactive:
1. Go to NHost Dashboard
2. Click your project
3. Look for "Wake up" or "Activate" button
4. Wait for all services to start (Database, Hasura, Auth)

### If Authentication is Disabled:
1. Go to **Settings → Authentication**
2. Enable **Email & Password** sign-in method
3. Configure email verification as needed

### If Subdomain/Region is Wrong:
1. Check your NHost project settings
2. Update `.env.local` with correct values
3. Restart development server

### If Still Having Issues:
1. Try creating a new test user from NHost dashboard
2. Check NHost logs for errors
3. Verify your project billing status
4. Contact NHost support if project seems corrupted

## 📱 Testing Authentication Flow

### For Testing Without Email Verification:
1. Disable email verification in NHost settings
2. Try signup with any email
3. Login immediately after signup

### For Testing With Email Verification:
1. Use a real email address you can access
2. Check inbox for verification email
3. Click verification link
4. Then try login

## 🐛 Current Error Analysis

The `401 Unauthorized` error suggests:
- NHost authentication service is not accessible
- Project might be inactive/sleeping
- Authentication might be disabled
- Invalid credentials/configuration

Run the connection test and check the console for specific error details.
