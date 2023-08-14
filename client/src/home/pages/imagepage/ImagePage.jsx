import React, { useEffect, useState, useRef } from 'react';
import ImageList from './ImageList.jsx';
import panelImage from '../../../images/LS2.png?as=webp';
import dragDrop from '../../../images/dragdrop.png?as=webp';
import Grant from '../../../images/Grant.png?as=webp';
import Instruct from '../../../images/INSTRUCT.png?as=webp';
import Btns from './Btns.jsx';

export default function ImagePage() {
  const [selectedImage, setImage] = useState(null);
  const imageRef = useRef(null);

  const images = [
    {
      src: panelImage,
      alt: 'panel image',
      title: 'Customisable URLs',
    },
    {
      src: dragDrop,
      alt: 'drag drop',
      title: 'Drag and Drop',
    },
    {
      src: Instruct,
      alt: 'Utility',
      title: 'Utility Panel',
    },
    {
      src: Grant,
      alt: 'Rights',
      title: 'Manage user rights',
    },
  ];

  // dragDrop, Grant, Instruct

  function handleImageClick(img) {
    setImage(img);
  }

  const defaultDropdown = (e) => {
    if (!imageRef.current.contains(e.target)) {
      setImage(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', defaultDropdown);

    return () => {
      document.removeEventListener('mousedown', defaultDropdown);
    };
  }, []);

  return (
    <div className="h-screen snap-start flex-shrink-1 border-b-2 border-solid border-black flex flex-row">
      <div className="flex flex-col justify-center items-center w-2/4 text-start">
        <h1 className="text-8xl font-bold text-white">
          Store, Share,
          <br />
          Collaborate!
        </h1>
        <Btns />
      </div>
      <div className="flex flex-col w-2/4 h-full items-center justify-center flex-shrink-1">
        <h1 className="justify-start align-start text-7xl font-bold text-white mb-4">
          View Features
        </h1>
        <ImageList
          images={images}
          clickHandler={handleImageClick}
          imageRef={imageRef}
        />
      </div>
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-screen-md">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="object-contain w-full h-auto max-h-screen"
            />
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              onClick={() => setImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
