import React from 'react';
import { HomeBtns } from './RegBtn.jsx';

export default function FrontPage() {
  return (
    <>
      <div className="h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-r from-indigo-800 to-red-900">
        <div className="text-white font-roboto whitespace-normal text-center mb-6">
          <h1 className="text-5xl md:text-7xl font-semibold mb-6">
            Designated URL pages at your Fingertips!
          </h1>
          <span className="text-2xl text-white mt-2 md:text-xl mb-8">
            Create and collaborate on improved hyperlink collections!
          </span>
        </div>
        <HomeBtns />
      </div>
    </>
  );
}
