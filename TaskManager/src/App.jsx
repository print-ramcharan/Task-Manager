import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login'; // Ensure this path is correct
import MainApp from './components/MainApp';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ProtectedRoute element={MainApp} />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}



const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  contentArea: {
    padding: '20px',
    flexGrow: 1,
    width: '100%',
  },
};

export default App;
