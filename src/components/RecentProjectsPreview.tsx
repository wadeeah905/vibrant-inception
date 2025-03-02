import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const RecentProjectsPreview = () => {
  const { t } = useTranslation();

  const recentProjects = [
    {
      title: t('portfolio.projects.mobileApp.title'),
      description: t('portfolio.projects.mobileApp.description'),
      image: 'https://i.ibb.co/VMm7Nz2/mamanapp.jpg',
      tags: ['React Native', 'PHP', 'Python Scarpy'],
      demo: '#',
      github: 'https://github.com/ihebchebbi1998tn/CbsBaby'
    },
    {
      title: t('portfolio.projects.webApp.title'),
      description: t('portfolio.projects.webApp.description'),
      image: 'https://i.ibb.co/gVT9QT5/draminesaid.png',
      tags: ['React', 'Node.js', 'Wordpress'],
      demo: 'https://draminesaid.com/',
      github: '#'
    },
    {
      title: t('portfolio.projects.aiApp.title'),
      description: t('portfolio.projects.aiApp.description'),
      image: 'https://i.ibb.co/LNZ5srZ/remedapp.jpg',
      tags: ['React Native', 'Node.js', 'MySQL', 'AI'],
      demo: 'https://play.google.com/store/apps/details?id=com.dev.remed&hl=en',
      github: 'https://github.com/ihebchebbi1998tn/remedapp'
    }
  ];

  return (
    <div className="space-y-4 mt-4">
      <div className="grid gap-4">
        {recentProjects.map((project, index) => (
          <div
            key={project.title}
            className="group relative overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t('portfolio.cta.liveDemo')}
                    </a>
                  )}
                  {project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      <Github className="h-3 w-3" />
                      {t('portfolio.cta.source')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="#portfolio"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
      >
        {t('portfolio.viewAll')}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
};

export default RecentProjectsPreview;