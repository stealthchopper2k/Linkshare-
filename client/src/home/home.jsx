import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import FrontPage from './pages/frontpage/FrontPage.jsx';
import ImagePage from './pages/imagepage/ImagePage.jsx';

export default function HomePage() {
  const ref = useRef(null);

  return (
    <motion.div
      id={'aboutpage'}
      className="snap-y my-auto snap-mandatory max-h-screen max-w-screen snap-start flex-shrink-0 overflow-scroll bg-black"
      ref={ref}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <FrontPage />
      <ImagePage />
    </motion.div>
  );
}
