import React, { useState } from 'react';
import { MessageCircle, Mail, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { BRAND_CONTENT } from '../data/content';
import { submitContactEnquiry } from '../lib/supabase';
import { InstagramIcon } from '../components/common/Icons';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return <InstagramIcon className="w-6 h-6 text-brand-600" />;
      case 'MessageCircle':
        return <MessageCircle className="w-6 h-6 text-brand-600" />;
      case 'Mail':
        return <Mail className="w-6 h-6 text-brand-600" />;
      default:
        return <Mail className="w-6 h-6 text-brand-600" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitContactEnquiry({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMessage('Failed to send enquiry. Please try again or reach out directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-[#FAF7F2] py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-3 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Singapore Team</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal tracking-tight mb-3">
            {BRAND_CONTENT.contact.title}
          </h1>

          <p className="text-base text-charcoal-muted">
            {BRAND_CONTENT.contact.subtitle}
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {BRAND_CONTENT.contact.channels.map((channel, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#DED7CE] shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#DED7CE]/70 flex items-center justify-center mb-4">
                  {getChannelIcon(channel.icon)}
                </div>
                <h3 className="text-base font-bold text-charcoal">
                  {channel.type}
                </h3>
                <div className="text-xs font-bold text-brand-600 mt-0.5">
                  {channel.handle}
                </div>
                <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                  {channel.placeholder}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#DED7CE]/60">
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-[#FAF7F2] hover:bg-brand-50 text-brand-600 font-bold text-xs py-2 px-3 rounded-xl border border-[#DED7CE] transition-colors"
                >
                  <span>{channel.action}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#DED7CE] shadow-card">
          <div className="mb-6 pb-4 border-b border-[#DED7CE]/70">
            <h2 className="text-xl font-serif font-bold text-charcoal">
              Send an Online Enquiry
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Leave us a message and our Singapore customer support team will reply within 1-2 business days.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-brand-50 rounded-2xl border border-brand-200 text-center space-y-3 animate-soft-in">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-charcoal">
                Thank you for reaching out!
              </h3>
              <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                We have received your message and will respond to your email shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-bold text-brand-600 underline underline-offset-2 mt-2"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-xl flex items-center gap-2 text-xs font-bold text-brand-700">
                  <AlertCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-brand-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samuel Lim"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#DED7CE] focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Your Email <span className="text-brand-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. samuel@example.com"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#DED7CE] focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Subject <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about Fresh Omega-3 Mini"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#DED7CE] focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Message <span className="text-brand-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our pet wellness products or orders?"
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#DED7CE] focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 bg-[#FAF7F2] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Enquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Enquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};
