import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Categories for the filter buttons
  const categories = ['All', 'Fades', 'Beards', 'Scissor Cuts', 'Designs'];

  // Placeholder data (Swap the 'url' with your dad's actual photos later!)
  const portfolio = [
    { id: 1, category: 'Fades', title: 'High Skin Fade', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80' },
    { id: 2, category: 'Beards', title: 'Sharp Beard Lineup', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80' },
    { id: 3, category: 'Scissor Cuts', title: 'Classic Textured Crop', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80' },
    { id: 4, category: 'Fades', title: 'Mid Drop Fade', url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80' },
    { id: 5, category: 'Designs', title: 'Freestyle Razor Design', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80' },
    { id: 6, category: 'Beards', title: 'Full Beard Trim & Fade', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80' },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Filter the photos based on the clicked button
  const filteredPhotos = activeFilter === 'All' 
    ? portfolio 
    : portfolio.filter(photo => photo.category === activeFilter);

  return (
    <div className="gallery-page-wrapper" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="gallery-header" style={{ textAlign: 'center', marginBottom: '40px' }} data-aos="fade-up">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Our Work</h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Browse the latest cuts and styles from the Fade & Blade chairs.</p>
      </div>

      {/* Filter Buttons */}
      <div className="gallery-filters" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }} data-aos="fade-up" data-aos-delay="100">
        {categories.map(category => (
          <button 
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="gallery-grid">
        {filteredPhotos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="gallery-card" 
            data-aos="zoom-in" 
            data-aos-delay={index * 50} // Staggers the animation slightly for each photo
          >
            <img src={photo.url} alt={photo.title} className="gallery-image" />
            <div className="gallery-overlay">
              <h3 className="overlay-title">{photo.title}</h3>
              <span className="overlay-category">{photo.category}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Gallery;