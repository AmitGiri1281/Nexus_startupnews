import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ErrorBoundary from './components/ErrorBoundary';
 
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Search = lazy(() => import('./pages/Search'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

// Not Found Page
const NotFound = () => (
  <div className="text-center py-20">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">404 - Page Not Found</h2>
    <p className="text-gray-600 dark:text-gray-300 mt-2">
      The page you're looking for doesn't exist.
    </p>
  </div>
);

// Main Content
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <Suspense fallback={<Loader fullScreen />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/article/:title" element={<ArticleDetail />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/search" element={<Search />} />

              {/* Protected routes */}
              <Route path="/bookmarks" element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

// App Wrapper
function App() {
  return (
    <Router>
      <AuthProvider>
        <NewsProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </NewsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
