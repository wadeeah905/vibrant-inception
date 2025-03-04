
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroVideo from '../components/HeroVideo';
import PhotoGallery from '../components/PhotoGallery';
import HeroSlider from '../components/HeroSlider';

const Home = () => {
  const services = [
    {
      title: "Production Musicale",
      description: "Studio d'enregistrement professionnel, mixage et mastering de haute qualité",
      features: ["Studio d'enregistrement", "Mixage & Mastering", "Production musicale", "Sound design"],
      link: "/prod"
    },
    {
      title: "Production Vidéo",
      description: "Clips musicaux, contenu promotionnel et narration visuelle exceptionnelle",
      features: ["Clips vidéos", "Films publicitaires", "Motion design", "Post-production"],
      link: "/prod"
    },
    {
      title: "Organisation d'Événements",
      description: "Des concerts intimes aux festivals grandioses, nous donnons vie à votre vision",
      features: ["Concerts & Festivals", "Événements privés", "Sonorisation", "Scénographie"],
      link: "/events"
    }
  ];

  return (
    <div className="relative">
      <div className="relative h-screen">
        <HeroSlider />
      </div>

      <section className="py-20 px-4 bg-gradient-to-b from-black to-rich-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Nos Services
            </h2>
            <p className="text-xl text-white/80">
              Une expertise complète pour vos projets
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group h-full"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative luxury-card p-8 rounded-xl hover:transform hover:scale-105 transition-all duration-300 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                  <p className="text-white/80 mb-8">{service.description}</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/70">
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + idx * 0.1 }}
                          className="w-2 h-2 bg-gold-400 rounded-full mr-3 flex-shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={service.link}
                    className="inline-flex items-center text-gold-400 hover:text-gold-300 group mt-auto"
                  >
                    En savoir plus 
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-rich-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Notre Showreel
            </h2>
          </motion.div>
          <div className="w-full max-w-4xl mx-auto">
            <HeroVideo
              thumbnailUrl="/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _3.jpg"
              videoUrl="/VideoProduction.mp4"
              title="Vilart Productions Showreel"
              description="Un aperçu de notre réalisations"
            />
          </div>
        </div>
      </section>

      <PhotoGallery />
    </div>
  );
};

export default Home;
