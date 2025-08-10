import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://haricdonh:hari5678@cluster0.asyp365.mongodb.net/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// User schema with walletAddress and role
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const User = mongoose.model('User', userSchema);

// Sample seed route to create users (optional)
// Use once, then comment or remove
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
