import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  githubUrl: String,
  liveUrl: String,
  detailedDescription: String,
  features: [String],
  technologies: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Project', projectSchema);