import React from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ImageList({ images }) {
  return (
    <motion.ul className="flex flex-row flex-shrink-1 flex-wrap justify-center items-center w-3/5" variants={container} initial="hidden" animate="visible">
      {images.map((img, i) => (
        <motion.li key={i} className="rounded-lg w-2/4 h-2/4 p-4" variants={item}>
          <img src={img} className="rounded-lg w-max h-full hover:scale-110 object-contain" alt="asdasd" />
        </motion.li>
      ))}
    </motion.ul>
  );
}
