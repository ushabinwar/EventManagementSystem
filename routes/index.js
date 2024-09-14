var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const generateToken = require("../utils/token")
const Event = require('../models/event');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/home', async function(req, res, next) {
  // res.render('home');
  try {
    // Fetch all events from the database
    const events = await Event.find();
    // Render the home page and pass the events to the view
    res.render('home', { events });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
router.get('/create-event', function(req, res, next) {
  res.render('eventform');
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = generateToken(newUser._id);
    // res.status(201).json({ user: newUser, token });
    res.redirect('/home');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken(user._id);
    // res.status(200).json({ user, token });
    res.redirect("/home")
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to handle event creation
router.post('/event/create', async (req, res) => {
  const { name, date, description, location } = req.body;

  // Validate form data
  if (!name || !date || !description) {
    return res.status(400).send('All required fields must be filled out.');
  }

  try {
    // Create a new event
    const newEvent = new Event({
      name,
      date,
      description,
      location, // Optional
    });

    await newEvent.save(); // Save the event to the database

    // Redirect to home page or event list after creation
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/event-delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the event by ID
    await Event.findByIdAndDelete(id);

    // Redirect back to the home page after deletion
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
