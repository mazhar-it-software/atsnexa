'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [notice, setNotice] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus('sending'); setNotice('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not send message.');
      form.reset(); setStatus('sent');
      setNotice('Thanks! Your message has been sent to ATSNexa support.');
    } catch (error) {
      setStatus('error');
      setNotice(error.message || 'Please try again or email support@atsnexa.com.');
    }
  }
  return <form onSubmit={submit} acceptCharset="UTF-8">
    <div className="contact-honeypot" aria-hidden="true" style={{position:'absolute',left:'-9999px',width:1,height:1,overflow:'hidden'}}>
      <label>Leave empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
    </div>
    <label htmlFor="contact-name">Your name<input id="contact-name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required /></label>
    <label htmlFor="contact-email">Your email<input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    <label htmlFor="contact-topic">Subject<select id="contact-topic" name="topic" required defaultValue=""><option value="" disabled>Select a topic</option><option value="Technical support">Technical support</option><option value="Resume tools">Resume tools</option><option value="Privacy request">Privacy request</option><option value="Business inquiry">Business inquiry</option><option value="Other">Other</option></select></label>
    <label htmlFor="contact-message">Message<textarea id="contact-message" name="message" rows={6} minLength={10} maxLength={3000} required placeholder="Describe your question without sharing passwords or sensitive personal information." /></label>
    <p className="fineprint">We use your details only to respond to your inquiry. See our <a href="/privacy">Privacy Policy</a>.</p>
    <button type="submit" className="btn primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
    {notice && <p role="status" aria-live="polite" style={{marginTop:12,color:status === 'sent' ? '#157347' : '#b42318'}}>{notice}</p>}
  </form>;
}
