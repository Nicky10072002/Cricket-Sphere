# OTP Authentication Setup Guide

## Overview
This guide explains how to set up and use the OTP-based authentication system for your Cricket Sphere Shopify Hydrogen store.

## Features
- ✅ Email and Phone number support
- ✅ 6-digit OTP generation
- ✅ 5-minute OTP expiration
- ✅ 30-second resend timer
- ✅ Beautiful, responsive UI
- ✅ Automatic redirect after successful login
- ✅ Development mode with visible OTP

## Architecture

### Backend API Routes
1. **`/api/auth/send-otp`** - Generates and sends OTP
2. **`/api/auth/verify-otp`** - Verifies OTP and creates session

### Frontend Components
1. **`EmailOtpLogin`** - Main login component
2. **`/login`** - Login page route

## Setup Instructions

### 1. Install Required Dependencies

For email sending (choose one):
```bash
# SendGrid
npm install @sendgrid/mail

# Mailgun
npm install mailgun-js

# Nodemailer
npm install nodemailer
```

For SMS sending (choose one):
```bash
# Twilio
npm install twilio

# AWS SNS
npm install @aws-sdk/client-sns
```

### 2. Configure Environment Variables

Create or update your `.env` file:

```env
# Email Service (SendGrid example)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# SMS Service (Twilio example)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Session Secret
SESSION_SECRET=your_session_secret_key
```

### 3. Implement Email Service

Update `/app/routes/api.auth.send-otp.ts`:

#### SendGrid Example:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Your Cricket Sphere OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Cricket Sphere</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #f59e0b; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}
```

#### Nodemailer Example:
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your Cricket Sphere OTP Code',
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}
```

### 4. Implement SMS Service

#### Twilio Example:
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  try {
    await client.messages.create({
      body: `Your Cricket Sphere OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}
```

### 5. Production OTP Storage

Replace the in-memory Map with Redis:

```bash
npm install redis
```

```typescript
import {createClient} from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

await redis.connect();

// Store OTP
await redis.setEx(
  `otp:${identifier}`,
  300, // 5 minutes
  JSON.stringify({otp, expiresAt})
);

// Get OTP
const data = await redis.get(`otp:${identifier}`);
const storedData = data ? JSON.parse(data) : null;

// Delete OTP
await redis.del(`otp:${identifier}`);
```

### 6. Shopify Customer Integration

Update `/app/routes/api.auth.verify-otp.ts` to properly integrate with Shopify:

```typescript
async function createCustomerSession(identifier: string, context: any) {
  const {storefront} = context;

  // Check if customer exists
  const existingCustomer = await storefront.query(`
    query getCustomerByEmail($email: String!) {
      customer(email: $email) {
        id
        email
      }
    }
  `, {
    variables: {email: identifier}
  });

  if (!existingCustomer?.customer) {
    // Create new customer
    const createResult = await storefront.mutate(`
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `, {
      variables: {
        input: {
          email: identifier,
          acceptsMarketing: false,
        }
      }
    });

    if (createResult.customerUserErrors?.length > 0) {
      throw new Error('Failed to create customer');
    }
  }

  // Generate customer access token
  // Note: You'll need to implement Shopify Customer Account API
  // or use multipass for token generation
  
  return customerAccessToken;
}
```

## Usage

### Basic Usage
```tsx
import {EmailOtpLogin} from '~/components/EmailOtpLogin';

export default function LoginPage() {
  return <EmailOtpLogin />;
}
```

### With Custom Redirect
```tsx
<EmailOtpLogin redirectTo="/account" />
```

### With Success Callback
```tsx
<EmailOtpLogin 
  redirectTo="/account"
  onSuccess={() => {
    console.log('User logged in successfully');
    // Track analytics, etc.
  }}
/>
```

## Testing

### Development Mode
In development, the OTP is displayed on screen for easy testing.

### Test Flow
1. Navigate to `/login`
2. Choose Email or Phone
3. Enter your email/phone
4. Click "Send OTP"
5. Check your email/SMS (or see dev OTP on screen)
6. Enter the 6-digit OTP
7. Click "Verify & Login"
8. You'll be redirected to the homepage

## Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse
   ```typescript
   // Example with simple in-memory rate limiting
   const rateLimitMap = new Map<string, number>();
   
   const attempts = rateLimitMap.get(identifier) || 0;
   if (attempts >= 5) {
     return new Response(
       JSON.stringify({error: 'Too many attempts. Try again later.'}),
       {status: 429}
     );
   }
   rateLimitMap.set(identifier, attempts + 1);
   ```

2. **HTTPS Only**: Always use HTTPS in production

3. **OTP Expiration**: OTPs expire after 5 minutes

4. **Single Use**: OTPs are deleted after verification

5. **Secure Storage**: Use Redis or database in production, not in-memory storage

## Customization

### Change OTP Length
In `/app/routes/api.auth.send-otp.ts`:
```typescript
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}
```

### Change Expiration Time
```typescript
const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
```

### Change Resend Timer
In `/app/components/EmailOtpLogin.tsx`:
```typescript
setResendTimer(60); // 60 seconds
```

### Customize UI Colors
Update the Tailwind classes in `EmailOtpLogin.tsx`:
```tsx
// Change from amber to blue
className="bg-gradient-to-r from-blue-500 to-indigo-500"
```

## Troubleshooting

### OTP Not Received
- Check email/SMS service credentials
- Verify the identifier format
- Check spam folder for emails
- Ensure phone number includes country code

### Session Not Persisting
- Verify session configuration in `server.ts`
- Check cookie settings
- Ensure HTTPS in production

### API Routes Not Working
- Verify route file names match pattern: `api.auth.*.ts`
- Check server logs for errors
- Ensure proper TypeScript types

## Production Checklist

- [ ] Configure email service (SendGrid, Mailgun, etc.)
- [ ] Configure SMS service (Twilio, AWS SNS, etc.)
- [ ] Set up Redis for OTP storage
- [ ] Add rate limiting
- [ ] Remove dev OTP display
- [ ] Enable HTTPS
- [ ] Set up proper session management
- [ ] Integrate with Shopify Customer Account API
- [ ] Add analytics tracking
- [ ] Test on mobile devices
- [ ] Add error monitoring (Sentry, etc.)

## Support

For issues or questions:
1. Check the Shopify Hydrogen documentation
2. Review the Shopify Customer Account API docs
3. Check your email/SMS service provider docs

## License

This implementation is part of your Cricket Sphere project.
