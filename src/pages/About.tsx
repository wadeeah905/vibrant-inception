
import { Users, Award, Globe, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Respect de l'autre",
      description: "Notre équipe est unie par des valeurs fortes de respect mutuel et de collaboration."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Nous nous engageons à maintenir les plus hauts standards de qualité dans tous nos produits."
    },
    {
      icon: Globe,
      title: "Engagement durable",
      description: "Notre engagement envers l'environnement et les communautés locales guide chacune de nos actions."
    },
    {
      icon: Leaf,
      title: "Production responsable",
      description: "Nous privilégions des méthodes de production respectueuses de l'environnement."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Hero Section */}
      <div className="relative h-[60vh] mb-24">
        <div className="absolute inset-0">
          <img
            src="AboutBanner.png"
            alt="Tazart Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl md:text-6xl font-playfair text-black mb-6">
  Notre Histoire
</h1>

            <p className="text-xl md:text-2xl leading-relaxed text-black opacity-90">
              Une tradition d'excellence dans la production de dattes tunisiennes
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-24 pb-24">
        {/* Mission Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-playfair text-[#67000D] mb-6">
                Notre Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Tazart est une entreprise sociale de séchage et de conditionnement de fruits, spécialisée dans les dattes et les figues séchées. Nos produits sont cultivés dans les meilleures conditions en Tunisie pour garantir un goût et une qualité supérieurs.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nous revisitons nos produits locaux pour offrir à nos consommateurs une expérience culinaire à la fois authentique et exceptionnelle.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#67000D]/10 rounded-2xl transform rotate-3"></div>
              <img
                src="AboutImage.png"
                alt="Notre Mission"
                className="relative rounded-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-playfair text-[#67000D] mb-12">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-12 h-12 text-[#67000D] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Heritage Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-playfair text-[#67000D] mb-8 text-center">
            Notre Héritage
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                La figue fait partie intégrante de la culture berbère et est appelée dans tout l'ensemble berbérophone Tazart, d'où vient le nom de notre entreprise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                C'est au cœur de la production traditionnelle et authentique Tunisienne que la marque TAZART a été créée, offrant au consommateur une expérience culinaire exceptionnelle à base de dattes et de figues séchées.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Pour les figues, la récolte passe au séchage via des techniques modernes et adaptées aux normes d'hygiène en vigueur pour passer par la suite à l'étape du conditionnement à l'instar de nos dattes naturelles "Deglet Nour", en vue d'être commercialisées sur plusieurs formes dans un réseau de plus de 70 distributeurs.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default About;
