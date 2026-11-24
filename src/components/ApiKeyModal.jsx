import React from 'react';
import { KeyRound, ExternalLink, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Gemini API Key Required
            </h3>
            <p className="text-xs text-slate-500">
              LifeDecode requires a Google Gemini API key to decode documents
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600">
          <p>
            To enable real AI document decoding, you need to provide a Google Gemini API key on your server.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
              <span>Get a free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold underline inline-flex items-center gap-0.5">Google AI Studio <ExternalLink className="w-3 h-3" /></a></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
              <span><strong>For Local Testing:</strong> Create a <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">.env</code> file in the project folder with:</span>
            </div>
            <div className="pl-6 font-mono text-[11px] bg-slate-900 text-slate-200 p-2.5 rounded-lg select-all">
              GEMINI_API_KEY=your_actual_key_here
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
              <span><strong>For Vercel Deployment:</strong> Add <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">GEMINI_API_KEY</code> in your Vercel Project Settings → Environment Variables.</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Google provides free tier API quota for standard usage.</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
