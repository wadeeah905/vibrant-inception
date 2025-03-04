import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gold-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default ScrollProgress;
