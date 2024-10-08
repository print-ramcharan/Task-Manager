import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { auth } from '../firebase'; // Ensure this points to your firebase configuration
import { useNavigate } from 'react-router-dom';
import logo from '../assets/COSC.png'; // Update with the path to your logo

function TopNavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        email: currentUser.email,
        displayName: currentUser.displayName || 'User',
      });
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      // Redirect to login or home page after logout
      navigate('/login');
    }).catch(error => {
      console.error("Logout failed: ", error);
    });
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <div style={styles.title}>COSC TaskManager</div>
      </div>
      <div style={styles.accountSection} onClick={toggleDropdown}>
        <FaUserCircle size={30} style={styles.accountIcon} />
        {dropdownVisible && (
          <div style={styles.dropdown}>
            {user && (
              <>
                <div style={styles.dropdownItem}>
                  <strong>{user.displayName}</strong>
                </div>
                <div style={styles.dropdownItem}>
                  {user.email}
                </div>
                <hr style={styles.separator} />
              </>
            )}
            <div style={styles.dropdownItem} onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: '90px',
    width: '100%',
    background: '#240638',
    color: '#ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px', // Adjust the size of the logo
    height: '40px',
    marginRight: '10px',
  },
  title: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  accountSection: {
    position: 'relative',
    cursor: 'pointer',
  },
  accountIcon: {
    color: '#ecf0f1',
  },
  dropdown: {
    position: 'absolute',
    top: '60px',
    right: '0',
    background: '#2c3e50',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px',
  },
  dropdownItem: {
    padding: '10px 20px',
    color: '#ecf0f1',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  separator: {
    border: 'none',
    borderBottom: '1px solid #ecf0f1',
    margin: '5px 0',
  },
};

export default TopNavBar;
