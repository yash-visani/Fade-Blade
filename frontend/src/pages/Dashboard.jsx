import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api/axios';

const CustomerDashboard = () => {
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        const response = await api.get('/bookings/myappointments');
        setMyAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to securely connect to the database.');
        setLoading(false);
      }
    };
    fetchMyAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setMyAppointments(myAppointments.map(app => 
        app._id === id ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      alert('Failed to cancel.');
    }
  };

  // 🛡️ The Ultimate Data Extractor
  // This guarantees we always get a valid string for the service name
  const getSafeServiceName = (serviceData) => {
    if (!serviceData) return 'Premium Haircut';
    if (Array.isArray(serviceData) && serviceData.length > 0) return String(serviceData[0]?.name || 'Premium Haircut');
    if (typeof serviceData === 'object' && serviceData.name) return String(serviceData.name);
    return 'Premium Haircut';
  };

  if (loading) return <div className="dashboard-wrapper"><h2>Loading your tickets...</h2></div>;
  if (error) return <div className="dashboard-wrapper"><h2 style={{color: 'red'}}>{String(error)}</h2></div>;

  return (
    <div className="dashboard-wrapper ticket-page-wrapper" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 className="dashboard-title">Welcome back, {String(username)}</h2>
        <p style={{ color: '#6b7280' }}>Manage your upcoming appointments and digital tickets.</p>
      </div>

      {myAppointments.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>No appointments yet!</h3>
          <p>Book a haircut to get your digital boarding pass.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {myAppointments.map((rawApp) => {
            
            // Extracting all variables safely
            const safeId = String(rawApp._id || 'UNKNOWN');
            const safeStatus = String(rawApp.status || 'pending').toLowerCase();
            const safeDate = rawApp.date ? new Date(rawApp.date).toLocaleDateString() : 'TBD';
            const safeTime = String(rawApp.timeSlot || 'TBD');
            const safePrice = String(rawApp.totalPrice || '0');
            const safeName = getSafeServiceName(rawApp.service);
            
            let safeBarber = 'Any';
            if (rawApp.preferredBarber) {
              safeBarber = typeof rawApp.preferredBarber === 'object' 
                ? String(rawApp.preferredBarber.name || 'Any') 
                : String(rawApp.preferredBarber);
            }

            return safeStatus === 'confirmed' ? (
              
              // 🎟️ THE VIP TICKET (Fully Restored)
              <div key={safeId} className="digital-ticket" style={{ backgroundColor: 'white', borderRadius: '16px', display: 'flex', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', position: 'relative', minHeight: '200px' }}>
                
                {/* Left Side: Ticket Details */}
                <div style={{ padding: '30px', flex: '2', borderRight: '2px dashed #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', margin: '0 0 5px 0' }}>Fade & Blade VIP</h4>
                      <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111827', textTransform: 'capitalize' }}>{safeName}</h2>
                    </div>
                    <span style={{ backgroundColor: '#10b981', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>Confirmed</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Date</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>{safeDate}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Time</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>{safeTime}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Barber</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827', textTransform: 'capitalize' }}>{safeBarber}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Total</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>₹{safePrice}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Restored QR Code */}
                <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {/* The Live QR Code is Back! */}
                    <QRCodeSVG value={safeId} size={100} />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '10px', letterSpacing: '1px' }}>ID: {safeId.slice(-6).toUpperCase()}</p>
                  
                  <button onClick={() => window.print()} className="btn-primary" style={{ marginTop: '15px', width: '100%', fontSize: '0.9rem' }}>
                    🖨️ Print Ticket
                  </button>
                </div>
              </div>

            ) : (
              
              // 📋 STANDARD CARD (Pending / Cancelled)
              <div key={safeId} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', opacity: safeStatus === 'cancelled' ? 0.6 : 1, borderLeft: safeStatus === 'pending' ? '4px solid #f59e0b' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{safeName}</h3>
                  <span className={`badge badge-${safeStatus}`}>{safeStatus}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span>📅 {safeDate}</span>
                  <span>⏱️ {safeTime}</span>
                  <span style={{ textTransform: 'capitalize' }}>✂️ {safeBarber}</span>
                </div>
                
                {safeStatus === 'pending' && (
                  <button onClick={() => handleCancel(safeId)} className="btn-danger" style={{ marginTop: '15px', padding: '8px 15px', fontSize: '0.8rem' }}>
                    Cancel Request
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;