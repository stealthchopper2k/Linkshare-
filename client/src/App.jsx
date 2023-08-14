import React, { useEffect, useState } from 'react';
import SignIn from './login/signin.jsx';
import SignUp from './login/signup.jsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResetPassword from './login/reset.jsx';
import HomePage from './home/home.jsx';
import './style.css';

export default function App() {
  useEffect(() => {
    // document.body.style.backgroundColor = 'black';
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ResetPassword />} />
          <Route path="/filepage" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}
