
import { useTranslation } from 'react-i18next';
import { Brain, Code, Globe, Sparkles } from 'lucide-react';
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
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            {t('about.title')}
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white">
              {t('about.intro')} <span className="text-blue-400">{t('about.name')}</span>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {t('about.description')}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Code, label: t('about.stats.cleanCode'), value: '2000+' },
                { icon: Globe, label: t('about.stats.projects'), value: '30+' },
                { icon: Brain, label: t('about.stats.aiModels'), value: '2+' },
                { icon: Sparkles, label: t('about.stats.happyClients'), value: '25+' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <stat.icon className="h-6 w-6 text-blue-400 mb-2" />
                  <div className="font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h4 className="text-lg font-semibold text-white">{category}</h4>
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
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
