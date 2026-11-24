/**
 * Gemini AI client service communicating securely with server-side /api functions
 */

export async function checkServerConfig() {
  try {
    const res = await fetch('/api/config-check');
    if (!res.ok) return { configured: false };
    return await res.json();
  } catch (err) {
    console.warn('Config check failed:', err);
    return { configured: false };
  }
}

export async function decodeDocument({ text, fileData, language = 'English', style = 'Very Simple' }) {
  try {
    const response = await fetch('/api/decode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        fileData: fileData ? {
          name: fileData.name,
          mimeType: fileData.mimeType,
          base64: fileData.base64
        } : null,
        language,
        style
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || data.error || 'Failed to decode document.';
      const err = new Error(errorMsg);
      err.code = data.error;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('Service decodeDocument error:', error);
    throw error;
  }
}

export async function askFollowUpQuestion({ question, originalContent, decodedResult, history = [], language = 'English' }) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        originalContent,
        decodedResult,
        history,
        language
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to process follow-up.');
    }

    return data;
  } catch (error) {
    console.error('Service askFollowUpQuestion error:', error);
    throw error;
  }
}

export async function submitContactInquiry(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      const err = new Error(data.message || 'Validation failed');
      err.errors = data.errors;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('Service submitContactInquiry error:', error);
    throw error;
  }
}
