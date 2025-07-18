const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });
  const doc = await db.collection('passwordResets').doc(email).get();
  if (!doc.exists) return res.status(400).json({ error: 'Invalid code' });
  const data = doc.data();
  if (data.code !== code) return res.status(400).json({ error: 'Invalid code' });
  if (data.expiresAt.toDate() < new Date()) return res.status(400).json({ error: 'Code expired' });
  res.json({ success: true });
});

exports.verifyCode = functions.https.onRequest(app); 