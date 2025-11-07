import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Profile } from '../models/Profile.js';
import { Project } from '../models/Project.js';

dotenv.config();

const sampleProfile = {
  name: "Your Name",
  title: "Full Stack Developer",
  bio: "A passionate developer with expertise in React, Node.js, and Three.js",
  avatarUrl: "https://example.com/avatar.jpg",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Three.js",
    "MongoDB",
    "Express"
  ],
  contact: {
    email: "your.email@example.com",
    phone: "+1234567890",
    location: "Your Location",
    socials: [
      {
        platform: "GitHub",
        url: "https://github.com/yourusername"
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/yourusername"
      }
    ]
  }
};

const sampleProjects = [
  {
    title: "Portfolio Website",
    description: "A personal portfolio website built with React, Three.js, and Node.js",
    shortDescription: "Interactive 3D portfolio website",
    coverImage: "https://example.com/portfolio.jpg",
    images: ["https://example.com/portfolio1.jpg", "https://example.com/portfolio2.jpg"],
    technologies: ["React", "Three.js", "Node.js", "MongoDB"],
    liveUrl: "https://yourportfolio.com",
    githubUrl: "https://github.com/yourusername/portfolio",
    featured: true
  },
  {
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    shortDescription: "Modern e-commerce solution",
    coverImage: "https://example.com/ecommerce.jpg",
    images: ["https://example.com/ecommerce1.jpg", "https://example.com/ecommerce2.jpg"],
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://yourecommerce.com",
    githubUrl: "https://github.com/yourusername/ecommerce",
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Profile.deleteMany();
    await Project.deleteMany();

    // Insert new data
    await Profile.create(sampleProfile);
    await Project.insertMany(sampleProjects);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();