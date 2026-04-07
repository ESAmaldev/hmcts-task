import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/edit/:id" element={<TaskForm />} />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(26,16,64,0.95)',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(16px)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;