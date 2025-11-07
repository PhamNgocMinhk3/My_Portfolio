import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  skills: [{ type: String }],
  contact: {
    email: { type: String, required: true },
    phone: String,
    location: String,
    socials: [{
      platform: String,
      url: String
    }]
  }
});

export const Profile = mongoose.model('Profile', ProfileSchema);