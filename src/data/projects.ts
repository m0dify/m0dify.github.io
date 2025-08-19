// src/data/projects.ts
import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: "프로젝트 1",
    description: "React와 TypeScript로 만든 할 일 관리 앱",
    link: "/project1",
    github: "https://github.com/m0dify/project1",
    technologies: ["React", "TypeScript", "CSS3"]
  },
  {
    id: 2,
    title: "프로젝트 2", 
    description: "Node.js 백엔드와 연동된 블로그 시스템",
    link: "/project2",
    github: "https://github.com/m0dify/project2",
    technologies: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 3,
    title: "프로젝트 3",
    description: "실시간 채팅 애플리케이션", 
    link: "/project3",
    github: "https://github.com/m0dify/project3",
    technologies: ["React", "Socket.io", "Express"]
  }
];