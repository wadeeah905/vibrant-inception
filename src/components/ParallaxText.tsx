import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxTextProps {
  children: React.ReactNode;
  y?: number[];
}

const ParallaxText: React.FC<ParallaxTextProps> = ({ children, y = [0, -50] }) => {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], y);

  return (
    <motion.div style={{ y: yRange }}>
      {children}
    </motion.div>
  );
};

export default ParallaxText;