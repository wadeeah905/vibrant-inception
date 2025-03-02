
import { useTranslation } from 'react-i18next';
import { Brain, Code, Globe, Sparkles, Award, Briefcase, UserCircle, Cpu, BarChart, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useTranslation();

  const skills = [
    { name: 'JavaScript', level: 90, category: 'Frontend' },
    { name: 'React/Next.js', level: 85, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Backend' },
    { name: 'TensorFlow/ML', level: 70, category: 'AI' },
    { name: 'Cloud Hosting', level: 85, category: 'DevOps' },
    { name: 'Git/Github', level: 90, category: 'DevOps' },
    { name: 'UI/UX Design', level: 80, category: 'Design' }
  ];

  const categories = ['Frontend', 'Backend', 'AI', 'DevOps', 'Design'];
  
  const categoryIcons = {
    Frontend: <Code className="h-5 w-5 text-blue-400" />,
    Backend: <Server className="h-5 w-5 text-green-400" />,
    AI: <Brain className="h-5 w-5 text-purple-400" />,
    DevOps: <Globe className="h-5 w-5 text-orange-400" />,
    Design: <BarChart className="h-5 w-5 text-pink-400" />
  };

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <UserCircle className="w-8 h-8 mr-3 text-blue-400" />
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t('about.title')}
            </h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Passionate developer with expertise in web, mobile, and AI technologies
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                {t('about.intro')} <span className="text-blue-400 ml-2">{t('about.name')}</span>
                <Award className="h-5 w-5 text-yellow-400 ml-2" />
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                {t('about.description')}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {['JavaScript', 'React', 'Node.js', 'Python', 'AI/ML', 'UX/UI'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Code, label: t('about.stats.cleanCode'), value: '2000+', color: 'blue' },
                { icon: Briefcase, label: t('about.stats.projects'), value: '30+', color: 'cyan' },
                { icon: Cpu, label: t('about.stats.aiModels'), value: '2+', color: 'purple' },
                { icon: Sparkles, label: t('about.stats.happyClients'), value: '25+', color: 'amber' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/20 inline-block mb-3`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                  </div>
                  <div className="font-bold text-white text-xl">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 p-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-blue-400" />
              Professional Skills
            </h3>
            
            {categories.map((category, categoryIndex) => (
              <motion.div 
                key={category} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h4 className="text-lg font-semibold text-white flex items-center">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  <span className="ml-2">{category}</span>
                </h4>
                <div className="space-y-3">
                  {skills
                    .filter(skill => skill.category === category)
                    .map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{skill.name}</span>
                          <span className="text-blue-400">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r from-blue-500 to-cyan-400`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
            
            <div className="flex justify-center mt-6">
              <a 
                href="/resumeen.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
