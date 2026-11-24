import React from 'react';
import { AlertTriangle, ShieldAlert, HeartPulse, Scale, DollarSign, Info } from 'lucide-react';

export default function DisclaimerBanner({ category, customNotice, completenessNotice }) {
  const getBannerDetails = () => {
    switch (category) {
      case 'medical':
        return {
          icon: HeartPulse,
          title: 'Medical Information Disclaimer',
          text: customNotice || 'This summary explains clinical terminology in everyday words for your personal understanding. LifeDecode is an AI clarification tool and does not provide medical diagnoses, treatment advice, or replace a licensed physician.',
          bg: 'bg-rose-50/90 border-rose-200 text-rose-950',
          iconColor: 'text-rose-600'
        };
      case 'legal':
        return {
          icon: Scale,
          title: 'Legal Agreement Disclaimer',
          text: customNotice || 'This explanation clarifies legal wording and clauses for educational purposes. It does not constitute legal counsel, attorney-client representation, or formal legal advice. Always review important contracts with an attorney.',
          bg: 'bg-amber-50/90 border-amber-200 text-amber-950',
          iconColor: 'text-amber-600'
        };
      case 'financial':
        return {
          icon: DollarSign,
          title: 'Financial & Loan Terms Disclaimer',
          text: customNotice || 'This breakdown explains financial terms, interest schedules, and obligations. LifeDecode is not a certified financial planner, lender, or tax advisor. Consult with an accredited professional before making financial commitments.',
          bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
          iconColor: 'text-emerald-600'
        };
      default:
        return {
          icon: Info,
          title: 'Educational Clarification',
          text: customNotice || 'LifeDecode explains complicated texts into everyday language. Critical facts and dates have been preserved, but you should always refer to the original document for official matters.',
          bg: 'bg-slate-50 border-slate-200 text-slate-800',
          iconColor: 'text-violet-600'
        };
    }
  };

  const details = getBannerDetails();
  const Icon = details.icon;

  return (
    <div className="space-y-3">
      {/* Category disclaimer */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${details.bg}`}>
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${details.iconColor}`} />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-semibold block mb-0.5">{details.title}</strong>
          <span className="opacity-90">{details.text}</span>
        </div>
      </div>

      {/* Completeness / Partial document alert if triggered */}
      {completenessNotice && (
        <div className="p-3.5 rounded-xl border bg-orange-50/90 border-orange-200 text-orange-900 flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-orange-600 mt-0.5" />
          <div>
            <strong className="font-semibold block">Incomplete Document Notice:</strong>
            <span>{completenessNotice}</span>
          </div>
        </div>
      )}
    </div>
  );
}
