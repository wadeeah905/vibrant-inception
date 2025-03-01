
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Shield, FileCheck } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useState } from 'react';

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  const certifications = [
    {
      id: 1,
      title: "Certification ISO 22000",
      icon: <Shield className="w-8 h-8 text-[#96cc39]" />,
      image: "https://i0.wp.com/www.delice.tn/wp-content/uploads/2019/02/second-certificat.png?w=304&ssl=1",
      description: "Notre certification ISO 22000 témoigne de notre engagement envers la sécurité alimentaire et la qualité de nos produits. Cette norme internationale garantit que nous suivons les meilleures pratiques en matière de sécurité alimentaire tout au long de notre chaîne de production.",
      year: "2023",
      issuer: "Organisation internationale de normalisation (ISO)"
    },
    {
      id: 2,
      title: "Agriculture Biologique",
      icon: <FileCheck className="w-8 h-8 text-[#96cc39]" />,
      image: "https://i0.wp.com/www.delice.tn/wp-content/uploads/2019/02/second-certificat.png?w=304&ssl=1",
      description: "Notre certification Bio garantit des produits 100% naturels, cultivés dans le respect de l'environnement. Nous nous engageons à maintenir des pratiques agricoles durables et respectueuses de la nature pour offrir des produits de la plus haute qualité.",
      year: "2023",
      issuer: "Ecocert"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-white pt-28 pb-16 relative">
      <Helmet>
        <title>Nos Certifications | Tazart - Qualité Certifiée</title>
        <meta name="description" content="Découvrez les certifications de qualité de Tazart, garantissant l'excellence de nos produits traditionnels tunisiens." />
      </Helmet>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#96cc39]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#700100]/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 text-center mb-16"
      >
        <img 
          src="goldcertif.png" 
          alt="Tazart Logo" 
          className="mx-auto h-24 w-auto mb-8"
        />
        <h1 className="text-4xl font-playfair text-[#700100] mb-4">Nos Certifications</h1>
        <div className="w-24 h-1 bg-[#96cc39] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez nos certifications qui témoignent de notre engagement envers l'excellence et la qualité.
        </p>
      </motion.div>

      <div className="container mx-auto px-4 mb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => setSelectedCert(cert.id)}
              className="group relative cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded-lg shadow-sm">
                {cert.icon}
              </div>
              <div className="relative p-6">
                <div className="mb-6 relative overflow-hidden rounded-lg">
                  <img 
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-48 object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-playfair text-[#700100] mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Délivré par: {cert.issuer}</p>
                <p className="text-sm text-gray-400">Année: {cert.year}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#96cc39] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#700100] text-white hover:bg-[#96cc39] transition-colors"
              >
                <X size={20} />
              </button>
              
              {certifications.find(c => c.id === selectedCert) && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    {certifications.find(c => c.id === selectedCert)?.icon}
                    <h2 className="text-2xl font-playfair text-[#700100]">
                      {certifications.find(c => c.id === selectedCert)?.title}
                    </h2>
                  </div>
                  <div className="relative overflow-hidden rounded-xl">
                    <motion.img
                      src={certifications.find(c => c.id === selectedCert)?.image}
                      alt={certifications.find(c => c.id === selectedCert)?.title}
                      className="w-full rounded-lg shadow-md cursor-zoom-in transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Délivré par</p>
                      <p className="font-medium text-[#700100]">
                        {certifications.find(c => c.id === selectedCert)?.issuer}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Année</p>
                      <p className="font-medium text-[#700100]">
                        {certifications.find(c => c.id === selectedCert)?.year}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {certifications.find(c => c.id === selectedCert)?.description}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Statement */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="container mx-auto px-4 max-w-4xl"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-[#96cc39]" />
          </div>
          <h2 className="text-3xl font-playfair text-[#700100] text-center mb-6">
            L'Excellence au Cœur de Notre Tradition
          </h2>
          <div className="space-y-4 text-center">
            <p className="text-gray-600 leading-relaxed">
              Chez Tazart, la qualité n'est pas simplement une promesse, c'est notre engagement quotidien. 
              Nos certifications témoignent de notre dévouement à l'excellence et à la satisfaction de nos clients.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre processus de production est régulièrement audité et certifié par des organismes indépendants, 
              garantissant ainsi la qualité exceptionnelle de nos produits.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Certifications;
