import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import animationGif from '../assets/icon.gif';
import googleLogo from '../assets/google-log.png'; // Add Google logo path here
import backgroundImage from '../assets/bbblurry.svg'; // Import the background image

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImage})`, // Use imported image path
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)', // Apply blur effect
    zIndex: -1, // Position the background behind the content
  },
  animationContainer: {
    marginBottom: '20px',
    zIndex: 1, // Ensure content is above the background
  },
 
  title: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#ffffff', // Text color changed to white
    marginBottom: '20px',
    textAlign: 'center',
    zIndex: 1,
  },
  gifAnimation: {
    width: '200px',
    height: 'auto',
    zIndex: 1,
  },
  loginButton: {
    padding: '14px 20px', // Adjusted padding to match Google button
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4285F4', // Google blue
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    zIndex: 1,
  },
  loginButtonHover: {
    backgroundColor: '#357ae8', // Darker shade of Google blue
  },
  googleLogo: {
    width: '20px', // Adjust width of Google logo
    marginRight: '10px', // Space between logo and text
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setAnimationFinished(false);
      await signInWithPopup(auth, provider);
      setAnimationFinished(true);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background} />
      <div style={styles.animationContainer}>
        <div style={styles.title}>Task Manager</div>
        <img src={animationGif} alt="Loading Animation" style={styles.gifAnimation} />
      </div>
      <h2 style={{ fontWeight: 'bold', color: 'white' }}>Login</h2>
      <button 
        onClick={handleLogin} 
        style={styles.loginButton}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.loginButtonHover.backgroundColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.loginButton.backgroundColor}
      >
        <img src={googleLogo} alt="Google Logo" style={styles.googleLogo} />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
