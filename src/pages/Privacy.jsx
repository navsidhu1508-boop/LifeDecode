import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff, Server, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy & Data Protection Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-sm">
          Last updated: November 24, 2026 • Effective immediately
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-card space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-violet-600" />
            <span>1. Zero Document Retention Policy</span>
          </h2>
          <p>
            At LifeDecode, we treat your documents with the highest degree of confidentiality. When you upload a PDF, screenshot, or paste text, your document is processed <strong>strictly in volatile server memory</strong> for the sole purpose of generating the plain-language explanation.
          </p>
          <p>
            We <strong>never permanently store</strong> your documents, images, or extracted text in any database or file system. Once your explanation is delivered to your screen, the temporary buffer is immediately purged.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-emerald-600" />
            <span>2. Document Deletion Controls</span>
          </h2>
          <p>
            You maintain full sovereignty over your data at all times:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Clicking the <strong>Clear</strong> or <strong>Decode Another</strong> button immediately erases all displayed text, uploaded file memory, and generated results from your active session.</li>
            <li>We do not store your documents in browser local storage (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">localStorage</code>), ensuring that shared computers or mobile devices leave zero residual trails of your private agreements.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-600" />
            <span>3. Third-Party AI Processing</span>
          </h2>
          <p>
            LifeDecode connects to Google's official Gemini API to perform document understanding and language translation.
          </p>
          <p>
            Under Google's API data governance standards, data submitted via paid or enterprise API endpoints is not used to train or improve foundational models. Your API keys and secrets remain protected on the server side and are never exposed to client browsers.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-600" />
            <span>4. No Advertising or Personal Data Brokering</span>
          </h2>
          <p>
            LifeDecode does not sell, license, or monetize your submitted documents, personal inquiries, or usage habits to third-party advertisers, data brokers, or insurers.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            5. Contacting Privacy Support
          </h2>
          <p>
            If you have questions regarding our security architecture or privacy commitments, please reach out to our team through our{' '}
            <a href="/contact" className="text-violet-600 font-semibold underline">Contact Page</a>.
          </p>
        </section>

      </div>

    </div>
  );
}
