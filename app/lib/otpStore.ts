// Shared OTP storage
// In production, replace this with Redis or a database

export interface OTPData {
  otp: string;
  expiresAt: number;
}

// In-memory storage (development only)
export const otpStore = new Map<string, OTPData>();

// Helper functions
export function storeOTP(identifier: string, otp: string, expiresInMs: number = 5 * 60 * 1000) {
  const expiresAt = Date.now() + expiresInMs;
  otpStore.set(identifier, {otp, expiresAt});
  
  // Auto-cleanup after expiration
  setTimeout(() => {
    otpStore.delete(identifier);
  }, expiresInMs);
}

export function getOTP(identifier: string): OTPData | null {
  const data = otpStore.get(identifier);
  
  if (!data) {
    return null;
  }
  
  // Check if expired
  if (Date.now() > data.expiresAt) {
    otpStore.delete(identifier);
    return null;
  }
  
  return data;
}

export function deleteOTP(identifier: string): void {
  otpStore.delete(identifier);
}

export function clearExpiredOTPs(): void {
  const now = Date.now();
  for (const [identifier, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(identifier);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(clearExpiredOTPs, 60 * 1000);
}
