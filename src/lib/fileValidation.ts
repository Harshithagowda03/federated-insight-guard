import { z } from "zod";

// Allowed file types for threat dataset uploads
export const ALLOWED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'application/vnd.tcpdump.pcap': ['.pcap'],
  'text/plain': ['.log'],
} as const;

export const ALLOWED_EXTENSIONS = ['.csv', '.json', '.pcap', '.log'];

// Maximum file size: 50MB
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// File validation schema
export const fileUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number()
    .max(MAX_FILE_SIZE, `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`),
  type: z.string(),
});

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file for upload security
 * Checks extension, size, and MIME type
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of 50MB`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: `File "${file.name}" is empty`,
    };
  }

  // Check file extension
  const extension = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File type "${extension}" is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Basic MIME type validation (client-side, server should verify with magic bytes)
  const validMimeTypes = Object.keys(ALLOWED_FILE_TYPES);
  const isValidMime = validMimeTypes.some(mime => 
    file.type === mime || 
    file.type === '' || // Some browsers don't set type for certain files
    file.type === 'application/octet-stream'
  );

  if (!isValidMime && file.type !== '') {
    return {
      valid: false,
      error: `Invalid file type "${file.type}" for "${file.name}"`,
    };
  }

  return { valid: true };
}

/**
 * Validates multiple files
 */
export function validateFiles(files: FileList | File[]): {
  validFiles: File[];
  errors: string[];
} {
  const validFiles: File[] = [];
  const errors: string[] = [];

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const result = validateFile(file);
    if (result.valid) {
      validFiles.push(file);
    } else {
      errors.push(result.error || `Invalid file: ${file.name}`);
    }
  }

  return { validFiles, errors };
}

/**
 * Gets file extension in lowercase
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
