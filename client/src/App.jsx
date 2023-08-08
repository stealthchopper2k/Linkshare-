import React, { useEffect, useState } from 'react';
import SignIn from './login/signin.js';
import SignUp from './login/signup.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './login/reset';
import HomePage from './home/home.js';
import './style.css';

export default function App() {
  useEffect(() => {
    // document.body.style.backgroundColor = 'black';
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<SignIn />}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ResetPassword />}/>
        </Routes>
      </Router>
    </>
  );
}
