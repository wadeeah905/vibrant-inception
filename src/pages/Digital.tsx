
import { motion } from 'framer-motion';
import { ArrowRight, X, Palette, Layout, Search, Globe, Smartphone, Code, BrainCircuit, BarChart3, Target, Users, PenTool } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Link } from 'react-router-dom';
import VideoBackground from '../components/VideoBackground';

interface FeatureInfo {
  title: string;
  description: string;
  icon: JSX.Element;
  benefits: string[];
  process: string[];
}

const featureDetails: Record<string, FeatureInfo> = {
  "Identité visuelle": {
    title: "Identité Visuelle",
    description: "Développez une identité de marque unique qui vous démarque. Notre équipe créative conçoit des éléments visuels qui communiquent efficacement vos valeurs et votre personnalité de marque.",
    icon: <Palette className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Design unique adapté à votre secteur",
      "Cohérence visuelle sur tous supports",
      "Guide d'utilisation détaillé",
      "Formats adaptés pour print et digital"
    ],
    process: [
      "Étude approfondie de votre marché",
      "Workshop créatif et brainstorming",
      "Création des éléments visuels",
      "Guidelines et livrables finaux"
    ]
  },
  "Logo design": {
    title: "Logo Design",
    description: "Création d'un logo professionnel et moderne qui incarne l'essence de votre marque. Nous concevons des identités visuelles mémorables qui résistent à l'épreuve du temps.",
    icon: <PenTool className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Logo unique et distinctif",
      "Déclinaisons adaptatives",
      "Package complet de fichiers",
      "Protection intellectuelle"
    ],
    process: [
      "Analyse de vos besoins",
      "Études de concepts créatifs",
      "Développement du design final",
      "Livraison tous formats"
    ]
  },
  "Charte graphique": {
    title: "Charte Graphique",
    description: "Document stratégique qui définit l'ensemble des règles d'utilisation de votre identité visuelle. Garantit une cohérence parfaite dans toutes vos communications.",
    icon: <Layout className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Guide complet d'utilisation",
      "Règles typographiques détaillées",
      "Palettes couleurs optimisées",
      "Modèles personnalisables"
    ],
    process: [
      "Audit de l'existant",
      "Définition des standards",
      "Création des guidelines",
      "Formation à l'utilisation"
    ]
  },
  "Stratégie de marque": {
    title: "Stratégie de Marque",
    description: "Élaboration d'une stratégie de marque complète pour positionner votre entreprise de manière unique sur le marché et construire une image forte.",
    icon: <Target className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Différenciation concurrentielle",
      "Storytelling impactant",
      "Positionnement clair",
      "Stratégie long terme"
    ],
    process: [
      "Analyse de marché détaillée",
      "Définition du positionnement",
      "Développement narratif",
      "Plan d'action stratégique"
    ]
  },
  "SEO": {
    title: "SEO (Référencement Naturel)",
    description: "Optimisation technique et éditoriale de votre présence en ligne pour améliorer votre visibilité sur les moteurs de recherche et générer un trafic qualifié.",
    icon: <Search className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Visibilité organique accrue",
      "Trafic ciblé et qualifié",
      "Optimisation continue",
      "Analyse des performances"
    ],
    process: [
      "Audit SEO complet",
      "Optimisation technique",
      "Stratégie de contenu",
      "Suivi et ajustements"
    ]
  },
  "Marketing de contenu": {
    title: "Marketing de Contenu",
    description: "Création et diffusion de contenus pertinents et engageants pour attirer, convertir et fidéliser votre audience cible tout en renforçant votre expertise.",
    icon: <BrainCircuit className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Contenus à forte valeur ajoutée",
      "Stratégie multicanale",
      "Engagement optimisé",
      "Conversion améliorée"
    ],
    process: [
      "Définition des personas",
      "Planification éditoriale",
      "Production de contenu",
      "Analyse des résultats"
    ]
  },
  "Réseaux sociaux": {
    title: "Réseaux Sociaux",
    description: "Gestion complète de vos réseaux sociaux pour développer votre communauté, engager votre audience et renforcer votre présence digitale.",
    icon: <Users className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Gestion professionnelle",
      "Contenu sur mesure",
      "Engagement communautaire",
      "Reporting mensuel"
    ],
    process: [
      "Audit des réseaux",
      "Stratégie de contenu",
      "Calendrier éditorial",
      "Modération active"
    ]
  },
  "Publicité en ligne": {
    title: "Publicité en Ligne",
    description: "Conception et gestion de campagnes publicitaires ciblées sur les réseaux sociaux et moteurs de recherche pour maximiser votre ROI.",
    icon: <BarChart3 className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Ciblage précis",
      "Budget optimisé",
      "Suivi en temps réel",
      "ROI maximisé"
    ],
    process: [
      "Analyse du marché",
      "Configuration des campagnes",
      "Tests et optimisations",
      "Reporting détaillé"
    ]
  },
  "Applications Web": {
    title: "Applications Web",
    description: "Développement d'applications web sur mesure, performantes et sécurisées, adaptées à vos besoins spécifiques et objectifs business.",
    icon: <Globe className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Solution personnalisée",
      "Interface intuitive",
      "Haute performance",
      "Maintenance continue"
    ],
    process: [
      "Spécifications détaillées",
      "Design UX/UI",
      "Développement agile",
      "Tests et déploiement"
    ]
  },
  "Applications Mobile": {
    title: "Applications Mobile",
    description: "Création d'applications mobiles natives et hybrides innovantes, offrant une expérience utilisateur optimale sur iOS et Android.",
    icon: <Smartphone className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Design intuitif",
      "Performance optimale",
      "Compatible iOS/Android",
      "Support continu"
    ],
    process: [
      "Étude des besoins",
      "Prototypage",
      "Développement",
      "Publication stores"
    ]
  },
  "Solutions B2B/B2C": {
    title: "Solutions B2B/B2C",
    description: "Développement de plateformes digitales B2B et B2C sur mesure pour optimiser vos processus métier et améliorer l'expérience client.",
    icon: <Code className="h-8 w-8 text-gold-400" />,
    benefits: [
      "Solution sur mesure",
      "Intégration SI existant",
      "Évolutivité garantie",
      "Support premium"
    ],
    process: [
      "Analyse des besoins",
      "Architecture système",
      "Développement itératif",
      "Déploiement & formation"
    ]
  }
};

