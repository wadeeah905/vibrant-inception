import React from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Layout, Server, Smartphone, Cpu } from 'lucide-react';

const ServiceOptions = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Layout,
      title: t('Web'),
      price: '500 tnd - 5000 tnd',
      features: ['React/Next.js', 'Vue.js', 'Node.js']
    },
    {
      icon: Smartphone,
      title: t('Mobile'),
      price: '2500 tnd - 10 000tnd',
      features: ['React Native', 'iOS/Android', 'Cross-platform']
    },
    {
      icon: Server,
      title: 'WordPress',
      price: '500 tnd - 800 tnd',
      features: ['Custom Themes', 'Plugins', 'E-commerce']
    },
    {
      icon: Cpu,
      title: 'Desktop Apps',
      price: '1000 tnd - 2000 tnd',
      features: ['Electron', 'Cross-platform', 'Native APIs']
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {services.map((service) => (
        <div
          key={service.title}
          className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors"
        >
          <service.icon className="h-6 w-6 text-blue-400 mb-2" />
          <h3 className="text-lg font-semibold text-white mb-1">{service.title}</h3>
          <p className="text-blue-400 text-sm mb-2">{service.price}</p>
          <ul className="space-y-1">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center text-sm text-gray-300">
                <Code className="h-4 w-4 text-blue-400 mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ServiceOptions;