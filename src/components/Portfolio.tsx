
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

const Portfolio = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      title: t('portfolio.projects.mobileApp.title'),
      description: t('portfolio.projects.mobileApp.description'),
      image: 'https://i.ibb.co/VMm7Nz2/mamanapp.jpg',
      tags: ['React Native', 'PHP', 'Python Scarpy'],
      demo: '#',
      github: 'https://github.com/ihebchebbi1998tn/CbsBaby',
      category: 'mobile'
    },
    {
      title: t('portfolio.projects.aiApp.title'),
      description: t('portfolio.projects.aiApp.description'),
      image: 'https://i.ibb.co/LNZ5srZ/remedapp.jpg',
      tags: ['React Native', 'Node.js', 'MySQL', 'AI'],
      demo: 'https://play.google.com/store/apps/details?id=com.dev.remed&hl=en',
      github: 'https://github.com/ihebchebbi1998tn/remedapp',
      category: 'ai'
    },
    {
      title: t('portfolio.projects.remedProject.title'),
      description: t('portfolio.projects.remedProject.description'),
      image: 'https://i.ibb.co/WVrWJH1/reg.png',
      tags: ['Next.js', 'Vercel', 'Google Translation'],
      demo: 'https://www.s-reg.tn/',
      github: '#',
      category: 'web'
    },
    {
      title: t('portfolio.projects.gymWebsite.title'),
      description: t('portfolio.projects.gymWebsite.description'),
      image: 'https://i.ibb.co/PwDYDFT/image.png',
      tags: ['Bootstrap', 'HTML', 'CSS', 'Javascript'],
      demo: 'https://talelgym.tn/',
      github: '#',
      category: 'web'
    },
    {
      title: t('portfolio.projects.rhApp.title'),
      description: t('portfolio.projects.rhApp.description'),
      image: 'https://i.postimg.cc/MpnvT7V7/image.png',
      tags: ['PHP', 'Voice Recognition', 'Javascript', 'Bootstrap'],
      demo: '#',
      github: 'https://github.com/ihebchebbi1998tn/Bornerh',
      category: 'web'
    }
  ];

  const categories = ['all', 'web', 'mobile', 'ai'];
  const filteredProjects = selectedTag ? projects.filter(p => p.category === selectedTag) : projects;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <section id="portfolio" className="relative py-20 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            {t('portfolio.title')}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedTag(category === 'all' ? null : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedTag === category || (category === 'all' && !selectedTag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t('portfolio.cta.liveDemo')}
                    </a>
                  )}
                  {project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {t('portfolio.cta.source')}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
