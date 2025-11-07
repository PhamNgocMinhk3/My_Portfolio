const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  skills: [{
    name: String,
    level: Number
  }],
  social: {
    github: String,
    linkedin: String,
    twitter: String
  },
  contact: {
    email: String,
    phone: String,
    location: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);