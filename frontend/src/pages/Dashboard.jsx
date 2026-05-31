import { useState, useEffect } from 'react';
// 🛑 We have completely removed the QRCode library for this test
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
        // 🚨 FIX 1: Hardcoded text prevents an Axios Error Object from crashing the page
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

  if (loading) return <div className="dashboard-wrapper"><h2>Loading your tickets...</h2></div>;
  
  // 🚨 FIX 2: Forced String cast just in case an object still sneaks into the error state
  if (error) return <div className="dashboard-wrapper"><h2 style={{color: 'red'}}>{String(error)}</h2></div>;

  return (
    <div className="dashboard-wrapper ticket-page-wrapper" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 className="dashboard-title">Welcome back, {String(username)}</h2>
      </div>

      {myAppointments.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>No appointments yet!</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {myAppointments.map((rawApp) => {
            
            // Fallbacks to guarantee primitive types
            const safeId = String(rawApp._id || 'UNKNOWN');
            const safeStatus = String(rawApp.status || 'pending').toLowerCase();
            const safeDate = rawApp.date ? new Date(rawApp.date).toLocaleDateString() : 'TBD';
            const safeTime = String(rawApp.timeSlot || 'TBD');
            const safePrice = Number(rawApp.totalPrice || 0);
            
            // Safely extract the nested service name
            let safeName = 'Premium Service';
            if (rawApp.service && Array.isArray(rawApp.service)) {
              safeName = String(rawApp.service[0]?.name || 'Premium Service');
            } else if (rawApp.service && typeof rawApp.service === 'object') {
              safeName = String(rawApp.service.name || 'Premium Service');
            }

            // Safely extract the barber name
            let safeBarber = 'Any';
            if (rawApp.preferredBarber && typeof rawApp.preferredBarber === 'object') {
              safeBarber = String(rawApp.preferredBarber.name || 'Any');
            } else if (rawApp.preferredBarber) {
              safeBarber = String(rawApp.preferredBarber);
            }

            return safeStatus === 'confirmed' ? (
              <div key={safeId} className="digital-ticket" style={{ backgroundColor: 'white', borderRadius: '16px', display: 'flex', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', minHeight: '200px' }}>
                
                {/* Details */}
                <div style={{ padding: '30px', flex: '2', borderRight: '2px dashed #e5e7eb' }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 5px 0' }}>Fade & Blade VIP</h4>
                  <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{safeName}</h2>
                  
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px', color: '#6b7280' }}>
                    <p>Date: <span style={{fontWeight: 'bold', color: 'black'}}>{safeDate}</span></p>
                    <p>Time: <span style={{fontWeight: 'bold', color: 'black'}}>{safeTime}</span></p>
                  </div>
                </div>

                {/* Actions - QR Code completely removed for this test */}
                <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>QR Code Placeholder</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', marginTop: '10px' }}>ID: {safeId.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            ) : (
              <div key={safeId} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0 }}>{safeName}</h3>
                  <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{safeStatus}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: '#6b7280' }}>
                  <span>📅 {safeDate}</span>
                  <span>⏱️ {safeTime}</span>
                  <span>✂️ {safeBarber}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;