import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Booking = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // SINGLE useEffect to fetch services and check the URL
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        const fetchedServices = response.data;
        setServices(fetchedServices);
        
        if (fetchedServices.length > 0) {
          const searchParams = new URLSearchParams(location.search);
          const serviceQuery = searchParams.get('service');

          console.log("1. The URL is asking for:", serviceQuery);
          console.log("2. The database has these services:", fetchedServices.map(s => s.name));

          if (serviceQuery) {
            // Added .trim() to ignore accidental spaces
            const matchedService = fetchedServices.find(
              (s) => s.name.toLowerCase().trim() === serviceQuery.toLowerCase().trim()
            );
            
            if (matchedService) {
              console.log("3. Match found! Selecting:", matchedService.name);
              setSelectedService(matchedService._id);
            } else {
              console.log("3. No match found! Defaulting to the first service.");
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

  // Fetch available slots when a date is selected
  useEffect(() => {
    if (date) {
      const fetchSlots = async () => {
        try {
          const response = await api.get(`/bookings/available-slots?date=${date}`);
          setAvailableSlots(response.data);
          setTimeSlot('');
        } catch (err) {
          console.error('Failed to fetch slots', err);
        }
      };
      fetchSlots();
    }
  }, [date]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const serviceObj = services.find((s) => s._id === selectedService);
      const totalPrice = serviceObj ? serviceObj.price : 0;

      await api.post('/bookings', {
        service: [selectedService],
        date,
        timeSlot,
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