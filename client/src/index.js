import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react';
import { googleSignIn, signOutGoogle } from './login/handlers';
import LogBtn from './login/btn';
import SignIn from './login/signin.js';
import SignUp from './login/signup.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './login/reset';

export function PopupLogin() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        flexShrink: 1, // flex-shrink-1
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        border: '1px solid black',
        borderRadius: '0.5rem',
        zIndex: '1',
        backgroundColor: 'white',
        padding: '1rem',
        textAlign: 'center',
        flexDirection: 'column',
      }}
    >
      <h1
        style={{
          fontSize: '3.75rem',
          fontFamily: 'Roboto, sans-serif',
          marginTop: '1rem',
          whiteSpace: 'nowrap',
        }}
      >
        To make pages Sign-In/Register!
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
        }}
      >
        <LogBtn string={'Sign In'} func={googleSignIn} />
        <LogBtn string={'Register'} func={googleSignIn} />
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // document.body.style.backgroundColor = 'black';
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      flexShrink: 1, // flex-shrink-1
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'start',
      border: '1px solid black',
      borderRadius: '0.5rem',
      zIndex: '1',
      backgroundColor: 'white',
      padding: '1rem',
      textAlign: 'center',
      flexDirection: 'column',
    }}>
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ResetPassword />}/>
        </Routes>
      </Router>
    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
