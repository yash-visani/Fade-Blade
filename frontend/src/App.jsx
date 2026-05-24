import { useEffect } from 'react'; // <-- Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos'; // <-- Import AOS
import 'aos/dist/aos.css'; // <-- Import AOS CSS

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Ticket from './pages/Ticket';
import MenuManager from './pages/MenuManager';

function App() {
  // --- Initialize Scroll Animations ---
  useEffect(() => {
    AOS.init({
      duration: 800, // How long the animation takes (in milliseconds)
      once: false,    // Whether animation should happen only once - while scrolling down
      offset: 100,   // Offset (in px) from the original trigger point
    });
  }, []);

  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/admin/menu" element={localStorage.getItem('role') === 'admin' ? <MenuManager /> : <Navigate to="/dashboard" />} />
        </Routes>
      </main>
      <WhatsAppButton /> {/* <-- 2. Add it right here! */}
      <Footer />
    </Router>
  );
}

export default App;