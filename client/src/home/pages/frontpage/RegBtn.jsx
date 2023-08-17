import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export function HomeBtns() {
  const commonButtonStyles =
    'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-36';

  const inputRef = useRef(null);

  function fetchLinkPage(objectId) {
    window.location.href = `http://localhost:8080/filepage.html/#${objectId}`;
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="flex justify-center items-center flex-row flex-shrink-1 2xl:flex-row xl:flex-col md:flex-col sm:flex-col xs:flex-col"
    >
      <motion.input
        ref={inputRef}
        className={`${commonButtonStyles} 2xl:w-52`}
        placeholder="Find Secret Page"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <motion.button
        className={`${commonButtonStyles}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (inputRef.current.value.length < 4) return;
          fetchLinkPage(inputRef.current.value);
        }}
      >
        Submit
      </motion.button>
      <span className="px-4 text-white text-2xl">OR</span>
      <motion.button
        className={`${commonButtonStyles}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <a
          className="whitespace-nowrap"
          href="http://localhost:8080/filepage.html/#newFile"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create
        </a>
      </motion.button>
    </motion.div>
  );
}
