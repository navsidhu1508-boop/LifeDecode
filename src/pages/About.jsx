import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Eye, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 text-violet-800 text-xs font-semibold border border-violet-200">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Democratizing Understanding
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          LifeDecode was created to bridge the widening gap between complicated institutional language and everyday decision-making.
        </p>
      </div>

      {/* The Problem We Solve */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-card space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          The Problem: Fine Print Is Broken
        </h2>
        <div className="space-y-4 text-slate-600 leading-relaxed text-base">
          <p>
            Every single day, ordinary people are asked to sign 20-page rental agreements, accept high-stakes financial loan terms, or review complex medical diagnostic reports.
          </p>
          <p>
            These documents are intentionally written in dense legalese, technical acronyms, and confusing clauses. The result? People sign without understanding, get blindsided by unexpected penalty fees, miss critical deadlines, or experience immense stress over medical lab results they cannot decipher.
          </p>
          <p>
            Hiring a lawyer or medical consultant for every routine letter or contract is financially out of reach for most people. There has to be a better way.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center text-white">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">
            Our Mission
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            To make complicated information universally accessible, transparent, and easy to understand for everyone — in their native language and on their own terms.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We believe that no one should ever make a major life decision in the dark simply because the contract was filled with legal jargon.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Our Commitment to Privacy
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Your personal agreements and medical summaries belong strictly to you. LifeDecode is built on a foundational <strong>Zero Document Retention Policy</strong>.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We do not store your documents in databases, do not build personal profiles, and do not retain uploads after your explanation is generated.
          </p>
        </div>

      </div>

      {/* Core Principles */}
      <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          What Guides LifeDecode
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-violet-600" />
              <span>Uncompromising Truth</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We never fabricate facts, assume missing numbers, or hide risks. If a document is ambiguous or incomplete, we tell you upfront.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-violet-600" />
              <span>Radical Simplicity</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Simplicity does not mean dumbing down. It means translating complicated ideas into clear, actionable everyday language without losing nuance.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-violet-600" />
              <span>Multilingual Inclusion</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              True accessibility means understanding in your own language. We proudly support English and Hindi with more languages on our roadmap.
            </p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/decode"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all group"
        >
          <span>Try LifeDecode Today</span>
          <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
