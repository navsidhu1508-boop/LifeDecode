import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Languages, 
  Sliders, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  FileCheck
} from 'lucide-react';
import ResultCard from '../components/ResultCard';
import ApiKeyModal from '../components/ApiKeyModal';
import { decodeDocument } from '../services/gemini';
import { 
  validateUploadedFile, 
  readFileAsBase64, 
  MAX_FILE_SIZE_MB 
} from '../services/fileParser';
import { SUPPORTED_LANGUAGES, EXPLANATION_STYLES } from '../utils/constants';
import { SAMPLE_DOCUMENTS } from '../utils/samples';

export default function Decoder() {
  // Input mode: 'text' | 'document' | 'image'
  const [activeTab, setActiveTab] = useState('text');
  
  // Content states
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  
  // Preferences
  const [language, setLanguage] = useState('English');
  const [style, setStyle] = useState('Very Simple');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  // Load sample into text area
  const handleLoadSample = (sample) => {
    setActiveTab('text');
    setTextInput(sample.text);
    setUploadedFile(null);
    setFilePreviewUrl(null);
    setError(null);
  };

  // Clear all inputs
  const handleClear = () => {
    setTextInput('');
    setUploadedFile(null);
    setFilePreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle file selection
  const handleFileProcess = async (file) => {
    setError(null);
    const validation = validateUploadedFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      const fileData = await readFileAsBase64(file);
      setUploadedFile(fileData);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        setFilePreviewUrl(fileData.base64);
      } else {
        setFilePreviewUrl(null);
      }
    } catch (err) {
      setError('Could not read the selected file. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  // Trigger decoding
  const handleDecode = async () => {
    setError(null);

    // Validation: at least some content
    const hasText = textInput.trim().length > 0;
    const hasFile = Boolean(uploadedFile);

    if (!hasText && !hasFile) {
      setError('Please enter or paste text, or upload a document/image to decode.');
      return;
    }

    setLoading(true);
    setLoadingStage('Analyzing document structure...');

    try {
      const stageTimer1 = setTimeout(() => {
        setLoadingStage(`Translating & decoding into ${language}...`);
      }, 1800);

      const stageTimer2 = setTimeout(() => {
        setLoadingStage('Extracting key risks and actionable next steps...');
      }, 3800);

      const res = await decodeDocument({
        text: textInput,
        fileData: uploadedFile,
        language,
        style
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      setResult(res.data);
    } catch (err) {
      console.error('Decode failed:', err);
      if (err.code === 'GEMINI_API_KEY_MISSING' || (err.message && err.message.includes('API key'))) {
        setShowApiKeyModal(true);
        setError('Gemini API key is not configured on the server. Click to learn how to add your free key.');
      } else {
        setError(err.message || 'An error occurred while decoding your document. Please verify your input and try again.');
      }
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Document & Text Decoder
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Paste complex text or upload documents/screenshots to receive an easy-to-understand breakdown in seconds.
        </p>
      </div>

      {/* Main Container */}
      {!result ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-10 space-y-8">
          
          {/* Top Options Bar: Input Mode Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl max-w-md w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'text'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-violet-600" />
                <span>Paste Text</span>
              </button>

              <button
                onClick={() => setActiveTab('document')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'document'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-sky-600" />
                <span>Upload PDF</span>
              </button>

              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'image'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Upload Image</span>
              </button>
            </div>

            {/* Sample Presets for quick evaluation */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Try a sample:</span>
              {SAMPLE_DOCUMENTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 hover:bg-violet-50 hover:text-violet-700 text-slate-600 border border-slate-200 transition-colors"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area Depending on Tab */}
          <div className="space-y-4">
            
            {activeTab === 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label htmlFor="textInput" className="font-semibold text-slate-700">
                    Paste Legal Clause, Medical Result, or Agreement:
                  </label>
                  <span>{textInput.length} characters</span>
                </div>
                <textarea
                  id="textInput"
                  rows={8}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste confusing text here (e.g., apartment lease contract, loan terms, insurance policy clauses, biopsy or blood test summary, employment NDA)..."
                  className="w-full p-4 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-normal leading-relaxed transition-all resize-y"
                />
              </div>
            )}

            {(activeTab === 'document' || activeTab === 'image') && (
              <div className="space-y-4">
                
                {/* Drag and drop box */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                    dragActive
                      ? 'border-violet-500 bg-violet-50/50 scale-[0.99]'
                      : uploadedFile
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="fileUpload"
                    accept={activeTab === 'document' ? '.pdf' : '.png,.jpg,.jpeg,.webp'}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadedFile ? (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {uploadedFile.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Size: {uploadedFile.sizeFormatted} • Format: {uploadedFile.mimeType}
                        </p>
                      </div>

                      {/* Image Preview thumbnail if available */}
                      {filePreviewUrl && (
                        <div className="pt-2 max-w-xs mx-auto">
                          <img
                            src={filePreviewUrl}
                            alt="Uploaded preview"
                            className="max-h-40 mx-auto rounded-lg border border-slate-200 shadow-sm object-contain"
                          />
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Change File
                        </button>
                        <button
                          type="button"
                          onClick={handleClear}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 mx-auto flex items-center justify-center">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-800">
                          Drag & drop your {activeTab === 'document' ? 'PDF file' : 'screenshot or photo'} here
                        </p>
                        <p className="text-xs text-slate-500">
                          Supports {activeTab === 'document' ? 'PDF documents' : 'JPG, JPEG, PNG, WebP'} up to {MAX_FILE_SIZE_MB}MB
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all"
                        >
                          Browse Files
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional optional context text for uploaded files */}
                {uploadedFile && (
                  <div className="pt-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Optional context or specific focus question:
                    </label>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="e.g. Focus on cancellation penalty, or check if cholesterol is high..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Customization Selectors: Language & Style */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Language Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-violet-600" />
                <span>Explanation Language</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id)}
                    className={`p-2.5 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      language === lang.id
                        ? 'border-violet-600 bg-violet-50/70 text-violet-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-violet-600" />
                <span>Explanation Style</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EXPLANATION_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col items-center justify-center ${
                      style === st.id
                        ? 'border-violet-600 bg-violet-50/70 text-violet-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                    title={st.description}
                  >
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-0.5">Notice:</p>
                <p>{error}</p>
              </div>
              {error.includes('Gemini API key') && (
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700"
                >
                  Configure
                </button>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || (!textInput && !uploadedFile)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs sm:text-sm disabled:opacity-40 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={handleDecode}
              disabled={loading || (!textInput.trim() && !uploadedFile)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <span>{loadingStage || 'Decoding...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-violet-400 group-hover:rotate-12 transition-transform" />
                  <span>Decode with LifeDecode</span>
                </>
              )}
            </button>

          </div>

        </div>
      ) : (
        /* Result View */
        <ResultCard
          result={result}
          metadata={{ language, style }}
          originalContent={textInput || (uploadedFile ? uploadedFile.name : '')}
          onReset={() => {
            setResult(null);
            handleClear();
          }}
        />
      )}

      {/* API Key Modal if configuration is needed */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

    </div>
  );
}
