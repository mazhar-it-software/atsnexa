import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const allowedTopics = new Set(['Technical support', 'Resume tools', 'Privacy request', 'Business inquiry', 'Other']);
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const reply = (error, status) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://atsnexa.com';
  const origin = request.headers.get('origin');
  if (origin) {
    try { if (new URL(origin).origin !== new URL(site).origin) return reply('Request not allowed.', 403); }
    catch { return reply('Request not allowed.', 403); }
  }
  if (Number(request.headers.get('content-length') || 0) > 12000) return reply('Message too large.', 413);
  let data;
  try { data = await request.json(); } catch { return reply('Invalid request.', 400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply('Invalid request.', 400);
  // Quietly discard basic bot submissions. This does not replace rate limiting.
  if (data.website) return NextResponse.json({ ok: true });
  const { name, email, topic, message } = data;
  if (![name,email,topic,message].every(v => typeof v === 'string')) return reply('Please complete all fields.', 400);
  const n=name.trim(), e=email.trim(), t=topic.trim(), m=message.trim();
  if (n.length < 2 || n.length > 100 || !EMAIL.test(e) || e.length > 254 || !allowedTopics.has(t) || m.length < 10 || m.length > 3000) return reply('Please check the information you entered.', 400);
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error('Contact form missing RESEND_API_KEY'); return reply('Contact form is temporarily unavailable. Please email support@atsnexa.com.', 503); }
  const html = `<h2>New ATSNexa contact message</h2><p><b>Name:</b> ${safe(n)}</p><p><b>Email:</b> ${safe(e)}</p><p><b>Topic:</b> ${safe(t)}</p><p><b>Message:</b></p><p style="white-space:pre-wrap">${safe(m)}</p>`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL || 'ATSNexa <contact@atsnexa.com>', to: ['support@atsnexa.com'], reply_to: e, subject: `ATSNexa contact: ${t}`, html }),
        cache: 'no-store',
      });
    } finally { clearTimeout(timeout); }
    if (!response.ok) { console.error('Resend contact email failed', response.status); return reply('Message could not be delivered. Please email support@atsnexa.com.', 502); }
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { console.error('Contact email transport error', error?.name); return reply('Message service is temporarily unavailable. Please email support@atsnexa.com.', 502); }
}
