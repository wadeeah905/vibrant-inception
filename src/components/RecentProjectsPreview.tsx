
import { useTranslation } from 'react-i18next';
import { ExternalLink, Github, ArrowRight, Award, Briefcase, Cpu, Layout, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const RecentProjectsPreview = () => {
  const { t } = useTranslation();

  const recentProjects = [
    {
      title: "Tazart Website",
      description: "A beautiful modern website that helped my client appear professional and have a cool digital presence",
      image: 'https://i.ibb.co/VMm7Nz2/mamanapp.jpg',
      tags: ['React', 'Tailwind CSS', 'NextJS'],
      demo: 'https://tazart.com',
      github: '#',
      icon: <Layout className="h-4 w-4 text-blue-400" />
    },
    {
      title: "Dishit Mobile App",
      description: "Mobile application that helps connect people in need with food donations",
      image: 'https://i.ibb.co/LNZ5srZ/remedapp.jpg',
      tags: ['React Native', 'Firebase', 'Google Maps API'],
      demo: 'https://play.google.com/store',
      github: '#',
      icon: <Smartphone className="h-4 w-4 text-blue-400" />
    },
    {
      title: t('portfolio.projects.mobileApp.title'),
      description: t('portfolio.projects.mobileApp.description'),
      image: 'https://i.ibb.co/VMm7Nz2/mamanapp.jpg',
      tags: ['React Native', 'PHP', 'Python Scarpy'],
      demo: '#',
      github: 'https://github.com/ihebchebbi1998tn/CbsBaby',
      icon: <Smartphone className="h-4 w-4 text-blue-400" />
    },
    {
      title: t('portfolio.projects.webApp.title'),
      description: t('portfolio.projects.webApp.description'),
      image: 'https://i.ibb.co/gVT9QT5/draminesaid.png',
      tags: ['React', 'Node.js', 'Wordpress'],
      demo: 'https://draminesaid.com/',
      github: '#',
      icon: <Layout className="h-4 w-4 text-blue-400" />
    },
    {
      title: t('portfolio.projects.aiApp.title'),
      description: t('portfolio.projects.aiApp.description'),
      image: 'https://i.ibb.co/LNZ5srZ/remedapp.jpg',
      tags: ['React Native', 'Node.js', 'MySQL', 'AI'],
      demo: 'https://play.google.com/store/apps/details?id=com.dev.remed&hl=en',
      github: 'https://github.com/ihebchebbi1998tn/remedapp',
      icon: <Cpu className="h-4 w-4 text-blue-400" />
    }
  ];

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center mb-4">
        <Briefcase className="h-5 w-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Featured Projects</h3>
      </div>
      
      <div className="grid gap-4">
        {recentProjects.slice(0, 3).map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="w-24 h-24 flex-shrink-0 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.icon}
                </div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-white mb-1 mr-2">{project.title}</h3>
                  <Award className="h-3.5 w-3.5 text-yellow-400" />
                </div>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                      +{project.tags.length - 2}
                    </span>
                  )}
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
          </motion.div>
        ))}
      </div>
      <motion.a
        href="#portfolio"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-500/10"
        onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        {t('portfolio.viewAll')}
        <ArrowRight className="h-4 w-4" />
      </motion.a>
    </div>
  );
};

export default RecentProjectsPreview;
