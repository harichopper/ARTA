import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 5000;

const uri = 'mongodb+srv://haricdonh:hari5678@cluster0.asyp365.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
