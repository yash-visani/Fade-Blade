import { useState, useEffect } from 'react';
import api from '../api/axios';

const Lookbook = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Admin Form State
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the current user is the Master Admin
  const isAdmin = localStorage.getItem('role') === 'admin';

  const fetchLookbook = async () => {
    try {
      const response = await api.get('/lookbook');
      setPhotos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load the style gallery.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLookbook();
  }, []);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!imageUrl) return alert('Please paste an Image URL.');
    
    setIsSubmitting(true);
    try {
      await api.post('/lookbook', { imageUrl, caption });
      setImageUrl('');
      setCaption('');
      fetchLookbook(); // Refresh gallery instantly
    } catch (err) {
      alert('Failed to add photo. Ensure you are logged in as Admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this photo from the Lookbook?')) return;
    try {
      await api.delete(`/lookbook/${id}`);
      setPhotos(photos.filter(photo => photo._id !== id));
    } catch (err) {
      alert('Failed to delete photo.');
    }
  };

  if (loading) return <div className="dashboard-wrapper"><h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Gallery...</h2></div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* 🌟 PAGE HERO */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#111827', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
          The Lookbook
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          Premium cuts, flawless fades, and sharp line-ups. Find your next style.
        </p>
      </div>

      {error && <h3 style={{ color: 'red', textAlign: 'center' }}>{error}</h3>}

      {/* 🛠️ SECRET ADMIN CONTROL PANEL */}
      {isAdmin && (
        <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', marginBottom: '40px', color: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>⚙️ Admin: Add New Style</h3>
          
          <form onSubmit={handleAddPhoto} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: '2', minWidth: '250px' }}>
              <input 
                type="url" 
                placeholder="Paste Image URL here (e.g., from Google Photos or Instagram)" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', outline: 'none' }}
                required 
              />
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <input 
                type="text" 
                placeholder="Caption (Optional)" 
                value={caption} 
                onChange={(e) => setCaption(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', outline: 'none' }} 
              />
            </div>
            <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#f59e0b', color: '#111827', fontWeight: 'bold', padding: '12px 25px', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {isSubmitting ? 'Uploading...' : '+ Post to Gallery'}
            </button>
          </form>
        </div>
      )}

      {/* 📸 THE MASONRY GALLERY */}
      {photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <h3 style={{ color: '#6b7280' }}>The gallery is currently empty.</h3>
        </div>
      ) : (
        // CSS Column trick for perfect Masonry layouts without extra packages!
        <div style={{ columnCount: 'auto', columnWidth: '300px', columnGap: '20px' }}>
          {photos.map((photo) => (
            <div key={photo._id} style={{ breakInside: 'avoid', marginBottom: '20px', position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: '#1f2937' }}>
              
              {/* The Image */}
              <img 
                src={photo.imageUrl} 
                alt={photo.caption} 
                style={{ width: '100%', display: 'block', objectFit: 'cover' }} 
                onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=Image+Broken'} // Fallback if link breaks
              />
              
              {/* The Caption Overlay */}
              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '20px 15px 15px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: 'white' }}>
                <p style={{ margin: 0, fontWeight: 'bold', letterSpacing: '1px' }}>{photo.caption}</p>
              </div>

              {/* Secret Admin Delete Button */}
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(photo._id)} 
                  style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                  title="Delete Photo"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Lookbook;