import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Home2025 from './pages/Home2025';
import SponsorshipPage from './pages/SponsorshipPage';
import AboutPage from './pages/AboutPage';
import PreviousYearPage from './pages/PreviousYearPage';
import CompetitionPage from './pages/CompetitionPage';
import AdminApp from './admin/AdminApp';
// Login/Register/MyAccount routes are temporarily disabled on the frontend
// (not deleted — pages, context, and API routes are all still intact for
// when we need to switch them back on).
// import Register from './pages/Register';
// import Login from './pages/Login';
// import MyAccount from './pages/MyAccount';
// import { AccountProvider } from './context/AccountContext';

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Give the target page a moment to mount its sections before scrolling.
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, [hash, pathname]);

  return null;
}

function PublicSite() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <ScrollToHash />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/2025" element={<Home2025 />} />
          <Route path="/partner-with-us" element={<SponsorshipPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/previous-years/:slug" element={<PreviousYearPage />} />
          <Route path="/competitions/:slug" element={<CompetitionPage />} />
          {/* Register/Login/MyAccount routes disabled for now — see imports above */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}