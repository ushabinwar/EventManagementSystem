const mongoose = require('mongoose');

// Define the Event schema
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Event name is mandatory
  },
  date: {
    type: Date,
    required: true, // Event date is mandatory
  },
  description: {
    type: String,
    required: true, // Event description is mandatory
  },
  location: {
    type: String, // Optional field for event location
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the last update date
  },
  reminderSent: {
    type: Boolean,
    default: false, // To track if a reminder has been sent
  },
});

// Middleware to update `updatedAt` field before saving
EventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Event model
module.exports = mongoose.model('Event', EventSchema);
