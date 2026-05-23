import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  
  // --- NEW: Preferred Barber State ---
  const [preferredBarber, setPreferredBarber] = useState('Any');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        const fetchedServices = response.data;
        setServices(fetchedServices);
        
        if (fetchedServices.length > 0) {
          const searchParams = new URLSearchParams(location.search);
          const serviceQuery = searchParams.get('service');

          if (serviceQuery) {
            const matchedService = fetchedServices.find(
              (s) => s.name.toLowerCase().trim() === serviceQuery.toLowerCase().trim()
            );
            
            if (matchedService) {
              setSelectedService(matchedService._id);
            } else {
              setSelectedService(fetchedServices[0]._id);
            }
          } else {
            setSelectedService(fetchedServices[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, [location.search]);

useEffect(() => {
    if (date) {
      const fetchSlots = async () => {
        try {
          // --- NEW: We now send BOTH the date and the requested barber to the backend! ---
          const response = await api.get(`/bookings/available-slots?date=${date}&barber=${preferredBarber}`);
          setAvailableSlots(response.data);
          setTimeSlot(''); // Reset the time slot if they change barbers
        } catch (err) {
          console.error('Failed to fetch slots', err);
        }
      };
      fetchSlots();
    }
  }, [date, preferredBarber]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const serviceObj = services.find((s) => s._id === selectedService);
      const totalPrice = serviceObj ? serviceObj.price : 0;

      // --- NEW: Added preferredBarber to the payload ---
      await api.post('/bookings', {
        service: [selectedService],
        date,
        timeSlot,
        preferredBarber, 
        totalPrice,
      });

      setMessage('Appointment Confirmed! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    }
  };

  return (
    <div className="booking-page-wrapper">
      <div className="booking-card">
        
        <div className="booking-header">
          <h2>Reserve Your Seat</h2>
          <p>Select your service, date, and time below.</p>
        </div>
        
        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleBooking}>
          
          {/* Service Selection */}
          <div className="form-group">
            <label className="form-label">Select Service</label>
            <select 
              className="form-input"
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)} 
              required
            >
              {services.length === 0 ? (
                <option value="">Loading services...</option>
              ) : (
                services.map((svc) => (
                  <option key={svc._id} value={svc._id}>
                    {svc.name} — ₹{svc.price} ({svc.duration} mins)
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date Selection */}
          <div className="form-group">
            <label className="form-label">Choose Date</label>
            <input 
              type="date" 
              className="form-input"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
              min={new Date().toISOString().split('T')[0]} 
            />
          </div>

          {/* Time Slot Selection */}
          {date && (
            <div className="form-group">
              <label className="form-label">Available Time Slots</label>
              {availableSlots.length > 0 ? (
                <div className="time-slot-grid">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`time-slot-btn ${timeSlot === slot ? 'active' : ''}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '5px' }}>
                  Sorry, no slots available on this date.
                </p>
              )}
            </div>
          )}

          {/* --- NEW: Preferred Barber Dropdown --- */}
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label className="form-label">Preferred Barber</label>
            <select 
              className="form-input" 
              value={preferredBarber}
              onChange={(e) => setPreferredBarber(e.target.value)}
              required
            >
              <option value="Any">No Preference (First Available)</option>
              <option value="Jayesh">Jayesh (Head Barber)</option>
              <option value="Yash">Yash (Senior Stylist)</option>
              <option value="Sujal">Sujal (Color & Style Expert)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-submit-booking"
            disabled={!timeSlot || message !== ''} 
          >
            {message ? 'Processing...' : 'Confirm Appointment'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Booking;