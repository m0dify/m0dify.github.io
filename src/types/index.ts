// src/types/index.ts
export interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  github: string;
  technologies?: string[];
  image?: string;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
}