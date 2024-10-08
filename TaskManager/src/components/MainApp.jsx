import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Tasks from '../pages/Tasks';
import Completed from '../pages/Completed';
import InProgress from '../pages/InProgress';
import Team from '../pages/Team';
import Dashboard from '../pages/Dashboard';
import TopNavBar from './TopNavbar';

const MainApp = () => (
  <div style={styles.container}>
    <TopNavBar />
    <div style={styles.contentWrapper}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/in-progress" element={<InProgress />} />
          <Route path="/team" element={<Team />} />
          {/* <Route path="/trash" element={<Trash />} /> */}
        </Routes>
      </div>
    </div>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full viewport height
  },
  contentWrapper: {
    display: 'flex',
    height: '100%', // Adjust this to the height of the TopNavBar
    marginTop: ' - 50px' // Adjust this to ensure Sidebar is below the TopNavBar
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    overflowY: 'auto',
  },
};

export default MainApp;
