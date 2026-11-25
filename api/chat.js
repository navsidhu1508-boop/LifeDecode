import { GoogleGenerativeAI } from '@google/generative-ai';

const ALLOWED_LANGUAGES = ['English', 'Hindi'];

export default async function handler(req, res) {
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
      message: 'Gemini API key is not configured on the server.'
    });
  }

  try {
    const { question, originalContent, decodedResult, history = [], language = 'English' } = req.body || {};

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Please provide a question.' });
    }

    const targetLanguage = ALLOWED_LANGUAGES.includes(language) ? language : 'English';
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const modelCandidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

    const systemPrompt = `You are the LifeDecode Follow-up Assistant.
The user is asking a follow-up question regarding a document they just had decoded.
Your goal is to answer their specific question clearly, accurately, and in plain language (${targetLanguage}).

Context from the document:
${originalContent ? `Original content snippet:\n${originalContent.substring(0, 3000)}\n` : ''}
${decodedResult ? `Decoded summary:\n${JSON.stringify(decodedResult, null, 2).substring(0, 3000)}\n` : ''}

Rules:
1. Base your answer strictly on the facts in the document.
2. If the document does not mention or clarify the user's specific question, state clearly: "This document does not specify that information." Never guess or fabricate answers.
3. Answer in ${targetLanguage}.
4. Keep the tone helpful, empathetic, and easy to understand.`;

    const chatHistory = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: `Understood. I am ready to answer any questions about this document in simple ${targetLanguage}.` }] }
    ];

    // Add prior conversation turns (excluding the current pending user message if appended by client)
    if (Array.isArray(history)) {
      const trimmedQuestion = question.trim();
      const priorTurns = history.slice(-7);
      if (
        priorTurns.length > 0 &&
        priorTurns[priorTurns.length - 1]?.sender === 'user' &&
        priorTurns[priorTurns.length - 1]?.text?.trim() === trimmedQuestion
      ) {
        priorTurns.pop();
      }

      priorTurns.slice(-6).forEach((item) => {
        if (!item?.text) return;
        const role = item.sender === 'user' ? 'user' : 'model';
        if (chatHistory[chatHistory.length - 1]?.role !== role) {
          chatHistory.push({ role, parts: [{ text: item.text }] });
        }
      });

      if (chatHistory[chatHistory.length - 1]?.role === 'user') {
        chatHistory.pop();
      }
    }

    let answer = null;
    let lastError = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(question.trim());
        const text = result.response.text();
        if (text && text.trim()) {
          answer = text.trim();
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Chat model ${modelName} failed, trying fallback:`, err.message);
        if (/api_key_invalid|api key not valid|401|403/i.test(String(err?.message || ''))) {
          return res.status(401).json({
            error: 'GEMINI_API_KEY_INVALID',
            message: 'The configured GEMINI_API_KEY is invalid or lacks permission.'
          });
        }
      }
    }

    if (!answer) {
      throw lastError || new Error('The AI model returned an empty answer.');
    }

    return res.status(200).json({
      success: true,
      answer
    });

  } catch (error) {
    console.error('Follow-up chat error:', error);
    const msg = String(error?.message || '');
    const isQuota = error?.status === 429 || /429|quota|resource_exhausted/i.test(msg);
    return res.status(isQuota ? 429 : 500).json({
      error: isQuota ? 'QUOTA_EXCEEDED' : 'CHAT_ERROR',
      message: isQuota
        ? 'Gemini API quota or rate limit exceeded. Please try again shortly.'
        : msg || 'Failed to generate answer for your follow-up question.'
    });
  }
}
