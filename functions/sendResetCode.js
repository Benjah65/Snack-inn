const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();
const app = express();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

app.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)); // 10 min
  // Save to Firestore
  await db.collection('passwordResets').doc(email).set({ code, expiresAt });
  // Send email
  const msg = {
    to: email,
    from: {
      email: 'snackinnstore@gmail.com',
      name: 'Snack Inn'
    },
    replyTo: 'snackinnstore@gmail.com',
    subject: 'Snack Inn Password Reset',
    text: `Your password reset code is: ${code}. It expires in 10 minutes.`,
    html: `<h2>Hello from Snack Inn 👋</h2><p>Your password reset code is: <b>${code}</b></p><p>This code expires in 10 minutes.</p>`
  };
  // DKIM/SPF: Make sure your domain is verified and DKIM/SPF records are set up for snackinnstore@gmail.com if using a custom domain or SMTP provider.
  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

exports.sendResetCode = functions.https.onRequest(app); 