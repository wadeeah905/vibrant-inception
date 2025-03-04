
import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Music2 } from 'lucide-react';

const FloatingSocials = () => {
  const socials = [
    { icon: <Instagram className="h-5 w-5" />, href: 'https://www.instagram.com/vilartprod/' },
    { icon: <Facebook className="h-5 w-5" />, href: 'https://www.facebook.com/share/161tuMFPjz/?mibextid=wwXIfr' },
    { icon: <Youtube className="h-5 w-5" />, href: '#' },
    { icon: <Music2 className="h-5 w-5" />, href: '#' },
  ];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-2"
    >
      {socials.map((social, index) => (
        <motion.a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: -8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="w-10 h-10 bg-rich-black/80 backdrop-blur-sm hover:bg-gold-600/20 flex items-center justify-center rounded-l-lg text-gold-400 border border-gold-500/20 transition-all duration-300"
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default FloatingSocials;
