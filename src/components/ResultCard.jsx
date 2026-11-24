import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  ListOrdered, 
  AlertOctagon, 
  ArrowRight,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import DisclaimerBanner from './DisclaimerBanner';
import FollowUpChat from './FollowUpChat';
import { exportExplanationToPdf } from '../services/pdfExport';
import { CATEGORY_BADGES } from '../utils/constants';

export default function ResultCard({ 
  result, 
  metadata = {}, 
  originalContent = '', 
  onReset 
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const category = (result.category || 'general').toLowerCase();
  const categoryConfig = CATEGORY_BADGES[category] || CATEGORY_BADGES.general;

  const handleCopy = async () => {
    try {
      const formattedText = `
LIFEDECODE EXPLANATION REPORT
Category: ${result.category || 'Document'}
Language: ${metadata.language || 'English'}
Style: ${metadata.style || 'Very Simple'}

1. SIMPLE EXPLANATION:
${result.simpleExplanation || result.documentSummary || ''}

2. IMPORTANT POINTS:
${(result.importantPoints || []).map(p => `• ${p}`).join('\n')}

3. DIFFICULT WORDS EXPLAINED:
${(result.difficultWords || []).map(w => `• ${w.term}: ${w.meaning}`).join('\n')}

4. WHAT YOU SHOULD KNOW (RISKS & CONDITIONS):
${(result.whatYouShouldKnow || []).map(r => `! ${r}`).join('\n')}

5. SUGGESTED NEXT STEPS:
${(result.suggestedNextSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

DISCLAIMER:
${result.disclaimer || 'LifeDecode provides educational plain-language explanations.'}
      `.trim();

      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      exportExplanationToPdf(result, metadata);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not generate PDF. Please use the Copy button instead.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${categoryConfig.color}`}>
                {categoryConfig.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Decoded into {metadata.language || 'English'} ({metadata.style || 'Very Simple'})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              Plain-Language Explanation
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
              title="Copy plain text"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
              title="Download formatted PDF report"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>{downloading ? 'Preparing PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              title="Start a new decoding session"
            >
              <RotateCcw className="w-4 h-4 text-violet-400" />
              <span>Decode Another</span>
            </button>
          </div>
        </div>

        {/* High-level document summary banner */}
        {result.documentSummary && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900 block mb-0.5">What this document is:</strong>
              <span>{result.documentSummary}</span>
            </div>
          </div>
        )}

        {/* 1. Simple Explanation */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Simple Explanation
            </h3>
          </div>
          <div className="p-5 sm:p-6 rounded-xl bg-violet-50/40 border border-violet-100 text-slate-800 leading-relaxed text-base sm:text-[17px] font-normal whitespace-pre-line">
            {result.simpleExplanation}
          </div>
        </div>

        {/* 2. Important Points */}
        {Array.isArray(result.importantPoints) && result.importantPoints.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Important Points
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.importantPoints.map((point, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:shadow-subtle transition-all flex items-start gap-3"
                >
                  <BookmarkCheck className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Difficult Words Explained */}
        {Array.isArray(result.difficultWords) && result.difficultWords.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Difficult Words & Terminology Explained
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {result.difficultWords.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 mb-2">
                      {item.term}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. What You Should Know (Risks & Conditions) */}
        {Array.isArray(result.whatYouShouldKnow) && result.whatYouShouldKnow.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>What You Should Know</span>
                <span className="text-xs font-normal text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  Risks & Key Conditions
                </span>
              </h3>
            </div>
            <div className="space-y-2.5">
              {result.whatYouShouldKnow.map((risk, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-orange-200/80 bg-orange-50/40 text-slate-800 text-sm flex items-start gap-3.5 leading-relaxed"
                >
                  <AlertOctagon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Suggested Next Steps */}
        {Array.isArray(result.suggestedNextSteps) && result.suggestedNextSteps.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Suggested Next Steps
              </h3>
            </div>
            <div className="space-y-3">
              {result.suggestedNextSteps.map((step, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start gap-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-800 leading-relaxed font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <DisclaimerBanner 
            category={category}
            customNotice={result.disclaimer}
            completenessNotice={result.completenessNotice}
          />
        </div>

      </div>

      {/* 6. Ask Follow-up Questions Chat */}
      <FollowUpChat 
        originalContent={originalContent}
        decodedResult={result}
        language={metadata.language || 'English'}
      />

    </div>
  );
}
