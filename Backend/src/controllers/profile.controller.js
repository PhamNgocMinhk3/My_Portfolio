import { Profile } from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      await Profile.create(req.body);
    }
    res.json(await Profile.findOne());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};