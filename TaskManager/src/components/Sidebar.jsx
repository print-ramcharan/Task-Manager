import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaCheckCircle, FaClock, FaUsers, FaTrash } from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div style={styles.sidebar}>
      <ul style={styles.menu}>
        <li style={activePath === '/' ? styles.activeMenuItem : null}>
          <Link to="/" style={styles.menuItem}>
            <FaHome style={styles.icon} />
            Dashboard
          </Link>
        </li>
        <li style={activePath === '/tasks' ? styles.activeMenuItem : null}>
          <Link to="/tasks" style={styles.menuItem}>
            <FaTasks style={styles.icon} />
            Tasks
          </Link>
        </li>
        <li style={activePath === '/completed' ? styles.activeMenuItem : null}>
          <Link to="/completed" style={styles.menuItem}>
            <FaCheckCircle style={styles.icon} />
            Completed
          </Link>
        </li>
        <li style={activePath === '/in-progress' ? styles.activeMenuItem : null}>
          <Link to="/in-progress" style={styles.menuItem}>
            <FaClock style={styles.icon} />
            In Progress
          </Link>
        </li>
        <li style={activePath === '/team' ? styles.activeMenuItem : null}>
          <Link to="/team" style={styles.menuItem}>
            <FaUsers style={styles.icon} />
            Team
          </Link>
        </li>
        {/* <li style={activePath === '/trash' ? styles.activeMenuItem : null}>
          <Link to="/trash" style={styles.menuItem}>
            <FaTrash style={styles.icon} />
            Trash
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    background: '#240638',
    color: '#ecf0f1',
    marginTop: '50px', // Increase the top margin
  },
  menu: {
    listStyle: 'none',
    padding: 0,
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
  activeMenuItem: {
    backgroundColor: '#3a0a4d', // Highlight color for active item
  },
};

export default Sidebar;
