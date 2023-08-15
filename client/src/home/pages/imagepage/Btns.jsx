import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Btns() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="flex justify-center items-center flex-col flex-shrink-1 gap-16 mt-8 2xl:flex-row xl:flex-col md:flex-col sm:gap-4 sm:flex-col xs:flex-col"
    >
      <Link to="/signup">
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 border rounded shadow-lg w-40 focus:outline-none"
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>
      </Link>
      <Link to="/login">
        <motion.button
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 border rounded shadow-lg w-40 focus:outline-none"
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </Link>
    </motion.div>
  );
}