const Digital = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureInfo | null>(null);

  const services = [
    {
      title: "Branding",
      description: "Développement de votre identité de marque pour une image forte et mémorable.",
      features: ["Identité visuelle", "Logo design", "Charte graphique", "Stratégie de marque"]
    },
    {
      title: "Marketing Digital",
      description: "Stratégies marketing innovantes pour accroître votre visibilité et atteindre vos objectifs.",
      features: ["SEO", "Marketing de contenu", "Réseaux sociaux", "Publicité en ligne"]
    },
    {
      title: "Développement Sur Mesure",
      description: "Solutions digitales personnalisées pour répondre à vos besoins spécifiques.",
      features: ["Applications Web", "Applications Mobile", "Solutions B2B/B2C"]
    }
  ];

  return (
    <div className="bg-rich-black text-off-white">
      <VideoBackground
        videoUrl="https://player.vimeo.com/external/451776276.sd.mp4?s=2e4be06fb91c7a572aa2b74b26c72bfed800c583&profile_id=165&oauth2_token_id=57447761"
        overlay="bg-gradient-to-b from-gold-900/80 via-black/70 to-black/95"
      >
        <div className="relative z-10 h-full flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
            style={{ 
              backgroundImage: `url(https://im.runware.ai/image/ws/0.5/ii/ccb25159-876c-45e9-bc0a-d4797cd0f8cb.webp)`,
              backgroundColor: 'rgba(245, 158, 11, 0.1)' // Gold tint
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-70" />
          
          {/* Digital pattern overlay with gold theme */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full"
                 style={{
                   backgroundImage: `
                     linear-gradient(0deg, transparent 24%, rgba(245, 158, 11, 0.3) 25%, rgba(245, 158, 11, 0.3) 26%, transparent 27%, transparent 74%, rgba(245, 158, 11, 0.3) 75%, rgba(245, 158, 11, 0.3) 76%, transparent 77%, transparent),
                     linear-gradient(90deg, transparent 24%, rgba(245, 158, 11, 0.3) 25%, rgba(245, 158, 11, 0.3) 26%, transparent 27%, transparent 74%, rgba(245, 158, 11, 0.3) 75%, rgba(245, 158, 11, 0.3) 76%, transparent 77%, transparent)
                   `,
                   backgroundSize: '50px 50px'
                 }}
            />
          </div>
          
          <div className="relative text-center px-4 z-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-20 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto rounded-full mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white gold-text-shadow">
                Solutions <span className="text-gold-400">Digitales</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-gold-600 to-gold-400 mx-auto rounded-full mt-6" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              Boostez votre présence en ligne avec nos services digitaux sur mesure
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-gold-600 text-black hover:bg-gold-500 transition-all duration-300 rounded-lg text-lg font-medium group gold-glow"
              >
                <span className="relative">
                  Contactez-nous
                  <ArrowRight className="ml-2 w-5 h-5 inline-block transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </VideoBackground>

      <section className="py-20 px-4 bg-gradient-to-b from-rich-black to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-white/80">
              Des solutions digitales adaptées à vos besoins
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
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/80 mb-8">{service.description}</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center text-white/70 cursor-pointer hover:text-white transition-colors"
                        onClick={() => setSelectedFeature(featureDetails[feature])}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {featureDetails[feature].icon}
                        <span className="ml-3">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="bg-rich-black border border-gold-500/20 text-white p-8 rounded-lg max-w-3xl mx-4">
          <div className="relative">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute right-0 top-0 p-2 text-gold-400 hover:text-gold-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4">
                {selectedFeature?.icon}
                <h2 className="text-3xl font-bold text-gold-400">
                  {selectedFeature?.title}
                </h2>
              </div>
              
              <p className="text-lg text-white/80">
                {selectedFeature?.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-gold-400 mb-4">Avantages</h3>
                  <ul className="space-y-3">
                    {selectedFeature?.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-white/80"
                      >
                        <ArrowRight className="w-4 h-4 text-gold-400 mr-2" />
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gold-400 mb-4">Notre Processus</h3>
                  <ul className="space-y-3">
                    {selectedFeature?.process.map((step, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-white/80"
                      >
                        <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center mr-3 text-sm">
                          {index + 1}
                        </div>
                        {step}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  to="/contact"
                  onClick={() => setSelectedFeature(null)}
                  className="inline-flex items-center px-6 py-3 bg-gold-400 text-black rounded-lg font-medium hover:bg-gold-300 transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    Démarrer un Projet
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Digital;
