import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import StaticPage from './pages/StaticPage';
import Tourism from './pages/Tourism';
import Statistics from './pages/Statistics';
import About from './pages/About';
import Schools from './pages/Schools';
import Barangays from './pages/Barangays';
import BarangayDetail from './pages/BarangayDetail';
import Hotlines from './pages/Hotlines';
import DisclaimerModal from './components/ui/DisclaimerModal';
import Government from './pages/Government';
import Search from './pages/Search';
import Projects from './pages/Projects';
import Transparency from './pages/Transparency';
import FullDisclosure from './pages/FullDisclosure';
import CitizensCharter from './pages/CitizensCharter';
import Directory from './pages/Directory';
import { isMeilisearchEnabled } from './lib/meilisearch';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <DisclaimerModal />
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/services" element={<Services />} />
              <Route
                path="/services/:category/:documentSlug"
                element={<Document categoryType="service" />}
              />
              <Route path="/government/:category" element={<Government />} />
              <Route path="/government" element={<Government />} />
              <Route path="/citizens-charter" element={<CitizensCharter />} />
              <Route path="/directory" element={<Directory />} />
              <Route
                path="/government/:category/:documentSlug"
                element={<Document categoryType="government" />}
              />
              {isMeilisearchEnabled && (
                <Route path="/search" element={<Search />} />
              )}
              <Route path="/projects" element={<Projects />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/full-disclosure" element={<FullDisclosure />} />
              <Route path="/tourism" element={<Tourism />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/barangays" element={<Barangays />} />
              <Route path="/barangays/:slug" element={<BarangayDetail />} />
              <Route path="/hotlines" element={<Hotlines />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/contact"
                element={<StaticPage key="contact" slug="contact" />}
              />
              <Route path="/:lang/:documentSlug" element={<Document />} />
              <Route path="/:documentSlug" element={<Document />} />
            </Routes>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
