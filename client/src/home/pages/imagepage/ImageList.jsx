import React, { useState } from 'react';
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

export default function ImageList({ images, clickHandler, imageRef }) {
  return (
    <motion.ul
      ref={imageRef}
      className="grid grid-cols-2 gap-4 border-2 border-solid border-white p-16"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {images.map((img, i) => (
        <motion.li
          key={i}
          className="flex flex-col justify-center flex-shrink-1 items-center rounded-lg 2xl:h-56 2xl:w-56"
          variants={item}
          onClick={() => clickHandler(img)}
        >
          <img
            src={img.src}
            className="rounded-lg w-full h-full max-h-full hover:scale-110 object-cover"
            alt="asdasd"
          />
          <h3 className="text-white 2xl:text-xl">{img.title}</h3>
        </motion.li>
      ))}
    </motion.ul>
  );
}
