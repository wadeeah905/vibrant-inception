import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

const allPhotos = [
  {
    id: 1,
    type: 'image',
    url: "/Vitaprod/0e9ebd59-0670-4a26-94c7-ac88e68a2ac7.png",
    thumbnail: "/Vitaprod/0e9ebd59-0670-4a26-94c7-ac88e68a2ac7.png",
    title: "Dorsaf Hamdani",
    description: "Evenement 2024"
  },
  {
    id: 2,
    type: 'image',
    url: "/lovable-uploads/29659276-5ab8-474c-9255-1cec58230660.png",
    thumbnail: "/lovable-uploads/29659276-5ab8-474c-9255-1cec58230660.png",
    title: "Dorsaf Hamdani Autumn Tour",
    description: "European Tour - October 2024"
  },
  {
    id: 3,
    type: 'image',
    url: "/Vitaprod/7f255f64-0152-4d07-98de-2e6a751c2c9d.png",
    thumbnail: "/Vitaprod/7f255f64-0152-4d07-98de-2e6a751c2c9d.png",
    title: "FBK",
    description: "Evenement 2024"
  },
  {
    id: 4,
    type: 'image',
    url: "/Vitaprod/c07a9f0e-26d4-4155-b031-3862afb1635e.png",
    thumbnail: "/Vitaprod/c07a9f0e-26d4-4155-b031-3862afb1635e.png",
    title: "FBK",
    description: "Aleem Ray"
  },
  {
    id: 5,
    type: 'image',
    url: "/Vitaprod/d70a9d86-9229-44b0-b1fe-37b1861f9a92.png",
    thumbnail: "/Vitaprod/d70a9d86-9229-44b0-b1fe-37b1861f9a92.png",
    title: "Dorsaf Hamdani",
    description: "Portrait photo"
  },
  {
    id: 6,
    type: 'image',
    url: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟1.webp",
    thumbnail: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟1.webp",
    title: "FBK Official Project",
    description: "Behind the scenes photography"
  },
  {
    id: 7,
    type: 'image',
    url: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟2.webp",
    thumbnail: "/Vitaprod/Some snaps from the next project featuring _f.b.k_official ✨️ _Enjoyable shoot _ loved the outcome ⚡️_Cinematography _ Edit _ _og__visuals 👽🁟2.webp",
    title: "Visual Production",
    description: "Creative direction and cinematography"
  },
  {
    id: 8,
    type: 'image',
    url: "/Vitaprod/حين تنبض الشوارع بإيقاعات الحياة و الموسيقى 🎶_نستناوكم نهار 20 جانفي ضمن فعاليات أيام(.jpg",
    thumbnail: "/Vitaprod/حين تنبض الشوارع بإيقاعات الحياة و الموسيقى 🎶_نستناوكم نهار 20 جانفي ضمن فعاليات أيام(.jpg",
    title: "Street Rhythms",
    description: "Live music event - January 20th"
  },
  {
    id: 9,
    type: 'image',
    url: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _1.jpg",
    thumbnail: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _1.jpg",
    title: "Habib Bourguiba Avenue",
    description: "Unforgettable moments"
  },
  {
    id: 10,
    type: 'image',
    url: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _2.jpg",
    thumbnail: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _2.jpg",
    title: "Street Performance",
    description: "Live music on Bourguiba Avenue"
  },
  {
    id: 11,
    type: 'image',
    url: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _3.jpg",
    thumbnail: "/Vitaprod/شارع الحبيب بورقيبة 🥹 شكرا على اللحظات التي لا تنسى ❤️❤️_مالها إلا البداية .. ولنا _3.jpg",
    title: "Urban Vibes",
    description: "Cultural celebration in the city"
  },
  {
    id: 12,
    type: 'image',
    url: "/Vitaprod/The Black Diamond 👀🖤(JPG).jpg",
    thumbnail: "/Vitaprod/The Black Diamond 👀🖤(JPG).jpg",
    title: "The Black Diamond",
    description: "Exclusive performance showcase"
  },
  {
    id: 13,
    type: 'image',
    url: "/Vitaprod/L_artiste Dorsaf Hamdani poursuit sa tournée internationale_ cette fois au Canada_ dans le cadre du Festival du monde arabe à Montréal dans sa 25ème éd(.jpg",
    thumbnail: "/Vitaprod/L_artiste Dorsaf Hamdani poursuit sa tournée internationale_ cette fois au Canada_ dans le cadre du Festival du monde arabe à Montréal dans sa 25ème éd(.jpg",
    title: "Dorsaf Hamdani International Tour",
    description: "Festival du monde arabe à Montréal - 25th Edition"
  },
  {
    id: 14,
    type: 'image',
    url: "/Vitaprod/💗💗💗_Dressed by _miroirmondain_Makeup by _amal.assali.56_Hair by _odilbeaute(JPG).jpg",
    thumbnail: "/Vitaprod/💗💗💗_Dressed by _miroirmondain_Makeup by _amal.assali.56_Hair by _odilbeaute(JPG).jpg",
    title: "Fashion Collaboration",
    description: "Styling by Miroir Mondain, Makeup by Amal Assali"
  },
  {
    id: 15,
    type: 'image',
    url: "/Vitaprod/💗💗💗_Dressed by _miroirmondain_Makeup by _amal.assali.56_Hair by _odilbeaute(JPG)_2.jpg",
    thumbnail: "/Vitaprod/💗💗💗_Dressed by _miroirmondain_Makeup by _amal.assali.56_Hair by _odilbeaute(JPG)_2.jpg",
    title: "Fashion Editorial",
    description: "Complete look by top stylists"
  }
];

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState(allPhotos);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const shuffledPhotos = [...allPhotos].sort(() => Math.random() - 0.5);
    setGalleryPhotos(shuffledPhotos);
  }, []);

  const displayedPhotos = showAll ? galleryPhotos : galleryPhotos.slice(0, 6);
  const remainingPhotos = galleryPhotos.length - 6;

  const handlePrevious = () => {
    setSelectedPhoto((current) => 
      current === 0 ? galleryPhotos.length - 1 : current! - 1
    );
  };

  const handleNext = () => {
    setSelectedPhoto((current) => 
      current === galleryPhotos.length - 1 ? 0 : current! + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto === null) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedPhoto(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-rich-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Notre Galerie
          </h2>
          <p className="text-xl text-white/80">
            Un aperçu de nos réalisations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
          {displayedPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square cursor-pointer group"
              onClick={() => setSelectedPhoto(index)}
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden bg-rich-black">
                <motion.img
                  src={photo.thumbnail}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0"
                  loading="lazy"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-gold-400">{photo.title}</h3>
                    <p className="text-sm text-white/80">{photo.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAll && remainingPhotos > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gold-400 hover:bg-gold-500 text-black font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Voir {remainingPhotos} photos de plus
            </button>
          </motion.div>
        )}
      </div>

      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-black/95 border-none">
          {selectedPhoto !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
                className="absolute right-4 top-4 z-50 text-gold-400 hover:text-gold-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <motion.button
                className="absolute left-4 z-50 text-gold-400 hover:text-gold-300 transition-colors md:left-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPhoto}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center p-4 md:p-8"
                >
                  <motion.img
                    src={galleryPhotos[selectedPhoto].url}
                    alt={galleryPhotos[selectedPhoto].title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  />
                </motion.div>
              </AnimatePresence>

              <motion.button
                className="absolute right-4 z-50 text-gold-400 hover:text-gold-300 transition-colors md:right-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
              </motion.button>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                <motion.h2 
                  className="text-xl md:text-2xl font-bold text-gold-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {galleryPhotos[selectedPhoto].title}
                </motion.h2>
                <motion.p 
                  className="text-white/80 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {galleryPhotos[selectedPhoto].description}
                </motion.p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PhotoGallery;
