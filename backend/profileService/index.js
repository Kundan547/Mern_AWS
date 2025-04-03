const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5002;

// ✅ Corrected: Use `MONGO_URI` instead of `MONGO_URL`
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// ✅ Await Mongoose connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.send({ status: 'OK' });
});

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 200
  },
  age: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model('User', userSchema);

// ✅ Fixed: User existence check
app.post('/addUser', async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || !age) {
      return res.status(400).json({ error: "Both name and age are required." });
    }

    const existingUser = await User.find({ name: name });

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists." });
    }

    const newUser = new User({ name, age });
    await newUser.save();
    
    res.status(201).json({ msg: "User Added Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

app.get('/fetchUser', async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ msg: "No users found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
