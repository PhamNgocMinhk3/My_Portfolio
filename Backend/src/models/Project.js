import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  coverImage: { type: String, required: true },
  images: [{ type: String }],
  technologies: [{ type: String }],
  liveUrl: String,
  githubUrl: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', ProjectSchema);