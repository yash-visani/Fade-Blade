import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newService, setNewService] = useState({ name: '', category: 'Haircut', price: '', duration: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, servRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/services')
        ]);
        setAppointments(appRes.data);
        setServices(servRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/bookings/${appointmentId}/status`, { status: newStatus });
      setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, status: newStatus } : app));
    } catch (err) { alert('Failed to update status'); }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/services', newService);
      setServices([...services, response.data]);
      setNewService({ name: '', category: 'Haircut', price: '', duration: '' }); 
    } catch (err) { alert('Failed to add service'); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (err) { alert('Failed to delete service'); }
  };

  if (loading) return <div className="dashboard-wrapper"><h2>Loading headquarters...</h2></div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Command Center</h2>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Manage your shop's schedule and menu.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Menu & Services
        </button>
      </div>

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div className="dashboard-grid">
          {appointments.length === 0 ? <p>No appointments booked yet.</p> : appointments.map((app) => (
            <div key={app._id} className="appointment-card">
              
              <div className="appointment-header">
                <div>
                  <h3 className="appointment-service">{app.service[0]?.name}</h3>
                  <p className="appointment-price">₹{app.totalPrice}</p>
                </div>
                
                {/* Admin Status Dropdown */}
                <select 
                  value={app.status} 
                  onChange={(e) => handleStatusChange(app._id, e.target.value)} 
                  className="admin-status-select"
                  style={{ 
                    color: app.status === 'pending' ? '#d97706' : 
                           app.status === 'completed' ? '#166534' : 
                           app.status === 'cancelled' ? '#991b1b' : '#1e40af' 
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="appointment-details">
                <div className="detail-row">
                  <span className="detail-label">Customer:</span>
                  <span className="detail-value">{app.user?.username} ({app.user?.phone || 'No phone'})</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{new Date(app.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{app.timeSlot}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SERVICES TAB */}
      {activeTab === 'services' && (
        <div>
          {/* Add New Service Form */}
          <div className="service-manager-card">
            <h3 style={{ margin: '0 0 20px 0' }}>Add New Service</h3>
            <form onSubmit={handleAddService} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              
              <div style={{ flexGrow: 1 }}>
                <label className="form-label">Service Name</label>
                <input type="text" className="form-input" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} required placeholder="e.g. Buzz Cut" />
              </div>
              
              <div>
                <label className="form-label">Category</label>
                <select className="form-input" value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value})}>
                  <option value="Haircut">Haircut</option>
                  <option value="Beard Grooming">Beard Grooming</option>
                  <option value="Combos">Combos</option>
                </select>
              </div>
              
              <div style={{ width: '100px' }}>
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-input" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} required />
              </div>
              
              <div style={{ width: '100px' }}>
                <label className="form-label">Duration</label>
                <input type="number" className="form-input" value={newService.duration} onChange={(e) => setNewService({...newService, duration: e.target.value})} required placeholder="Mins" />
              </div>
              
              <button type="submit" className="btn-primary" style={{ height: '46px', padding: '0 25px' }}>Add</button>
            </form>
          </div>

          {/* List of Existing Services */}
          <div>
            <h3 style={{ margin: '0 0 15px 0' }}>Current Menu</h3>
            {services.map((svc) => (
              <div key={svc._id} className="service-list-item">
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{svc.name}</strong> <span style={{ color: '#6b7280', marginLeft: '10px' }}>({svc.category})</span>
                  <p style={{ margin: '5px 0 0 0', color: '#374151', fontWeight: 'bold' }}>₹{svc.price} • {svc.duration} mins</p>
                </div>
                <button onClick={() => handleDeleteService(svc._id)} className="btn-danger">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;