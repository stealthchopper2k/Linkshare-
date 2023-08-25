import React, { useEffect } from 'react';
import SignIn from './login/signin.jsx';
import SignUp from './login/signup.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './login/reset.jsx';
import HomePage from './home/home.jsx';
import './style.css';

export default function App() {
  useEffect(() => {
    // document.body.style.backgroundColor = 'black';
  }, []);

  function pushRoute(currPath) {
    if (currPath === 'signup') window.location.href = '/filepage#newFile'; // first login ever

    const route = document.referrer;
    const referrerURL = new URL(route);
    const prevPath = referrerURL.pathname;

    if (prevPath.includes('/filepage#newFile')) {
      // if logging in and clicked create on main page
      window.location.href = route;
    }

    if (currPath === 'login') window.location.href = '/filepage'; // handle last visited page
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignIn pushRoute={pushRoute} />} />
          <Route path="/signup" element={<SignUp pushRoute={pushRoute} />} />
          <Route path="/forgotpassword" element={<ResetPassword />} />
          {/* <Route path="/filepage" element={<ResetPassword />} /> */}
        </Routes>
      </Router>
    </>
  );
}
