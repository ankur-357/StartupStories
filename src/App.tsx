import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { CaseStudies } from './pages/CaseStudies';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { LoginForm as Login } from './components/Auth/LoginForm';
import { SignupForm as Signup } from './components/Auth/SignupForm';
import { Dashboard } from './pages/Dashboard';
import { Write } from './pages/Write';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';
import { CategoryPage } from './pages/CategoryPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/write" element={<Write />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;