export interface Profile {
  avatar: string;
  name: string;
  bio?: string;
  location?: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  socials?: Array<{
    platform: string;
    url: string;
    name?: string;
  }>;
  skills?: string[];
  certifications?: Array<{
    name: string;
    body: string;
    date: string;
    link: string;
  }>;
  educations?: Array<{
    institution: string;
    degree: string;
    from: string;
    to: string;
  }>;
  
}
