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

function thankYouPage(ok, detail) {
  const body = ok
    ? `<h1>Message sent!</h1><p>Thanks for reaching out. I usually reply within a day.</p>`
    : `<h1>Something went wrong</h1><p>${detail}</p>`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${ok ? 'Message sent' : 'Message failed'} — Mark Anthony Enriquez</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0b0d16;color:#eceef4;font-family:"Inter","Segoe UI",system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:40px 20px}
.card{max-width:480px}
h1{font-size:34px;font-weight:800;margin-bottom:12px;color:#c8a25c}
p{color:#8a90a3;font-size:16px;margin-bottom:28px}
a{color:#c8a25c;text-decoration:none;font-weight:600;padding:13px 26px;border:1px solid rgba(236,238,244,.09);border-radius:999px;display:inline-block}
a:hover{border-color:#c8a25c}
</style></head>
<body><div class="card">${body}<p><a href="/#contact">Back to portfolio</a></p></div></body></html>`;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  // Reject bots that filled the hidden honeypot field (silently pretend it worked)
  const body = req.body || {};
  if (body.company && body.company.trim() !== '') {
    return res.status(200).send(thankYouPage(true));
  }

  // Rate limit by IP
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).send(thankYouPage(false, 'Too many messages. Try again later.'));
  }

  const { name, email, message } = body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).send(thankYouPage(false, 'All fields are required.'));
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send(thankYouPage(false, 'That email address looks invalid.'));
  }
  if (name.length > 120 || message.length > 5000) {
    return res.status(400).send(thankYouPage(false, 'Message too long.'));
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return res.status(500).send(thankYouPage(false, 'Mail is not configured on the server.'));
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
    return res.status(200).send(thankYouPage(true));
  } catch (err) {
    return res.status(500).send(thankYouPage(false, 'Failed to send. Try emailing me directly.'));
  }
}
