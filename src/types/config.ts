export interface SiteConfig {
  site: {
    title: string;
    description: string;
    baseUrl: string;
  };
  personal: {
    name: string;
    email: string;
    location: string;
    social: {
      github: string;
      linkedin: string;
      instagram: string;
    };
    bio: string;
  };
  skills: {
    languages: string[];
    databases: string[];
    frameworks: string[];
    cloud: string[];
    cicd: string[];
    analytics: string[];
    soft: string[];
  };
  experience: {
    professional: {
      company: string;
      title: string;
      period: string;
      achievements: string[];
    }[];
    education: {
      institution: string;
      degree: string;
      period: string;
      gpa?: string;
      achievements?: string[];
      details?: string[];
    }[];
  };
  languages: {
    name: string;
    proficiency: string;
  }[];
  interests: string[];
} 