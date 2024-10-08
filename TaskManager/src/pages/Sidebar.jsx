import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTasks, FaCheckCircle, FaClock, FaUsers, FaTrash } from 'react-icons/fa';

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <ul style={styles.menu}>
        <li>
          <Link to="/" style={styles.menuItem}>
            <FaHome style={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/tasks" style={styles.menuItem}>
            <FaTasks style={styles.icon} />
            Tasks
          </Link>
        </li>
        <li>
          <Link to="/completed" style={styles.menuItem}>
            <FaCheckCircle style={styles.icon} />
            Completed
          </Link>
        </li>
        <li>
          <Link to="/in-progress" style={styles.menuItem}>
            <FaClock style={styles.icon} />
            In Progress
          </Link>
        </li>
        <li>
          <Link to="/team" style={styles.menuItem}>
            <FaUsers style={styles.icon} />
            Team
          </Link>
        </li>
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    background: '#240638',
    color: '#ecf0f1',
    padding: 0,
    margin: 0,
    height: '100%', // Full height of its container
    position: 'fixed', // Keep it fixed on the left
    top: '50px', // Adjust if needed based on TopNavBar height
    left: 0,
    overflowY: 'auto', // Enable scrolling if content overflows
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    color: '#ecf0f1',
    textDecoration: 'none',
  },
  icon: {
    marginRight: '10px',
  },
};

export default Sidebar;
