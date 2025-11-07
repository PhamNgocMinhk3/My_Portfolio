import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BackendProfile {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  contact: {
    email: string;
    phone?: string;
    location?: string;
    socials?: Array<{
      platform: string;
      url: string;
      name?: string;
    }>;
  };
  certifications?: BackendCertification[];
  educations?: BackendEducation[];
}

export interface BackendProject {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  detailedDescription?: string;
  features?: string[];
  technologies?: string[];
  createdAt?: string;
}

export interface BackendCertification {
  name: string;
  body: string;
  date: string;
  link: string;
}

export interface BackendEducation {
  institution: string;
  degree: string;
  from: string;
  to: string;
}

export const profileAPI = {
  getProfile: async (): Promise<BackendProfile> => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  updateProfile: async (data: BackendProfile): Promise<BackendProfile> => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },

  getCertifications: async (): Promise<BackendCertification[]> => {
    const response = await apiClient.get('/certification');
    return response.data;
  },

  getEducations: async (): Promise<BackendEducation[]> => {
    const response = await apiClient.get('/education');
    return response.data;
  },
};

export const projectsAPI = {
  getAllProjects: async (): Promise<BackendProject[]> => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getProjectBySlug: async (slug: string): Promise<BackendProject> => {
    const response = await apiClient.get(`/projects/${slug}`);
    return response.data;
  },
};

export default apiClient;
