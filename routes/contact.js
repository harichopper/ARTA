import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ✅ Connect to MongoDB (only once at startup)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// ✅ Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// ✅ POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Save to MongoDB
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    console.log('📩 Contact form submitted:', name, email, subject, message);

    res.status(200).json({ success: true, message: 'Message received and saved' });
  } catch (error) {
    console.error('❌ Error saving contact form:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

