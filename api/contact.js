import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';

const app = express();

// ✅ CORS setup — allow your frontend domain
app.use(cors({
  origin: 'https://arta-frontend-hcl1.vercel.app', // your deployed frontend
  methods: ['POST', 'OPTIONS'],
}));
app.use(express.json());

// ✅ MongoDB connection (direct URI)
const MONGODB_URI = 'mongodb+srv://haricdonh:hari5678@cluster0.asyp365.mongodb.net/contactDB?retryWrites=true&w=majority';

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('✅ MongoDB connected'))
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

// ✅ Export as Vercel serverless function
export default app;
