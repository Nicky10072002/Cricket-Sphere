# Quick Start: OTP Authentication

## 🚀 What's Been Created

Your OTP authentication system is ready! Here's what you have:

### Files Created:
1. **`/app/components/EmailOtpLogin.tsx`** - Beautiful login UI component
2. **`/app/routes/($locale).login.tsx`** - Login page
3. **`/app/routes/api.auth.send-otp.ts`** - API to send OTP
4. **`/app/routes/api.auth.verify-otp.ts`** - API to verify OTP
5. **`/app/lib/otpStore.ts`** - Shared OTP storage
6. **`OTP_AUTH_SETUP.md`** - Complete setup documentation

## ✅ Features Implemented

- ✅ Email & Phone number support
- ✅ 6-digit OTP generation
- ✅ 30-second resend timer
- ✅ 5-minute OTP expiration
- ✅ Beautiful, responsive UI
- ✅ Auto-redirect to homepage after login
- ✅ Development mode (OTP shown on screen)

## 🎯 How to Test Right Now

### 1. Start Your Dev Server
```bash
npm run dev
```

### 2. Navigate to Login Page
Open your browser and go to:
```
http://localhost:3000/login
```

### 3. Test the Flow

**Step 1:** Choose Email or Phone
- Click the "Email" or "Phone" tab

**Step 2:** Enter Your Email/Phone
- Email: `test@example.com`
- Phone: `+1234567890` (include country code)

**Step 3:** Click "Send OTP"
- In development mode, the OTP will be displayed on screen
- Check console logs for the OTP

**Step 4:** Enter the OTP
- Type the 6-digit code shown on screen

**Step 5:** Click "Verify & Login"
- You'll be redirected to the homepage

## 📧 Next Steps for Production

### 1. Set Up Email Service (Choose One)

#### Option A: SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

Add to `.env`:
```env
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### Option B: Nodemailer (SMTP)
```bash
npm install nodemailer
```

Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 2. Set Up SMS Service (Optional)

#### Twilio
```bash
npm install twilio
```

Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Update Email/SMS Functions

Edit `/app/routes/api.auth.send-otp.ts` and uncomment the email/SMS service code.

See `OTP_AUTH_SETUP.md` for detailed implementation examples.

### 4. Production Storage (Important!)

For production, replace the in-memory storage with Redis:

```bash
npm install redis
```

Update `/app/lib/otpStore.ts` to use Redis instead of Map.

## 🎨 Customization

### Change Colors
Edit `/app/components/EmailOtpLogin.tsx`:
```tsx
// Change from amber to your brand color
className="bg-gradient-to-r from-blue-500 to-indigo-500"
```

### Change Redirect URL
```tsx
<EmailOtpLogin redirectTo="/account" />
```

### Change OTP Length
Edit `/app/routes/api.auth.send-otp.ts`:
```typescript
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}
```

### Change Resend Timer
Edit `/app/components/EmailOtpLogin.tsx`:
```typescript
setResendTimer(60); // 60 seconds instead of 30
```

## 🔗 Integration with Your App

### Add Login Link to Header
```tsx
<Link to="/login">Sign In</Link>
```

### Protect Routes
```tsx
// In your route loader
export async function loader({context}: Route.LoaderArgs) {
  const {session} = context;
  const customerAccessToken = session.get('customerAccessToken');
  
  if (!customerAccessToken) {
    throw redirect('/login');
  }
  
  // ... rest of your loader
}
```

### Show User Info
```tsx
// Check if user is logged in
const {session} = context;
const isLoggedIn = !!session.get('customerAccessToken');
```

## 📱 Mobile Testing

The UI is fully responsive and works great on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile phones

## 🐛 Troubleshooting

### OTP Not Showing in Dev Mode?
- Check browser console for the OTP
- Verify `NODE_ENV` is set to `development`

### API Routes Not Working?
- Ensure file names are correct: `api.auth.*.ts`
- Restart your dev server
- Check terminal for errors

### Redirect Not Working?
- Verify the route exists (e.g., `/` for homepage)
- Check browser console for navigation errors

## 📚 Full Documentation

For complete setup instructions, see:
- **`OTP_AUTH_SETUP.md`** - Detailed setup guide
- **`/app/components/EmailOtpLogin.tsx`** - Component source code
- **`/app/routes/api.auth.send-otp.ts`** - Send OTP API
- **`/app/routes/api.auth.verify-otp.ts`** - Verify OTP API

## 🎉 You're Ready!

Your OTP authentication system is fully functional in development mode. Test it now at `/login`!

For production deployment, follow the steps in `OTP_AUTH_SETUP.md`.
