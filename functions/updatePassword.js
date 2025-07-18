const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  const doc = await db.collection('passwordResets').doc(email).get();
  if (!doc.exists) return res.status(400).json({ error: 'Invalid code' });
  const data = doc.data();
  if (data.code !== code) return res.status(400).json({ error: 'Invalid code' });
  if (data.expiresAt.toDate() < new Date()) return res.status(400).json({ error: 'Code expired' });
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(userRecord.uid, { password: newPassword });
    await db.collection('passwordResets').doc(email).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

exports.updatePassword = functions.https.onRequest(app); 