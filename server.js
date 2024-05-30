// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Rating = require('C:\\Users\\rvidu\\brewery-app\\models\\Rating.js');
// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/breweryApp', {
// });

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (user) return res.status(400).json({ message: 'User already exists' });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = new User({ username, password: hashedPassword });
//   await newUser.save();

//   res.status(201).json({ message: 'User created' });
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//   const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
//   res.json({ token });
// });

// app.post('/brewery/:breweryId/add-rating', async (req, res) => {
//     const { breweryId } = req.params;
//     const { rating, description } = req.body;
  
//     try {
//         const newRating = new Rating({ breweryId, rating, description });
//         await newRating.save();
//         res.status(201).json({ message: 'Rating added successfully' });
//     } catch (error) {
//         console.error('Error adding rating:', error);
//         res.status(500).json({ message: 'Error adding rating' });
//     }
// });

// app.get('/brewery/:breweryId/ratings', async (req, res) => {
//   const { breweryId } = req.params;

//   try {
//     const ratings = await Rating.find({ breweryId });
//     console.log(json(ratings));
//     res.json(ratings);
//   } catch (error) {
//     console.error('Error fetching ratings:', error);
//     res.status(500).json({ message: 'Error fetching ratings' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Rating = require('./models/Rating');  // Adjust the path as needed
const User = require('./models/User');  // Adjust the path as needed
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the MongoDB URI from the environment variables
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User created' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/brewery/:breweryId/add-rating', async (req, res) => {
    const { breweryId } = req.params;
    const { rating, description } = req.body;

    try {
        const newRating = new Rating({ breweryId, rating, description });
        await newRating.save();
        res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ message: 'Error adding rating' });
    }
});

app.get('/brewery/:breweryId/ratings', async (req, res) => {
  const { breweryId } = req.params;

  try {
    const ratings = await Rating.find({ breweryId });
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
