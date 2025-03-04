
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import VideoBackground from '../components/VideoBackground';
import HeroVideo from '../components/HeroVideo';

const VilartProd = () => {
  const services = [
    {
      title: "Production Musicale",
      description: "De l'enregistrement au mastering, nous vous accompagnons dans la réalisation de vos projets musicaux.",
      features: [
        "Studio d'enregistrement",
        "Mixage & Mastering",
        "Production musicale",
        "Sound design",
        "Composition",
        "Arrangement musical"
      ]
    },
    {
      title: "Production Vidéo",
      description: "Des clips musicaux aux films publicitaires, nous donnons vie à vos idées avec créativité.",
      features: [
        "Clips vidéos",
        "Films publicitaires",
        "Motion design",
        "Post-production",
        "Étalonnage couleur",
        "VFX & animations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-screen">
        <VideoBackground videoUrl="/VideoProduction.mp4">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="max-w-4xl px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl" />
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold mb-6 text-white/90"
                >
                  Vilart Productions
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-white/70"
                >
                  Un studio de production où créativité rencontre technique
                </motion.p>
              </div>
            </div>
          </div>
        </VideoBackground>
      </div>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center text-white">
              Nos Services de Production
            </h2>
            <p className="text-xl text-center text-white/80">
              Une expertise complète pour donner vie à vos projets créatifs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative luxury-card p-8 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                  <p className="text-white/80 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-white/70">
                        <ArrowRight className="w-5 h-5 mr-3 text-gold-400" />
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
    </div>
  );
};

export default VilartProd;
