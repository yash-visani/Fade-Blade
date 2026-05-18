import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <div>
      {/* 1. HERO SECTION */}
      <div className="hero-container">
        {/* Promo Banner */}
        <div 
          data-aos="fade-down" 
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', marginBottom: '30px', border: '1px solid #f59e0b', fontSize: '0.9rem' }}
        >
          🔥 Morning Special! Get 15% Off All Haircuts Before 10 AM
        </div>

        <h1 className="hero-title" data-aos="fade-up" data-aos-delay="100">
          Precision Cuts. <span>Premium Style.</span>
        </h1>
        <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
          Experience the ultimate grooming session. From classic fades to modern styling,
          our expert barbers are here to elevate your look.
        </p>
        <div className="hero-buttons" data-aos="fade-up" data-aos-delay="300">
          <Link to="/book" className="btn-primary">Book Appointment</Link>
          {!token && (
            <Link to="/register" className="btn-secondary">Create Account</Link>
          )}
        </div>
      </div>

      {/* 2. STATS & TRUST SECTION */}
      <div className="stats-wrapper">
        <div className="stats-row">
          <div className="stat-item" data-aos="fade-up">
            <p className="stat-number">4.9/5</p>
            <p className="stat-label">Average Rating</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
            <p className="stat-number">10k+</p>
            <p className="stat-label">Happy Clients</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
            <p className="stat-number">15+</p>
            <p className="stat-label">Expert Stylists</p>
          </div>
          <div className="stat-item" data-aos="fade-up" data-aos-delay="300">
            <p className="stat-number">100%</p>
            <p className="stat-label">Satisfaction</p>
          </div>
        </div>
      </div>

      {/* 3. PREMIUM SERVICES SECTION */}
      <div className="section-container">
        <h2 className="section-title" data-aos="fade-up">Our Signature <span>Services</span></h2>

        <div className="premium-services-grid">

          {/* Card 1 - Slides in from the left */}
          <Link to="/book?service=Classic Haircut" className="premium-service-card" data-aos="fade-right" data-aos-delay="100">
            <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Classic Haircut" className="service-bg-img" />
            <div className="service-content">
              <h3>Classic Haircut</h3>
              <p>A precision cut tailored to your head shape and personal style, finished with professional styling.</p>
              <div className="service-footer">
                <p className="service-price-tag">₹300</p>
                <span className="service-book-btn">Book Now</span>
              </div>
            </div>
          </Link>

          {/* Card 2 - Fades straight up */}
          <Link to="/book?service=Hot Towel Shave" className="premium-service-card" data-aos="fade-up" data-aos-delay="200">
            <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Beard Grooming" className="service-bg-img" />
            <div className="service-content">
              <h3>Hot Towel Shave</h3>
              <p>The traditional barbershop experience. Straight razor shave with hot towels and premium oils.</p>
              <div className="service-footer">
                <p className="service-price-tag">₹150</p>
                <span className="service-book-btn">Book Now</span>
              </div>
            </div>
          </Link>

          {/* Card 3 - Slides in from the right */}
          <Link to="/book?service=The Executive Combo" className="premium-service-card" data-aos="fade-left" data-aos-delay="300">
            <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="The Combo" className="service-bg-img" />
            <div className="service-content">
              <h3>The Executive Combo</h3>
              <p>The ultimate grooming package. Includes a full haircut, beard sculpting, wash, and styling.</p>
              <div className="service-footer">
                <p className="service-price-tag">₹400</p>
                <span className="service-book-btn">Book Now</span>
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* 4. TEAM SECTION */}
      <div className="bg-dark">
        <div className="section-container">
          <h2 className="section-title" data-aos="fade-up">Meet Our <span>Master Barbers</span></h2>
          <div className="team-grid">

            {/* Team cards zoom in with a staggered delay */}
            <div className="team-card" data-aos="zoom-in" data-aos-delay="100">
              <img src="/footage/Head_Barber.jpg" alt="Jayesh Visani" className="team-image" />
              <div className="team-info">
                <h3 className="team-name">Jayesh Visani</h3>
                <p className="team-role">Head Barber / Owner</p>
                <p className="team-desc">Specializes in sharp fades and traditional straight razor shaves. 10 years experience.</p>
              </div>
            </div>

            <div className="team-card" data-aos="zoom-in" data-aos-delay="200">
              <img src="/footage/Barber1.jpg" alt="Yash Visani" className="team-image" />
              <div className="team-info">
                <h3 className="team-name">Yash Visani</h3>
                <p className="team-role">Senior Stylist</p>
                <p className="team-desc">The master of modern textures, crop tops, and beard sculpting.</p>
              </div>
            </div>

            <div className="team-card" data-aos="zoom-in" data-aos-delay="300">
              <img src="/footage/Barber2.jpg" alt="Sujal Visani" className="team-image" />
              <div className="team-info">
                <h3 className="team-name">Sujal Visani</h3>
                <p className="team-role">Color & Style Expert</p>
                <p className="team-desc">Brings creative vision to life. Expert in hair coloring and styling products.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;