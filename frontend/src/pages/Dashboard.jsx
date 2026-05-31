import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import api from '../api/axios';

const CustomerDashboard = () => {
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        const response = await api.get('/bookings/myappointments');
        setMyAppointments(response.data);
        setLoading(false);
      } catch (err) {
        // FIXED: Guaranteed to only save a string, never an error object
        const safeError = err.response?.data?.message || err.message || 'Failed to load tickets.';
        setError(String(safeError));
        setLoading(false);
      }
    };
    fetchMyAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setMyAppointments(myAppointments.map(app => 
        app._id === id ? { ...app, status: 'cancelled' } : app
      ));
      alert('Appointment cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  // ==========================================
  // 🛡️ THE SAFETY FILTER (Prevents Error 130)
  // ==========================================
  // MongoDB sometimes sends the service as an Array, sometimes as an Object.
  // This function forces it into a clean String so React never crashes.
  const getSafeServiceName = (serviceData) => {
    if (!serviceData) return 'Premium Service';
    if (Array.isArray(serviceData)) return serviceData[0]?.name || 'Premium Service';
    if (typeof serviceData === 'object') return serviceData.name || 'Premium Service';
    return String(serviceData);
  };

  if (loading) return <div className="dashboard-wrapper"><h2>Loading your tickets...</h2></div>;
  if (error) return <div className="dashboard-wrapper"><h2 style={{color: 'red'}}>{error}</h2></div>;

  return (
    <div className="dashboard-wrapper ticket-page-wrapper" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 className="dashboard-title">Welcome back, {username}</h2>
        <p style={{ color: '#6b7280' }}>Manage your upcoming appointments and digital tickets.</p>
      </div>

      {myAppointments.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>No appointments yet!</h3>
          <p>Book a haircut to get your digital boarding pass.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {myAppointments.map((app) => (
            
            app.status === 'confirmed' ? (
              <div key={app._id} className="digital-ticket" style={{ backgroundColor: 'white', borderRadius: '16px', display: 'flex', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', position: 'relative', minHeight: '200px' }}>
                
                {/* Left Side: Ticket Details */}
                <div style={{ padding: '30px', flex: '2', borderRight: '2px dashed #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', margin: '0 0 5px 0' }}>Fade & Blade VIP</h4>
                      
                      {/* 🛡️ Using the Safety Filter here! */}
                      <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111827' }}>
                        {getSafeServiceName(app.service)}
                      </h2>
                    </div>
                    <span style={{ backgroundColor: '#10b981', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Confirmed</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Date</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>{new Date(app.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Time</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>{app.timeSlot}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Barber</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>{app.preferredBarber}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Total</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>₹{Number(app.totalPrice || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: QR Code & Actions */}
                <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    
                    {/* 🛡️ Forcing the ID to be a string just in case */}
                    <QRCode value={String(app._id)} size={100} />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '10px', letterSpacing: '1px' }}>ID: {String(app._id).slice(-6).toUpperCase()}</p>
                  
                  <button onClick={() => window.print()} className="btn-primary" style={{ marginTop: '15px', width: '100%', fontSize: '0.9rem' }}>
                    🖨️ Print Ticket
                  </button>
                </div>
              </div>
            ) : (
              
              // Standard Card for Pending / Cancelled
              <div key={app._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', opacity: app.status === 'cancelled' ? 0.6 : 1, borderLeft: app.status === 'pending' ? '4px solid #f59e0b' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  
                  {/* 🛡️ Using the Safety Filter here! */}
                  <h3 style={{ margin: 0 }}>{getSafeServiceName(app.service)}</h3>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span>📅 {new Date(app.date).toLocaleDateString()}</span>
                  <span>⏱️ {app.timeSlot}</span>
                  <span>✂️ {app.preferredBarber}</span>
                </div>
                
                {app.status === 'pending' && (
                  <button onClick={() => handleCancel(app._id)} className="btn-danger" style={{ marginTop: '15px', padding: '8px 15px', fontSize: '0.8rem' }}>
                    Cancel Request
                  </button>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;