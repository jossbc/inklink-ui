import { useState } from 'react';
import './App.css';

import { 
  BrowserRouter as Router,
  Route, 
  Routes,
  Navigate 
} from 'react-router-dom';

import Dashboard from './components/Dashboard.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import SignupScreen from './components/SignupScreen.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';

import AuthorList from './components/AuthorList.jsx';
import BookList from './components/BookList.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta por defecto que redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rutas públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginScreen />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupScreen />
                </PublicRoute>
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/authors"
              element={
                <ProtectedRoute>
                  <AuthorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              }
            />

            {/* Ruta para cualquier path no definido */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;