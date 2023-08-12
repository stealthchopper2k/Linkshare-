import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function HomeBtns() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }} className="flex flex-row gap-5">
      <motion.input className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" placeholder="Insert Secret Page"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <Link to="/signup">
        <motion.button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >Sign Up</motion.button>
      </Link>
      <Link to="/login">
        <motion.button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >Login</motion.button>
      </Link>
    </motion.div>
  );
}
