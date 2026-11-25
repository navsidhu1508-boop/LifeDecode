export const SUPPORTED_LANGUAGES = [
  { id: 'English', label: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'Hindi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

export const EXPLANATION_STYLES = [
  {
    id: 'Very Simple',
    label: 'Very Simple',
    description: 'Everyday analogies, zero technical jargon, like talking to a friend.'
  },
  {
    id: 'Detailed',
    label: 'Detailed',
    description: 'Thorough, clause-by-clause breakdown preserving exact numbers and dates.'
  },
  {
    id: 'Step-by-Step',
    label: 'Step-by-Step',
    description: 'Chronological timeline and actionable numbered steps of what will happen.'
  }
];

export const CATEGORY_BADGES = {
  legal: {
    label: 'Legal Document',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: 'ShieldAlert'
  },
  financial: {
    label: 'Financial / Banking',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: 'TrendingUp'
  },
  medical: {
    label: 'Medical & Health',
    color: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: 'Activity'
  },
  technical: {
    label: 'Technical / IT',
    color: 'bg-sky-50 text-sky-800 border-sky-200',
    icon: 'Cpu'
  },
  general: {
    label: 'General Document',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: 'FileText'
  }
};
