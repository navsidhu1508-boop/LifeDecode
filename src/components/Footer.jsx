import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/80">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Life<span className="text-violet-600">Decode</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Understand complicated things. Make smarter decisions. Turning legal, medical, and financial jargon into crystal-clear plain language.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Document Retention Guarantee</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Decoder
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/decode" className="hover:text-violet-600 transition-colors">
                  AI Text Decoder
                </Link>
              </li>
              <li>
                <Link to="/decode" className="hover:text-violet-600 transition-colors">
                  PDF Document Upload
                </Link>
              </li>
              <li>
                <Link to="/decode" className="hover:text-violet-600 transition-colors">
                  Screenshot & Image OCR
                </Link>
              </li>
              <li>
                <Link to="/decode" className="hover:text-violet-600 transition-colors">
                  Multi-language (EN / HI / PB)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/about" className="hover:text-violet-600 transition-colors">
                  About LifeDecode
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-violet-600 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-violet-600 transition-colors">
                  Powered by Gemini <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Privacy & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/privacy" className="hover:text-violet-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-violet-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy#security" className="hover:text-violet-600 transition-colors">
                  Security Architecture
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LifeDecode. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-lg">
            LifeDecode provides educational plain-language explanations and does not substitute for qualified legal, medical, or financial counsel.
          </p>
        </div>
      </div>
    </footer>
  );
}
