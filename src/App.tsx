// src/App.tsx
import React from 'react';
import './App.css';
import ProjectCard from './components/ProjectCard';
import GoogleAnalytics from './components/GoogleAnalytics';
import { projects } from './data/projects';
import { Project } from './types';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';

const App: React.FC = () => {
  const { trackEvent } = useGoogleAnalytics();
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

  const handleProjectClick = (projectTitle: string, linkType: 'demo' | 'github') => {
    // Google Analytics 이벤트 추적
    trackEvent({
      action: 'click',
      category: 'project',
      label: `${projectTitle} - ${linkType}`,
    });
  };

  return (
    <div className="App">
      {/* Google Analytics 컴포넌트 */}
      <GoogleAnalytics measurementId={measurementId} />
      
      <header className="header">
        <h1>M0dify's Portfolio</h1>
        <p>Frontend Developer & Problem Solver</p>
      </header>
      
      <main className="main">
        <section className="projects">
          <h2>프로젝트</h2>
          <div className="project-grid">
            {projects.map((project: Project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onProjectClick={handleProjectClick}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;