import type {ActionFunction} from 'react-router';
import {getOTP, deleteOTP, otpStore} from '~/lib/otpStore';

export const action: ActionFunction = async ({request, context}) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    const body = await request.json() as {identifier?: string; otp?: string};
    const {identifier, otp} = body;

    if (!identifier || !otp) {
      return new Response(JSON.stringify({error: 'Identifier and OTP are required'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Get stored OTP
    const storedData = otpStore.get(identifier);

    if (!storedData) {
      return new Response(JSON.stringify({error: 'OTP not found or expired'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(identifier);
      return new Response(JSON.stringify({error: 'OTP has expired'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return new Response(JSON.stringify({error: 'Invalid OTP'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // OTP is valid, delete it
    otpStore.delete(identifier);

    // Create or get Shopify customer
    try {
      // Check if customer exists
      const {storefront} = context;
      
      // For email-based login, you can use Shopify's Customer Account API
      // This is a simplified version - you'll need to implement proper customer creation/login
      
      // Create customer access token (this requires Shopify Customer Account API setup)
      const customerAccessToken = await createCustomerSession(identifier, context);

      if (!customerAccessToken) {
        return new Response(JSON.stringify({error: 'Failed to create customer session'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        });
      }

      // Set session
      const {session} = context;
      session.set('customerAccessToken', customerAccessToken);

      return new Response(JSON.stringify({
        success: true,
        message: 'Login successful',
        customerAccessToken,
      }), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    } catch (error) {
      console.error('Error creating customer session:', error);
      return new Response(JSON.stringify({error: 'Failed to create customer session'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });
    }
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return new Response(JSON.stringify({error: 'Internal server error'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
};

// Helper function to create customer session
async function createCustomerSession(identifier: string, context: any) {
  try {
    // This is a simplified version
    // In production, you need to:
    // 1. Check if customer exists in Shopify
    // 2. If not, create a new customer
    // 3. Generate a customer access token
    // 4. Return the token

    const {storefront} = context;

    // Example: Create customer if doesn't exist
    // You'll need to implement proper customer creation logic
    const mutation = `
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
    `;

    // For now, return a mock token
    // In production, implement proper Shopify Customer Account API integration
    return 'mock-customer-token-' + Date.now();
  } catch (error) {
    console.error('Error in createCustomerSession:', error);
    return null;
  }
}
