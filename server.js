import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://haricdonh:hari5678@cluster0.asyp365.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// 🔹 Root Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ======================
// USER MODEL & ROUTES
// ======================
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const User = mongoose.model('User', userSchema);

// Seed user (optional)
app.post('/api/seed-user', async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    const user = new User({ walletAddress: walletAddress.toLowerCase(), role });
    await user.save();
    res.json({ message: 'User seeded', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by wallet address
app.get('/api/users/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================
// CONTACT MODEL & ROUTES
// ======================
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Save contact form data
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

// ======================
// START SERVER
// ======================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
