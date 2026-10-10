import crypto from 'crypto';

// Server-side secret for signing tokens and verifying sessions
const SECRET_KEY = process.env.AUTH_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'apex-dental-secure-salt-2026-mumbai-studio';

/**
 * Hash a password using HMAC-SHA256 with a domain salt
 */
export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`apex_salt:${password}`)
    .digest('hex');
}

/**
 * Verify a plain password against a stored cryptographic hash
 */
export function verifyPassword(password: string, expectedHash: string): boolean {
  const computedHash = hashPassword(password);
  try {
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

/**
 * Create a tamper-proof signed session token (Payload + '.' + HMAC signature)
 */
export function signSessionToken(payload: object): string {
  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr, 'utf-8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Payload)
    .digest('base64url');
  return `${base64Payload}.${signature}`;
}

/**
 * Verify and parse a signed session token. Returns null if forged or expired.
 */
export function verifySessionToken<T = any>(token: string): T | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [base64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Payload)
    .digest('base64url');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isMatch) return null;

    const decoded = Buffer.from(base64Payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

// In-memory sliding rate limiter (5 failed attempts per 15 minutes)
interface RateLimitEntry {
  attempts: number;
  lockUntil: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingSeconds?: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) return { allowed: true };

  if (entry.lockUntil > now) {
    return {
      allowed: false,
      remainingSeconds: Math.ceil((entry.lockUntil - now) / 1000),
    };
  }

  // If lockout expired, reset
  if (entry.lockUntil > 0 && entry.lockUntil <= now) {
    rateLimitMap.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordAuthFailure(identifier: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier) || { attempts: 0, lockUntil: 0 };
  entry.attempts += 1;

  if (entry.attempts >= 5) {
    entry.lockUntil = now + 15 * 60 * 1000; // 15-minute lockout
  }
  rateLimitMap.set(identifier, entry);
}

export function recordAuthSuccess(identifier: string) {
  rateLimitMap.delete(identifier);
}

/**
 * Sanitize user string content to prevent XSS injection
 */
export function sanitizeInputText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Anti-bot timing challenge: verifies form was not filled instantly by an automated script
 */
export function validateFormTiming(submittedAtTimestamp: number, minSeconds = 1.5): boolean {
  if (!submittedAtTimestamp) return true; // fallback if not provided
  const now = Date.now();
  const elapsedSeconds = (now - submittedAtTimestamp) / 1000;
  return elapsedSeconds >= minSeconds;
}

/**
 * File upload validation rules
 */
export function validateFileUploadSecurity(file: {
  size: number;
  type: string;
  name: string;
}): { valid: boolean; error?: string } {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB max
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'File exceeds maximum allowed size of 5MB.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Invalid file format. Only JPEG, PNG, WEBP, and PDF are allowed.' };
  }

  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Prohibited file extension detected.' };
  }

  return { valid: true };
}
