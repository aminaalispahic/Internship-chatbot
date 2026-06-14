import crypto from "crypto";

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}