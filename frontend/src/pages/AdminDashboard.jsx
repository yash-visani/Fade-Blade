import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const response = await api.get('/bookings/all');
        setAllAppointments(response.data);
        setLoading(false);
      } catch (err) {
        const realError = err.response?.data?.message || err.message || 'Failed to fetch.';
        setError(`Server says: ${realError}`);
        setLoading(false);
      }
    };
    fetchAllAppointments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this as ${newStatus.toUpperCase()}?`)) return;
    
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      setAllAppointments(allAppointments.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert(`Failed to ${newStatus} appointment. Please try again.`);
    }
  };

  if (loading) return <div className="dashboard-wrapper"><h2>Loading Command Center...</h2></div>;
  if (error) return <div className="dashboard-wrapper"><h2 style={{color: 'red'}}>{error}</h2></div>;

  // ==========================================
  // 📊 BUSINESS ANALYTICS ENGINE
  // ==========================================
  const pendingRequests = allAppointments.filter(app => app.status === 'pending');
  const otherAppointments = allAppointments.filter(app => app.status !== 'pending');
  
  // 1. Calculate Total Confirmed Revenue
  const totalRevenue = allAppointments
    .filter(app => app.status === 'confirmed' || app.status === 'completed')
    .reduce((sum, app) => sum + Number(app.totalPrice || 0), 0);

  // 2. Count Total Active Bookings (Ignoring cancelled ones)
  const activeBookings = allAppointments.filter(app => app.status !== 'cancelled').length;

  return (
    <div className="dashboard-wrapper" style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER */}
      <div className="dashboard-header" style={{ marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 className="dashboard-title" style={{ fontSize: '2rem', margin: 0 }}>Command Center</h2>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Master Admin: {username}</p>
        </div>
        <button onClick={() => navigate('/admin/menu')} className="btn-primary" style={{ padding: '10px 20px' }}>
          ⚙️ Manage Shop Menu
        </button>
      </div>

      {/* 📊 NEW: ANALYTICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Card 1: Revenue */}
        <div style={{ backgroundColor: '#111827', color: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Projected Revenue</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: '#10b981' }}>₹{totalRevenue}</p>
        </div>

        {/* Card 2: Total Bookings */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Appointments</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: '#111827' }}>{activeBookings}</p>
        </div>

        {/* Card 3: Pending Action */}
        <div style={{ backgroundColor: pendingRequests.length > 0 ? '#fef3c7' : 'white', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Action Required</h4>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: pendingRequests.length > 0 ? '#d97706' : '#111827' }}>
            {pendingRequests.length} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>Pending</span>
          </p>
        </div>
      </div>

      {/* --- SECTION 1: ACTION REQUIRED (PENDING) --- */}
      {pendingRequests.length > 0 && (
        <>
          <h3 style={{ color: '#f59e0b', marginBottom: '15px' }}>⚠️ Awaiting Approval</h3>
          <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
            {pendingRequests.map((app) => (
              <div key={app._id} className="appointment-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className="appointment-header">
                  <div>
                    <h3 className="appointment-service">{app.service[0]?.name || 'Service'}</h3>
                    <p className="appointment-price">₹{app.totalPrice}</p>
                  </div>
                  <span className="badge badge-pending">Pending</span>
                </div>

                <div className="appointment-details">
                  <div className="detail-row" style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '6px', marginBottom: '10px' }}>
                    <span className="detail-label" style={{ color: '#374151' }}>Customer:</span> 
                    <span className="detail-value" style={{ fontWeight: '900', color: '#111827', textTransform: 'capitalize' }}>
                      {app.user?.username || 'Guest'}
                    </span>
                  </div>
                  <div className="detail-row"><span className="detail-label">Date:</span> <span className="detail-value">{new Date(app.date).toLocaleDateString()}</span></div>
                  <div className="detail-row"><span className="detail-label">Time:</span> <span className="detail-value" style={{fontWeight: 'bold'}}>{app.timeSlot}</span></div>
                  <div className="detail-row"><span className="detail-label">Barber:</span> <span className="detail-value">{app.preferredBarber}</span></div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => handleStatusUpdate(app._id, 'confirmed')} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(app._id, 'cancelled')} className="btn-danger" style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- SECTION 2: ALL OTHER BOOKINGS --- */}
      <h3 style={{ color: '#374151', marginBottom: '15px' }}>Shop Schedule</h3>
      <div className="dashboard-grid">
        {otherAppointments.map((app) => (
          <div key={app._id} className="appointment-card" style={{ opacity: app.status === 'cancelled' ? 0.6 : 1 }}>
            <div className="appointment-header">
              <div>
                <h3 className="appointment-service">{app.service[0]?.name || 'Service'}</h3>
                <p className="appointment-price">₹{app.totalPrice}</p>
              </div>
              <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
            </div>
            
            <div className="appointment-details">
                <div className="detail-row">
                  <span className="detail-label">Customer:</span> 
                  <span className="detail-value" style={{ fontWeight: 'bold' }}>
                    {app.user?.username || 'Guest'}
                  </span>
                </div>
              <div className="detail-row"><span className="detail-label">Date:</span> <span className="detail-value">{new Date(app.date).toLocaleDateString()}</span></div>
              <div className="detail-row"><span className="detail-label">Time:</span> <span className="detail-value">{app.timeSlot}</span></div>
              <div className="detail-row"><span className="detail-label">Barber:</span> <span className="detail-value">{app.preferredBarber}</span></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;