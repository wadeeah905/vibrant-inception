
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, Briefcase, Award, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import { Card, CardContent } from './ui/card';

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
      category: 'mobile',
      icon: <Smartphone className="h-5 w-5 text-blue-400" />
    },
    {
      title: t('portfolio.projects.aiApp.title'),
      description: t('portfolio.projects.aiApp.description'),
      image: 'https://i.ibb.co/LNZ5srZ/remedapp.jpg',
      tags: ['React Native', 'Node.js', 'MySQL', 'AI'],
      demo: 'https://play.google.com/store/apps/details?id=com.dev.remed&hl=en',
      github: 'https://github.com/ihebchebbi1998tn/remedapp',
      category: 'ai',
      icon: <Cpu className="h-5 w-5 text-purple-400" />
    },
    {
      title: t('portfolio.projects.remedProject.title'),
      description: t('portfolio.projects.remedProject.description'),
      image: 'https://i.ibb.co/WVrWJH1/reg.png',
      tags: ['Next.js', 'Vercel', 'Google Translation'],
      demo: 'https://www.s-reg.tn/',
      github: '#',
      category: 'web',
      icon: <Globe className="h-5 w-5 text-green-400" />
    },
    {
      title: t('portfolio.projects.gymWebsite.title'),
      description: t('portfolio.projects.gymWebsite.description'),
      image: 'https://i.ibb.co/PwDYDFT/image.png',
      tags: ['Bootstrap', 'HTML', 'CSS', 'Javascript'],
      demo: 'https://talelgym.tn/',
      github: '#',
      category: 'web',
      icon: <Layout className="h-5 w-5 text-green-400" />
    },
    {
      title: t('portfolio.projects.rhApp.title'),
      description: t('portfolio.projects.rhApp.description'),
      image: 'https://i.postimg.cc/MpnvT7V7/image.png',
      tags: ['PHP', 'Voice Recognition', 'Javascript', 'Bootstrap'],
      demo: '#',
      github: 'https://github.com/ihebchebbi1998tn/Bornerh',
      category: 'web',
      icon: <Code className="h-5 w-5 text-green-400" />
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
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 mr-3 text-blue-400" />
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t('portfolio.title')}
            </h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Explore my latest projects showcasing my expertise in web development, mobile apps, and AI integration.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedTag(category === 'all' ? null : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedTag === category || (category === 'all' && !selectedTag)
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="h-full overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="aspect-video overflow-hidden relative">
                  <div className="absolute top-3 right-3 z-10 bg-black/60 rounded-full p-2">
                    {project.icon}
                  </div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {project.title}
                    <Award className="h-4 w-4 text-yellow-400" />
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-2 border-t border-gray-700/50">
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
