/**
 * File validation and reader service for LifeDecode
 */

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const SUPPORTED_MIME_TYPES = {
  'application/pdf': 'PDF Document',
  'image/jpeg': 'JPEG Image',
  'image/jpg': 'JPG Image',
  'image/png': 'PNG Image',
  'image/webp': 'WebP Image',
  'text/plain': 'Text File'
};

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function validateUploadedFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit. Your file is ${formatFileSize(file.size)}.`
    };
  }

  const isSupported = Object.keys(SUPPORTED_MIME_TYPES).includes(file.type) ||
    file.name.match(/\.(pdf|jpe?g|png|webp|txt)$/i);

  if (!isSupported) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PDF, PNG, JPG, JPEG, or WebP file.'
    };
  }

  return { valid: true };
}

/**
 * Reads a file as Base64 data string
 */
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        base64: reader.result,
        lastModified: file.lastModified
      });
    };

    reader.onerror = (err) => {
      reject(new Error('Failed to read file: ' + err.message));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Reads a text file content directly
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(new Error('Failed to read text file: ' + err.message));
    reader.readAsText(file);
  });
}
