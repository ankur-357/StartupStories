import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { CaseStudies } from './pages/CaseStudies';
import { CaseStudyDetail } from './pages/CaseStudyDetail';
import { EditCaseStudy } from './pages/EditCaseStudy';
import { Write } from './pages/Write';
import { Profile } from './pages/Profile';
import { LoginForm } from './components/Auth/LoginForm';
import { SignupForm } from './components/Auth/SignupForm';
import { NotFound } from './pages/NotFound';
import { Dashboard } from './pages/Dashboard';
import { CategoryPage } from './pages/CategoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
              <Route path="/case-studies/:id/edit" element={<EditCaseStudy />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/write" element={<Write />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;