import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* Column 1: Brand */}
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            FADE <span>&</span> BLADE
          </Link>
          <p className="footer-text">
            Precision cuts and premium grooming for the modern gentleman. 
            Experience the art of barbering.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3>QUICK LINKS</h3>
          <ul className="footer-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/book">Book Appointment</Link></li>
            <li><Link to="/login">Customer Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info (UPDATED WITH LINKS) */}
        <div className="footer-col">
          <h3>VISIT US</h3>
          <p className="footer-text">
            <a 
              href="https://maps.app.goo.gl/4F48wo6dg1DPLRoy6?g_st=ac" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
              className="footer-contact-link"
            >
              📍 Y K The Man's Hair Salon<br />
              Murlidhar 1, Pavan Chakki, Gokul Nagar, Jamnagar, Gujarat 361006
            </a>
          </p>
          <p className="footer-text">
            <a 
              href="tel:+919974544118" 
              style={{ color: 'inherit', textDecoration: 'none' }}
              className="footer-contact-link"
            >
              📞 +91 99745 44118
            </a>
            <br />
            ✉️ visanijayesh1708@gmail.com
          </p>
        </div>

        {/* Column 4: Hours */}
        <div className="footer-col">
          <h3>HOURS</h3>
          <ul className="footer-list">
            <li>Mon - Sun: 9:00 AM - 8:00 PM</li>
            <li>Saturday: Closed</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Fade & Blade Barbershop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;