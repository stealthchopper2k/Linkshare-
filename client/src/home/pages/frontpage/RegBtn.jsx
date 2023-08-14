import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function HomeBtns() {
  const commonButtonStyles =
    'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-36';

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="flex justify-center items-center flex-row space-x-4 flex-shrink-1 2xl:flex-row xl:flex-col md:flex-col sm:flex-col xs:flex-col"
    >
      <motion.input
        className={`${commonButtonStyles} 2xl:w-52`}
        placeholder="Find Secret Page"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <span className="px-4 text-white text-2xl">OR</span>
      <motion.button
        className={`${commonButtonStyles}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <a
          className="whitespace-nowrap"
          href="http://192.168.1.218:8080/filepage.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create
        </a>
      </motion.button>
    </motion.div>
  );
}
