import Education  from '../models/Education.js';

export const getEducations = async (req, res) => {
  try {
    const educations = await Education.find();
    if (!educations) {
      return res.status(404).json({ message: 'Educations not found' });
    }
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
