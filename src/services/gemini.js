/**
 * Gemini AI client service communicating securely with server-side /api functions
 */

async function parseApiResponse(response, fallbackErrorMessage) {
  const rawText = await response.text();

  if (!rawText || !rawText.trim()) {
    if (!response.ok) {
      const err = new Error(
        `${fallbackErrorMessage} (Server returned HTTP ${response.status} with an empty response.)`
      );
      err.status = response.status;
      throw err;
    }
    throw new Error('The server returned an empty response. Please try again.');
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    const err = new Error(
      response.ok
        ? 'The server returned an unexpected non-JSON response. Please make sure the LifeDecode API server is running.'
        : `${fallbackErrorMessage} (HTTP ${response.status}). Please verify the backend API server is running.`
    );
    err.status = response.status;
    throw err;
  }

  if (!response.ok) {
    const errorMsg = data.message || data.error || fallbackErrorMessage;
    const err = new Error(errorMsg);
    err.code = data.error;
    err.errors = data.errors;
    err.status = response.status;
    throw err;
  }

  return data;
}

function normalizeNetworkError(error, fallbackMessage) {
  if (error instanceof TypeError || (error.message && /failed to fetch|networkerror|load failed/i.test(error.message))) {
    return new Error('Network error: Could not connect to the LifeDecode server. Please check your internet connection and try again.');
  }
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export async function checkServerConfig() {
  try {
    const res = await fetch('/api/config-check');
    if (!res.ok) return { configured: false };
    return await parseApiResponse(res, 'Config check failed');
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

    const data = await parseApiResponse(response, 'Failed to decode document.');
    if (!data || !data.data) {
      throw new Error('The AI decoder returned an incomplete response. Please try again.');
    }
    return data;
  } catch (error) {
    console.error('Service decodeDocument error:', error);
    throw normalizeNetworkError(error, 'Failed to decode document.');
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

    return await parseApiResponse(response, 'Failed to process follow-up.');
  } catch (error) {
    console.error('Service askFollowUpQuestion error:', error);
    throw normalizeNetworkError(error, 'Failed to process follow-up.');
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

    return await parseApiResponse(response, 'Validation failed');
  } catch (error) {
    console.error('Service submitContactInquiry error:', error);
    throw normalizeNetworkError(error, 'Failed to submit inquiry.');
  }
}
