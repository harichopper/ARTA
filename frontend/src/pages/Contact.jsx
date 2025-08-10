import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch( 'https://arta-frontend-65ui.vercel.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      alert('Failed to send message, please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-6">
      <div className="max-w-4xl mx-auto text-white">
        <header className="mb-20 text-center">
          <h3 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-lg">
            Contact Us
          </h3>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed italic tracking-wide">
            Have questions? We'd love to hear from you! Reach out to Timups for support, partnerships, or anything else.
          </p>
        </header>

        {submitted ? (
          <div className="bg-purple-800/60 rounded-xl p-12 text-center text-purple-300 font-semibold text-2xl shadow-lg">
            Thank you for reaching out! We will get back to you shortly.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-purple-900 via-black to-cyan-900 rounded-3xl p-12 shadow-xl border border-transparent hover:border-cyan-400 transition-all duration-400"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-transparent border border-white-600 placeholder-white-500 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                aria-label="Your Name"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-transparent border border-white-600 placeholder-white-500 text-white px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                aria-label="Your Email"
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-transparent border border-white-600 placeholder-white-500 text-white px-5 py-4 mb-8 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              aria-label="Subject"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              required
              className="w-full rounded-lg bg-transparent border border-white-600 placeholder-white-500 text-white px-5 py-4 mb-10 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              aria-label="Your Message"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-3 px-12 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold transition transform hover:scale-105 shadow-lg mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send Message"
            >
              Send Message <Send size={22} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
