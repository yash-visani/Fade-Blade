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
  if (error) return <div className="dashboard-wrapper"><h2 style={{ color: 'red' }}>{String(error)}</h2></div>;

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

              // 🎟️ THE PREMIUM BLACK-CARD TICKET
              <div key={safeId} className="digital-ticket" style={{
                display: 'flex',
                backgroundColor: '#111827', // Sleek jet black
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                position: 'relative',
                minHeight: '220px',
                color: 'white'
              }}>

                {/* Left Side: Premium Details */}
                <div style={{ padding: '30px', flex: '2.5', position: 'relative' }}>

                  {/* Subtle F&B Watermark Background */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '8rem', opacity: '0.03', pointerEvents: 'none', fontWeight: '900', letterSpacing: '-5px' }}>
                    F&B
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', position: 'relative', zIndex: 2 }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase' }}>
                      Fade & Blade VIP
                    </span>
                    <span style={{ backgroundColor: '#10b981', color: '#111827', padding: '6px 15px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Confirmed
                    </span>
                  </div>

                  <h2 style={{ margin: '0 0 30px 0', fontSize: '2.4rem', color: 'white', textTransform: 'capitalize', fontWeight: '900', lineHeight: '1.1', position: 'relative', zIndex: 2 }}>
                    {safeName}
                  </h2>

                  {/* Grid for Data */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', position: 'relative', zIndex: 2 }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{safeDate}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>{safeTime}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Barber</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, textTransform: 'capitalize' }}>{safeBarber}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: '#f59e0b', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#f59e0b' }}>₹{safePrice}</p>
                    </div>
                  </div>
                </div>

                {/* The Ticket Perforation (The tear-off line) */}
                <div style={{ width: '4px', background: 'radial-gradient(circle, #f9fafb 4px, transparent 5px) 0 0 / 15px 15px', backgroundColor: '#ffffff', borderLeft: '2px dashed rgba(0,0,0,0.1)', position: 'relative', zIndex: 3 }}></div>

                {/* Right Side: The White QR Stub */}
                <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', color: '#111827' }}>

                  <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
                    <QRCodeSVG value={safeId} size={110} />
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '15px 0 0 0', letterSpacing: '2px', fontWeight: 'bold' }}>ID: {safeId.slice(-6).toUpperCase()}</p>

                  <button onClick={() => window.print()} className="btn-primary" style={{ marginTop: '20px', width: '100%', fontSize: '0.85rem', padding: '12px', borderRadius: '8px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '1px', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }}>
                    🖨️ Print
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