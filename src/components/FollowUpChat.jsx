import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2, HelpCircle } from 'lucide-react';
import { askFollowUpQuestion } from '../services/gemini';

export default function FollowUpChat({ originalContent, decodedResult, language = 'English' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Have questions about this document? Ask me anything specific and I'll explain it clearly in ${language} without jargon.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'What is the biggest risk for me in this document?',
    'What are the key deadlines or critical dates?',
    'Are there any penalties, fees, or hidden costs mentioned?',
    'What should I ask or negotiate before signing/agreeing?'
  ];

  const handleSend = async (questionText) => {
    const q = questionText || input;
    if (!q || !q.trim() || loading) return;

    const userMessage = { sender: 'user', text: q.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await askFollowUpQuestion({
        question: q.trim(),
        originalContent,
        decodedResult,
        history: newHistory,
        language
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response.answer || 'I could not find information about that in the supplied document.'
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an issue answering your follow-up question. Please make sure the Gemini API key is configured.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Ask Follow-up Questions
          </h3>
          <p className="text-xs text-slate-500">
            Get instant answers grounded strictly in your decoded document
          </p>
        </div>
      </div>

      {/* Suggested chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-50 hover:bg-violet-50 hover:text-violet-700 text-slate-600 border border-slate-200 transition-colors flex items-center gap-1.5 text-left disabled:opacity-50"
          >
            <HelpCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="mt-5 space-y-3.5 max-h-96 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-sm ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-xl leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-sm text-slate-500 italic">
            <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Reviewing document to answer your question...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-5 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about this document in ${language}...`}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-sm flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
