import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/bookings/myappointments');
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointments');
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // --- NEW: Cancel Function ---
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      // Call the backend route we made earlier
      await api.put(`/bookings/${id}/cancel`);
      
      // Update the screen immediately without reloading the page
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, status: 'cancelled' } : app
      ));
    } catch (err) {
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const getBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'badge badge-completed';
      case 'cancelled': return 'badge badge-cancelled';
      case 'confirmed': return 'badge badge-confirmed';
      default: return 'badge badge-pending';
    }
  };

  if (loading) return <div className="dashboard-wrapper"><h2>Loading your schedule...</h2></div>;
  if (error) return <div className="dashboard-wrapper"><h2 style={{color: 'red'}}>{error}</h2></div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">My Appointments</h2>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Welcome back, {username}. Here is your booking history.</p>
        </div>
        <Link to="/book" className="btn-primary" style={{ padding: '10px 20px', fontSize: '1rem' }}>
          + New Booking
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '12px' }}>
          <h3 style={{ color: '#374151' }}>You don't have any appointments yet!</h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>Book your first session today and get fresh.</p>
          <Link to="/book" className="btn-primary">Book Now</Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {appointments.map((app) => (
            <div key={app._id} className="appointment-card">
              
              <div className="appointment-header">
                <div>
                  <h3 className="appointment-service">{app.service[0]?.name || 'Custom Service'}</h3>
                  <p className="appointment-price">₹{app.totalPrice}</p>
                </div>
                <span className={getBadgeClass(app.status)}>
                  {app.status}
                </span>
              </div>

              <div className="appointment-details">
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{new Date(app.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{app.timeSlot}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{app.service[0]?.duration || '--'} mins</span>
                </div>
              </div>

              {/* --- NEW: Conditionally Render Cancel Button --- */}
              {['pending', 'confirmed'].includes(app.status.toLowerCase()) && (
                <button 
                  onClick={() => handleCancel(app._id)}
                  className="btn-danger"
                  style={{ marginTop: '15px', width: '100%', padding: '10px' }}
                >
                  Cancel Appointment
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;