// api/contact.js  <-- Put this inside the "api" folder for Vercel

import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';

const app = express();

// ✅ CORS setup — allow your frontend domain
app.use(cors({
  origin: 'https://arta-frontend-65ui.vercel.app', // ✅ change to your real frontend URL
  methods: ['POST', 'OPTIONS'],
}));
app.use(express.json());

// ✅ MongoDB connection (only connect once in serverless)
const MONGODB_URI = 'mongodb+srv://haricdonh:hari5678@cluster0.asyp365.mongodb.net/contactDB?retryWrites=true&w=majority';

if (!global._mongooseConnected) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('✅ MongoDB connected');
      global._mongooseConnected = true;
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// 📌 Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// 📌 Route
app.options('/api/contact', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://arta-frontend-65ui.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res.status(200).end();
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    console.log('📩 Contact form submitted:', name, email, subject, message);

    res.status(200).json({ success: true, message: 'Message received and saved' });
  } catch (error) {
    console.error('❌ Error saving contact form:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Export for Vercel
export default app;
