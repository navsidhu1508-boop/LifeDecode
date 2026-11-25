import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  Languages, 
  CheckCircle2, 
  ChevronDown, 
  HelpCircle, 
  Scale, 
  HeartPulse, 
  TrendingUp, 
  Lock, 
  Download,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'What types of documents can LifeDecode understand?',
      a: 'LifeDecode is trained to clarify a wide range of complicated texts, including rental and lease agreements, employment contracts, medical lab panels, insurance policy riders, loan disclosures, university terms, and government notices. You can paste plain text, upload PDFs, or upload screenshots and images (PNG, JPG).'
    },
    {
      q: 'What languages does LifeDecode support?',
      a: 'LifeDecode currently supports English and Hindi (हिन्दी). All explanations, jargon definitions, and next steps are generated natively in your chosen language.'
    },
    {
      q: 'Does LifeDecode store my documents or share them with others?',
      a: 'No. LifeDecode follows a strict Zero Document Retention principle. Your documents and images are processed in-memory solely to generate your plain-language explanation and are not stored in any permanent database or browser local storage.'
    },
    {
      q: 'Does LifeDecode replace a lawyer, doctor, or financial planner?',
      a: 'No. LifeDecode is an educational clarity tool designed to help you understand what documents actually mean. It does not provide legal counsel, formal medical diagnosis, or certified financial advice. For binding or high-stakes decisions, you should always consult a licensed professional.'
    },
    {
      q: 'What happens if a document has missing pages or unclear terms?',
      a: 'LifeDecode is strictly programmed never to invent missing details. If a document is cut off or ambiguous, our AI explicitly flags an "Incomplete Document Notice" and outlines what context is missing.'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-violet-200/40 to-indigo-100/30 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-800 text-xs sm:text-sm font-semibold shadow-subtle animate-fadeIn">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Understand complicated things. Make smarter decisions.</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Confused by complicated <span className="gradient-text">information?</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            Upload it, paste it, or share it. LifeDecode turns complicated information into explanations anyone can understand.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/decode"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all group"
            >
              <span>Start Decoding</span>
              <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Document Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-violet-600" />
              <span>English & Hindi</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>PDF, Images & Text</span>
            </div>
          </div>

        </div>

        {/* Visual Preview of the AI Explanation Dashboard */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-18">
          <div className="relative rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-4 shadow-card">
            
            {/* Top faux browser bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              </div>
              <span className="font-mono text-[11px] text-slate-500 font-medium">
                lifedecode.app/decode
              </span>
              <span className="text-[10px] text-violet-600 font-semibold bg-violet-50 px-2 py-0.5 rounded">
                Live Preview
              </span>
            </div>

            {/* Split comparison preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 bg-slate-50/50 rounded-xl mt-2">
              
              {/* Left: Original Complicated Document */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 uppercase tracking-wider">Original Input</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                    Legal Lease Clause
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100 max-h-48 overflow-hidden select-none opacity-80">
                  <p className="font-semibold text-slate-800 mb-1">§ 14.2 Early Termination & Liquidated Damages:</p>
                  "In the event Lessee vacates prior to expiration, Lessee shall immediately forfeit the security deposit ($2,400.00) and shall remain liable for an early cancellation penalty equivalent to two months base rent ($3,600.00)..."
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Heavy legal wording, intimidating conditions, difficult to gauge risk.
                </p>
              </div>

              {/* Right: Decoded Result in LifeDecode */}
              <div className="p-5 rounded-xl bg-white border border-violet-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                  LifeDecode Output
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-900">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Simple Explanation (Everyday English)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p className="bg-violet-50/50 p-2.5 rounded-lg border border-violet-100 font-medium">
                    "If you leave your apartment before the 12-month lease ends, you will lose your entire $2,400 security deposit AND you must pay another $3,600 within 10 days."
                  </p>
                  <div className="space-y-1 pt-1">
                    <div className="flex items-start gap-1.5 text-orange-800 bg-orange-50/70 p-2 rounded border border-orange-200 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Total Cost to Move Early:</strong> $6,000 out of pocket.</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>Available in: English & Hindi</span>
                  <Link to="/decode" className="text-violet-600 font-bold hover:underline inline-flex items-center gap-1">
                    Try with your own doc <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200/60">
            Startup Grade AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Real People, Built for Real Documents
          </h2>
          <p className="text-base text-slate-600">
            LifeDecode breaks down complex contracts, medical findings, and fine print into five transparent sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Everyday Plain Language
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No dense legal phrases or cryptic clinical jargon. Understand your agreement like you're talking with a smart, empathetic friend.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              PDF & Image OCR Processing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag and drop multi-page PDFs, take photos of paper contracts, or paste screenshots directly. We extract and decode the text seamlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              English & Hindi
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Break language barriers. Receive your decoded breakdown in clear everyday English or authentic Devanagari Hindi, not machine translations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Risk & Condition Callouts
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Never get caught off guard by hidden fees, auto-renewal hikes, penalties, or pre-existing condition exclusions buried on page 14.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Export Clean PDF Reports
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              One-click download of a structured, formatted PDF summary that you can save to your phone or print to take to a meeting or doctor visit.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-card transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Interactive Follow-up Q&A
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Still have a question? Ask our AI assistant specific follow-ups grounded strictly in your document without hallucinated facts.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How LifeDecode Works
            </h2>
            <p className="text-slate-400 text-base">
              From confusing fine print to clear understanding in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-extrabold flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white">
                Provide Your Document
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Paste any text snippet, drop a multi-page PDF document, or upload a photo or screenshot from your mobile phone or computer.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-extrabold flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white">
                Select Language & Style
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Choose between English or Hindi, and select your preferred explanation depth: Very Simple, Detailed, or Step-by-Step.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white font-extrabold flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white">
                Get Your Smart Breakdown
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Review key points, terminology explanations, critical warnings, and recommended next steps. Download as PDF or ask follow-ups.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              to="/decode"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all"
            >
              <span>Try LifeDecode Free</span>
              <ArrowRight className="w-4 h-4 text-violet-600" />
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200/60">
            Answers & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about LifeDecode's AI decoder and privacy standards.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-violet-600 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-violet-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop guessing. Start decoding.
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-violet-100 leading-relaxed">
            Join thousands of people who use LifeDecode to understand what they are signing, reading, or agreeing to.
          </p>
          <div className="pt-2">
            <Link
              to="/decode"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:scale-105 transition-all"
            >
              <span>Start Decoding Now</span>
              <ArrowRight className="w-5 h-5 text-violet-600" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
