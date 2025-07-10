import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import CodeEditor from './components/CodeEditor';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('editor');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {currentView === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <CodeEditor onAnalysisComplete={(analysis) => {
            console.log('Analysis completed:', analysis);
          }} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App; 