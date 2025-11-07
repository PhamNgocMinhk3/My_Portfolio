import Certification from '../models/Certification.js';

export const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find();
    if (!certifications) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
