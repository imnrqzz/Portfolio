// Vercel serverless function: sends contact form messages to Gmail via SMTP.
// Env vars required in Vercel: GMAIL_USER, GMAIL_APP_PASSWORD
import nodemailer from 'nodemailer';

// Simple in-memory rate limiter (per instance — good enough to stop casual spam).
// Keyed by client IP; allows max 3 sends per 10 minutes per IP.
const hits = new Map();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Reject bots that filled the hidden honeypot field
  const body = req.body || {};
  if (body.company && body.company.trim() !== '') {
    return res.status(200).json({ ok: true }); // silently pretend it worked
  }

  // Rate limit by IP
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many messages. Try again later.' });
  }

  const { name, email, message } = body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email' });
  }
  if (name.length > 120 || message.length > 5000) {
    return res.status(400).json({ ok: false, error: 'Message too long' });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return res.status(500).json({ ok: false, error: 'Mail not configured' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: user,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Failed to send' });
  }
}
