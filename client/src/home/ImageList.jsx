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
    <motion.ul className="flex flex-col w-3/4 justify-start items-start" variants={container} initial="hidden"
      animate="visible">
      {images.map((img, i) => (
        <motion.li key={i} className="rounded-lg h-1/3 w-max" variants={item} >
          <img src={img} className="rounded-lg hover:scale-110 p-10" alt="asdasd"/>
        </motion.li>))}
    </motion.ul>
  );
}
