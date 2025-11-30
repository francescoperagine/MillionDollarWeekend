/**
 * Sanitization utilities to prevent XSS attacks
 * Similar to helmet but for input validation
 */

/**
 * Sanitizes a string by removing potentially dangerous HTML/script tags
 * and encoding special characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove any script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers (onclick, onerror, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Encode HTML special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates input length
 */
export function validateLength(input: string, min: number = 0, max: number = 5000): boolean {
  const length = input.trim().length;
  return length >= min && length <= max;
}

/**
 * Checks if input contains only allowed characters
 * Allows alphanumeric, spaces, and common punctuation
 */
export function isValidCharacters(input: string): boolean {
  // Allow letters, numbers, spaces, and common punctuation
  const validPattern = /^[a-zA-Z0-9\s\.,;:!?\-'"()\[\]@#$%&*+=_\n\r]*$/;
  return validPattern.test(input);
}

/**
 * Comprehensive validation function
 */
export interface ValidationError {
  key: string;
  params?: Record<string, number>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitized: string;
}

export function validateAndSanitize(
  input: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    allowSpecialChars?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 0,
    maxLength = 5000,
    required = false,
    allowSpecialChars = true
  } = options;

  const errors: ValidationError[] = [];
  const trimmed = input.trim();

  // Check if required
  if (required && !trimmed) {
    errors.push({ key: 'validation.required' });
  }

  // Check length
  if (trimmed && !validateLength(trimmed, minLength, maxLength)) {
    if (trimmed.length < minLength) {
      errors.push({ key: 'validation.minLength', params: { min: minLength } });
    } else {
      errors.push({ key: 'validation.maxLength', params: { max: maxLength } });
    }
  }

  // Check for valid characters
  if (trimmed && !allowSpecialChars && !isValidCharacters(trimmed)) {
    errors.push({ key: 'validation.invalidCharacters' });
  }

  // Sanitize the input
  const sanitized = sanitizeInput(input);

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}
