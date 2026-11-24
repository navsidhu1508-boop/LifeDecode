import React from 'react';
import { Scale, AlertTriangle, FileCheck, ShieldAlert } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-800 text-xs font-semibold border border-violet-200">
          <Scale className="w-4 h-4 text-violet-600" />
          <span>User Agreement & Service Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-500 text-sm">
          Last updated: November 24, 2026
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-card space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">
            1. Nature of Service & Educational Disclaimer
          </h2>
          <p>
            LifeDecode provides automated artificial intelligence summaries designed to explain complicated documents in plain language.
          </p>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Crucial Notice:</strong> LifeDecode is NOT a law firm, certified financial planning agency, or medical healthcare provider. The explanations generated do not constitute formal legal counsel, attorney-client privilege, investment advice, or clinical medical diagnosis. Always consult accredited professionals for binding decisions.
            </span>
          </div>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            2. Permitted Use & Upload Guidelines
          </h2>
          <p>
            You agree to use LifeDecode solely for lawful purposes. You must not upload:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Documents or images containing illegal, illicit, or harmful content.</li>
            <li>Files designed to inject malicious scripts, viruses, or overwhelm server resources.</li>
            <li>Documents for which you do not possess the lawful authorization or right to inspect.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            3. Accuracy & AI Limitations
          </h2>
          <p>
            While LifeDecode employs advanced large language models with strict anti-hallucination instructions, automated AI interpretations may occasionally misinterpret ambiguous phrasing, handwritten text, or poor quality scans.
          </p>
          <p>
            Users are encouraged to verify critical figures, dates, and obligations directly against the original physical documents.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            4. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, LifeDecode and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your reliance upon the AI-generated explanations or summaries.
          </p>
        </section>

      </div>

    </div>
  );
}
