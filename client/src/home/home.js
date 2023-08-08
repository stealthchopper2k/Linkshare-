import React, { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import mainImage from '../images/LSMAIN.png';
import panelImage from '../images/LS2.png';

export default function HomePage() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      id={'aboutpage'}
      className="flex h-screen flex-shrink-1 border-b-2 border-solid border-black bg-black flex-row"
      ref={ref}
      style={{
        transform: isInView ? 'translateY(0)' : 'translateX(-200px)',
        transition: 'all 0.7s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
        opacity: isInView ? 1 : 0,
      }}
    >
      <div className="flex items-center justify-center w-2/4 h-4/4 bg-black p-4">
      </div>
      <div className="flex flex-col items-center justify-center w-2/4 h-4/4 p-4">
        <img src={mainImage} alt="asdasd"/>
        <img src={panelImage} alt="asdasd"></img>
      </div>
    </div>
  );
}
