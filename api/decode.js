import { GoogleGenerativeAI } from '@google/generative-ai';

const ALLOWED_LANGUAGES = ['English', 'Hindi'];
const ALLOWED_STYLES = ['Very Simple', 'Detailed', 'Step-by-Step'];

function classifyGeminiError(error) {
  const msg = String(error?.message || '');
  const status = error?.status;

  if (status === 429 || /429|quota|resource_exhausted|rate limit/i.test(msg)) {
    return {
      status: 429,
      code: 'QUOTA_EXCEEDED',
      message: 'Gemini API quota or rate limit exceeded. Please wait a moment and try again, or check your Gemini API billing/quota.'
    };
  }

  if (status === 401 || status === 403 || /api_key_invalid|api key not valid|permission_denied|unauthorized/i.test(msg)) {
    return {
      status: 401,
      code: 'GEMINI_API_KEY_INVALID',
      message: 'The configured GEMINI_API_KEY is invalid or lacks permission. Please verify your key in your environment variables.'
    };
  }

  if (/enotfound|econnrefused|etimedout|fetch failed|network|socket/i.test(msg)) {
    return {
      status: 503,
      code: 'NETWORK_ERROR',
      message: 'Could not reach the Gemini AI service due to a network issue. Please try again shortly.'
    };
  }

  return {
    status: 500,
    code: 'PROCESSING_ERROR',
    message: msg || 'An error occurred while decoding your document.'
  };
}

function parseAiJson(responseText) {
  const cleaned = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Response is not valid JSON');
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY_MISSING',
      message: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in your environment variables (.env locally or Railway Variables in production).'
    });
  }

  try {
    const { text, fileData, language = 'English', style = 'Very Simple' } = req.body || {};

    if ((!text || text.trim() === '') && (!fileData || !fileData.base64)) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Please provide text or an uploaded document/image to decode.' });
    }

    const targetLanguage = ALLOWED_LANGUAGES.includes(language) ? language : null;
    if (!targetLanguage) {
      return res.status(400).json({ error: 'UNSUPPORTED_LANGUAGE', message: 'Unsupported language. Only English and Hindi are supported.' });
    }

    const targetStyle = ALLOWED_STYLES.includes(style) ? style : 'Very Simple';

    const genAI = new GoogleGenerativeAI(apiKey.trim());

    // List of models to try in order of preference
    const modelCandidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

    const systemPrompt = `You are LifeDecode, a world-class plain-language expert.
Your job is to take complicated, jargon-heavy documents (legal contracts, medical lab reports, insurance policies, financial loans, government notices, technical agreements) and explain them so that ANY ordinary person can understand them easily and make smart decisions.

CRITICAL RULES:
1. Target Language: Output ALL explanations, terminology definitions, bullet points, and next steps strictly in ${targetLanguage}.
   - If Hindi, use natural, conversational Devanagari Hindi (हिन्दी) that normal people speak.
   - If English, use friendly, accessible modern English.
2. Tone & Style: ${targetStyle}.
   - "Very Simple": Speak like a trusted, clear friend. Use everyday analogies. Zero unnecessary jargon.
   - "Detailed": Provide thorough explanations of every clause and detail, but in crystal-clear plain language.
   - "Step-by-Step": Break down everything sequentially into actionable steps and chronological outcomes.
3. Accuracy & Integrity:
   - Preserve ALL numbers, amounts, percentages, deadlines, interest rates, conditions, and dates exactly as given.
   - Never invent or fabricate information not in the text.
   - Clearly distinguish between definite facts stated in the document versus assumptions or ambiguities.
   - If the document is incomplete, cut off, or missing key pages/sections, explicitly note that in "completenessNotice".
4. Disclaimers:
   - Categorize the document into one of: "legal", "financial", "medical", "technical", "general".
   - Always provide a realistic, helpful disclaimer for legal/financial/medical content stating that LifeDecode provides educational plain-language explanations and does not substitute for qualified professional advice.

RESPONSE FORMAT:
You MUST respond with a valid, pure JSON object with the following exact keys (no markdown formatting around the JSON, no backticks if possible, just the raw JSON):
{
  "category": "legal | financial | medical | technical | general",
  "documentSummary": "A concise 1-2 sentence high-level summary of what this document actually is.",
  "simpleExplanation": "The core explanation in everyday conversational language.",
  "importantPoints": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
  "difficultWords": [
    { "term": "Jargon term in original document", "meaning": "What it actually means in plain words" }
  ],
  "whatYouShouldKnow": [
    "Crucial risk, penalty, fee, hidden condition, deadline, or side effect 1",
    "Crucial risk, penalty, fee, hidden condition, deadline, or side effect 2"
  ],
  "suggestedNextSteps": [
    "Practical action 1 the user should consider taking",
    "Practical action 2"
  ],
  "completenessNotice": "Note any missing context or null if complete",
  "disclaimer": "Appropriate contextual disclaimer statement."
}`;

    const parts = [{ text: systemPrompt }];

    if (text && text.trim()) {
      parts.push({
        text: `\n\n--- DOCUMENT CONTENT TO DECODE ---\n${text.trim()}\n--- END OF CONTENT ---\n\nAnalyze the content above and produce the requested JSON explanation in ${targetLanguage} with ${targetStyle} style.`
      });
    }

    if (fileData && fileData.base64 && fileData.mimeType) {
      // Clean base64 string if it contains data URI header
      const base64Data = fileData.base64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: fileData.mimeType,
          data: base64Data
        }
      });
      parts.push({
        text: `\n\nPlease decode the attached file (${fileData.name || 'uploaded document'}) carefully according to the instructions above, outputting the JSON response in ${targetLanguage}.`
      });
    }

    let responseText = null;
    let lastError = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          }
        });

        const result = await model.generateContent(parts);
        const response = await result.response;
        const candidateText = response.text();
        if (candidateText && candidateText.trim()) {
          responseText = candidateText;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying fallback:`, err.message);
        const classified = classifyGeminiError(err);
        if (classified.code === 'GEMINI_API_KEY_INVALID') {
          return res.status(classified.status).json({
            error: classified.code,
            message: classified.message
          });
        }
      }
    }

    if (!responseText) {
      if (lastError) {
        throw lastError;
      }
      return res.status(502).json({
        error: 'EMPTY_AI_RESPONSE',
        message: 'The AI model returned an empty response. Please try again with clearer or shorter text.'
      });
    }

    // Parse the JSON result cleanly
    let parsedResult;
    try {
      parsedResult = parseAiJson(responseText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON response:', responseText);
      return res.status(502).json({
        error: 'PARSE_ERROR',
        message: 'The AI model returned an incomplete or invalid JSON response. Please try decoding again.'
      });
    }

    if (!parsedResult || typeof parsedResult !== 'object' || (!parsedResult.simpleExplanation && !parsedResult.documentSummary)) {
      return res.status(502).json({
        error: 'INCOMPLETE_AI_RESPONSE',
        message: 'The AI response did not contain a valid explanation. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      data: parsedResult,
      meta: {
        language: targetLanguage,
        style: targetStyle,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('LifeDecode decode error:', error);
    const classified = classifyGeminiError(error);
    return res.status(classified.status).json({
      error: classified.code,
      message: classified.message
    });
  }
}
