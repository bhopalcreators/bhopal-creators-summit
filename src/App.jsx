import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PreviousYearPage from './pages/PreviousYearPage';
import CompetitionPage from './pages/CompetitionPage';
import AdminApp from './admin/AdminApp';

function PublicSite() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/previous-years/:slug" element={<PreviousYearPage />} />
          <Route path="/competitions/:slug" element={<CompetitionPage />} />
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
