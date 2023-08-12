import React, { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import panelImage from '../images/LS2.png?as=webp';
import dragDrop from '../images/dragdrop.png?as=webp';
import Grant from '../images/Grant.png?as=webp';
import Instruct from '../images/INSTRUCT.png?as=webp';
import ImageList from './ImageList.jsx';
import { HomeBtns } from './RegBtn.jsx';

export default function HomePage() {
  const ref = useRef(null);

  return (
    <div
      id={'aboutpage'}
      className="flex h-screen flex-shrink-1 border-b-2 border-solid border-black bg-black flex-row box-border"
      ref={ref}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }} className="flex flex-row w-full h-full">
        <div className="flex flex-col flex-shrink-1 items-center justify-center w-2/5 bg-black border-r-4 border-white">
          <div className="text-white font-roboto whitespace-normal text-center mb-6">
            <h1 className="text-6xl mb-6 flex-shrink-1">
              Designated URL pages at your hands!
            </h1>
            <span className="text-white text-2xl">Create and collaborate on improved hyperlink collections!</span>
          </div>
          <HomeBtns />
        </div>
        <ImageList images={[dragDrop, panelImage, Grant, Instruct]} />
      </motion.div>
    </div>
  );
}
