import React, { useState } from 'react';
import { Send, Mail, CheckCircle } from 'lucide-react';

const ContactContent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, create a mailto link as a simple solution
    // In production, you'd send this to a backend API
    const subject = encodeURIComponent(`[StyleMirror AI] ${formData.subject}: ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:support@stylemirror.ai?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Message Ready!</h3>
        <p className="text-slate-600 mb-4">
          Your email client should have opened with your message. If not, you can email us directly at:
        </p>
        <a 
          href="mailto:support@stylemirror.ai"
          className="text-rose-600 hover:text-rose-700 font-medium underline"
        >
          support@stylemirror.ai
        </a>
        <button
          onClick={() => setSubmitted(false)}
          className="block mx-auto mt-6 text-sm text-slate-500 hover:text-slate-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700">
      <section>
        <p className="mb-4">
          Have a question, feedback, or need help? We'd love to hear from you! Fill out the form below 
          or email us directly.
        </p>
        
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-6">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Email us directly</p>
            <a 
              href="mailto:support@stylemirror.ai"
              className="text-rose-600 hover:text-rose-700 font-medium"
            >
              support@stylemirror.ai
            </a>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-white"
          >
            <option value="general">General Inquiry</option>
            <option value="feedback">Feedback & Suggestions</option>
            <option value="bug">Bug Report</option>
            <option value="privacy">Privacy Concern</option>
            <option value="business">Business / Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Send Message
        </button>
      </form>

      <p className="text-xs text-slate-500 text-center">
        We typically respond within 24-48 hours.
      </p>
    </div>
  );
};

export default ContactContent;
