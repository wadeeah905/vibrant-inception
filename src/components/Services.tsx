
import { useTranslation } from 'react-i18next';
import { Code, Layout, Server, Smartphone, Cpu, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Layout,
      title: t('services.frontend.title'),
      description: t('services.frontend.description'),
      features: ['React/Next.js', 'Symfony', 'Vite/Bootstrap'],
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: Server,
      title: t('services.backend.title'),
      description: t('services.backend.description'),
      features: ['Node.js/Express', 'PHP/Symfony', 'MySQL/MongoDB'],
      gradient: 'from-indigo-500 to-purple-400'
    },
    {
      icon: Smartphone,
      title: t('services.mobile.title'),
      description: t('services.mobile.description'),
      features: ['React Native', 'Custom UI/UX', 'Optimized Performance'],
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      icon: Cpu,
      title: t('services.ai.title'),
      description: t('services.ai.description'),
      features: ['Image Recognition', 'GPT Models Integration', 'Custom API Design'],
      gradient: 'from-orange-500 to-yellow-400'
    },
    {
      icon: Sparkles,
      title: t('services.cloud.title'),
      description: t('services.cloud.description'),
      features: ['AWS/Azure', 'CI/CD Pipelines', 'Scalable Deployments'],
      gradient: 'from-pink-500 to-rose-400'
    },
    {
      icon: Users,
      title: t('services.agile.title'),
      description: t('services.agile.description'),
      features: ['Sprint Planning', 'Daily Standups', 'Efficient Team Collaboration'],
      gradient: 'from-violet-500 to-purple-400'
    }
  ];

  return (
    <section id="services" className="relative py-20">
      {/* Enhanced background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
            {t('services.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-5">
            Professional services tailored to meet your project needs with cutting-edge technologies and best practices.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Animated gradient background on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${service.gradient} rounded-xl transition-opacity duration-300`}></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-1000 animate-gradient-x pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.gradient} p-2.5 mb-4 shadow-lg`}>
                  <service.icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                      <Code className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
