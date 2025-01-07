import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BookLearningApp from './components/BookLearningApp';
import Login from './components/Login';

const AppContent = () => {
  const { user } = useAuth();
  return user ? <BookLearningApp /> : <Login />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;