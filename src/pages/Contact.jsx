import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';
import { submitContactInquiry } from '../services/gemini';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const subjectOptions = [
    'General Question',
    'Document Decoding Feedback',
    'Partnership / Commercial Inquiry',
    'Bug Report / Technical Issue',
    'Feature Suggestion'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    setGeneralError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Client-side quick validation
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name (minimum 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide your message (minimum 10 characters).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await submitContactInquiry(formData);
      setSubmitted(res);
      setFormData({
        name: '',
        email: '',
        subject: 'General Question',
        message: ''
      });
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setGeneralError(err.message || 'Failed to submit inquiry. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 mx-auto flex items-center justify-center">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch with LifeDecode
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Have feedback on a decoded document, a feature request, or an inquiry? We’d love to hear from you.
        </p>
      </div>

      {/* Contact Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-card">
        
        {submitted ? (
          <div className="text-center py-8 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                Message Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {submitted.message}
              </p>
            </div>

            <div className="inline-block p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              Reference Ticket ID: <strong className="text-violet-700">{submitted.ticketId}</strong>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setSubmitted(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {generalError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name field */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.name
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-rose-600 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    fieldErrors.email
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

            </div>

            {/* Subject selector */}
            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Inquiry Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
              >
                {subjectOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Message field */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Message Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind, how we can help, or suggestions for improving LifeDecode..."
                className={`w-full p-4 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 resize-y ${
                  fieldErrors.message
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                }`}
              />
              {fieldErrors.message && (
                <p className="text-xs text-rose-600 font-medium">{fieldErrors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 text-violet-400" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
