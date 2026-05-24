import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MenuManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state for adding a new service
  const [formData, setFormData] = useState({ name: '', price: '', duration: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Fetch the live menu when the page loads
  const fetchMenu = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load shop menu.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle typing in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new service to the database
  const handleAddService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/services', formData);
      alert('Service added successfully!');
      setFormData({ name: '', price: '', duration: '', description: '' }); // Clear form
      fetchMenu(); // Refresh the menu instantly
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a service
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(service => service._id !== id)); // Remove from screen
    } catch (err) {
      alert('Failed to delete service.');
    }
  };

  if (loading) return <div className="dashboard-wrapper"><h2>Loading Menu...</h2></div>;

  return (
    <div className="dashboard-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      <div className="dashboard-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="dashboard-title">Menu Manager</h2>
          <p style={{ color: '#6b7280' }}>Add, update, or remove shop services.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="btn-primary" style={{ backgroundColor: '#4b5563' }}>
          ← Back to Command Center
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* --- LEFT COLUMN: ADD NEW SERVICE FORM --- */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px', color: '#111827' }}>Add New Service</h3>
          <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div>
              <label className="form-label">Service Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g., Premium Fade" required />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" placeholder="250" required />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Duration (Mins)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="form-input" placeholder="30" required />
              </div>
            </div>

            <div>
              <label className="form-label">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" placeholder="A sharp fade with beard line-up..." rows="3"></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '10px' }}>
              {isSubmitting ? 'Adding...' : '+ Add to Menu'}
            </button>
          </form>
        </div>

        {/* --- RIGHT COLUMN: LIVE MENU LIST --- */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '20px', color: '#111827' }}>Current Live Menu</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {services.length === 0 ? (
              <p style={{ color: '#6b7280' }}>The menu is currently empty.</p>
            ) : (
              services.map(service => (
                <div key={service._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #111827' }}>
                  
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#111827' }}>{service.name}</h4>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>₹{service.price}</span>
                      <span>⏱ {service.duration} mins</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(service._id, service.name)}
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Delete
                  </button>
                  
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MenuManager;