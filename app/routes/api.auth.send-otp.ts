import type {ActionFunction} from 'react-router';
import {storeOTP} from '~/lib/otpStore';

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Email sending function (integrate with your email service)
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // TODO: Integrate with your email service (SendGrid, Mailgun, etc.)
    console.log(`Sending OTP ${otp} to ${email}`);
    
    // For development, just log the OTP
    // In production, use an email service:
    /*
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{to: [{email}]}],
        from: {email: 'noreply@cricketshpere.com'},
        subject: 'Your OTP Code',
        content: [{
          type: 'text/html',
          value: `<p>Your OTP code is: <strong>${otp}</strong></p><p>Valid for 5 minutes.</p>`
        }]
      })
    });
    */
    
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

// SMS sending function (integrate with your SMS service)
async function sendOTPSMS(phone: string, otp: string): Promise<boolean> {
  try {
    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log(`Sending OTP ${otp} to ${phone}`);
    
    // In production, use an SMS service:
    /*
    await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phone,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: `Your Cricket Sphere OTP is: ${otp}. Valid for 5 minutes.`
      })
    });
    */
    
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

export const action: ActionFunction = async ({request}) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    const body = await request.json() as {identifier?: string; type?: string};
    const {identifier, type} = body;

    if (!identifier || !type) {
      return new Response(JSON.stringify({error: 'Identifier and type are required'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Validate email or phone
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        return new Response(JSON.stringify({error: 'Invalid email format'}), {
          status: 400,
          headers: {'Content-Type': 'application/json'},
        });
      }
    } else if (type === 'phone') {
      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      if (!phoneRegex.test(identifier)) {
        return new Response(JSON.stringify({error: 'Invalid phone format'}), {
          status: 400,
          headers: {'Content-Type': 'application/json'},
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP (expires in 5 minutes)
    storeOTP(identifier, otp, 5 * 60 * 1000);

    // Send OTP
    let sent = false;
    if (type === 'email') {
      sent = await sendOTPEmail(identifier, otp);
    } else if (type === 'phone') {
      sent = await sendOTPSMS(identifier, otp);
    }

    if (!sent) {
      return new Response(JSON.stringify({error: 'Failed to send OTP'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: `OTP sent to ${identifier}`,
      // For development only - remove in production
      devOTP: process.env.NODE_ENV === 'development' ? otp : undefined,
    }), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return new Response(JSON.stringify({error: 'Internal server error'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
};
