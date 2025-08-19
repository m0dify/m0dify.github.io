import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onProjectClick?: (projectTitle: string, linkType: 'demo' | 'github') => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectClick }) => {
  const handleLiveDemo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onProjectClick?.(project.title, 'demo');
    window.open(project.link, '_blank');
  };

  const handleGitHub = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onProjectClick?.(project.title, 'github');
    window.open(project.github, '_blank');
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{project.title}</h3>
      </div>
      
      <div className="project-content">
        <p>{project.description}</p>
        
        {project.technologies && (
          <div className="technologies">
            {project.technologies.map((tech: string, index: number) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="project-actions">
        <a 
          href={project.link} 
          onClick={handleLiveDemo}
          className="btn btn-primary"
        >
          라이브 데모
        </a>
        <a 
          href={project.github}
          onClick={handleGitHub} 
          className="btn btn-secondary"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;