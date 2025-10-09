// Utils/Helpers.ts - Utility functions for the ThinkPlus backend

/**
 * Generate a simple JWT-like token
 * In production, use a proper JWT library
 */
export function generateToken(userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `token_${userId}_${timestamp}_${random}`;
}

/**
 * Verify and extract userId from token
 * Returns userId if valid, null otherwise
 */
export function verifyToken(token: string): string | null {
  if (!token || !token.startsWith("token_")) {
    return null;
  }
  
  const parts = token.split("_");
  if (parts.length < 2) {
    return null;
  }
  
  return parts[1] || null;
}

/**
 * Hash password (placeholder - use bcrypt in production)
 * For now, just returns the password as-is
 */
export function hashPassword(password: string): string {
  // TODO: Implement proper password hashing with bcrypt
  // For development, returning as-is
  return password;
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  // TODO: Implement proper password verification with bcrypt
  // For development, direct comparison
  return password === hash;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Returns true if password meets minimum requirements
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

/**
 * Calculate percentage score
 */
export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Format date to ISO string
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Extract token from Authorization header
 * Supports both "Bearer token" and plain token formats
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  
  return authHeader;
}

/**
 * Validate required fields in request body
 * Returns array of missing fields
 */
export function validateRequiredFields(
  body: Record<string, any>,
  requiredFields: string[]
): string[] {
  const missing: string[] = [];
  
  for (const field of requiredFields) {
    if (!body[field] || body[field].toString().trim() === "") {
      missing.push(field);
    }
  }
  
  return missing;
}

/**
 * Create standardized API response
 */
export function createResponse(
  data: any,
  status: number = 200,
  additionalHeaders: Record<string, string> = {}
): Response {
  const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...additionalHeaders,
  };
  
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400
): Response {
  return createResponse({ error: message }, status);
}

/**
 * Create success response
 */
export function createSuccessResponse(
  message: string,
  data: any = {}
): Response {
  return createResponse({ message, ...data }, 200);
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Check if user is authenticated from request
 * Returns userId if authenticated, null otherwise
 */
export function authenticateRequest(req: Request): string | null {
  const authHeader = req.headers.get("Authorization");
  const token = extractToken(authHeader);
  
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Sleep/delay utility for testing
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}