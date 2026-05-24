import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Ticket = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Grab the booking details passed from the Booking page
    const booking = location.state?.booking;

    // If someone tries to visit /ticket directly without booking, send them home
    useEffect(() => {
        if (!booking) {
            navigate('/dashboard');
        }
    }, [booking, navigate]);

    if (!booking) return null;

    // A simple function that opens the browser's native print/save-as-pdf dialog
    const handleSaveTicket = () => {
        window.print();
    };

    return (
        <div className="ticket-page-wrapper" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', gap: '30px' }}>
            <div className="digital-ticket">

                {/* Top Section */}
                <div className="ticket-header">
                    <h2>FADE & BLADE</h2>
                    <p>CONFIRMED APPOINTMENT</p>
                </div>

                {/* Middle Section (Details) */}
                {/* Middle Section (Details) */}
                <div className="ticket-body">

                    {/* NEW: Customer Details */}
                    <div className="ticket-row">
                        <span className="ticket-label">CUSTOMER</span>
                        <span className="ticket-value" style={{ textTransform: 'uppercase' }}>
                            {localStorage.getItem('username') || 'Guest'}
                        </span>
                    </div>

                    <div className="ticket-row">
                        <span className="ticket-label">BARBER</span>
                        <span className="ticket-value">{booking.preferredBarber || 'Any Available'}</span>
                    </div>

                    <div className="ticket-row">
                        <span className="ticket-label">DATE</span>
                        <span className="ticket-value">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>

                    <div className="ticket-row">
                        <span className="ticket-label">TIME</span>
                        <span className="ticket-value" style={{ fontWeight: '900', fontSize: '1.2rem' }}>{booking.timeSlot}</span>
                    </div>

                    {/* NEW: Divider Line */}
                    <hr style={{ borderTop: '1px dashed #4b5563', margin: '10px 0', borderBottom: 'none' }} />

                    {/* NEW: Full Payment Details */}
                    <div className="ticket-row">
                        <span className="ticket-label">TOTAL AMOUNT</span>
                        <span className="ticket-value">₹{booking.totalPrice}</span>
                    </div>

                    <div className="ticket-row">
                        <span className="ticket-label">PAYMENT STATUS</span>
                        <span className="ticket-value" style={{ color: '#10b981', fontWeight: '900', letterSpacing: '1px' }}>
                            CONFIRMED
                        </span>
                    </div>

                </div>

                {/* Bottom Section (Fake Barcode for aesthetics) */}
                <div className="ticket-footer">
                    <div className="barcode">
                        |||| ||| || |||| | ||| || |||
                    </div>
                    <p className="ticket-id">ID: {booking._id || Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>

            </div>

            <button onClick={handleSaveTicket} className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                Download PDF Ticket
            </button>

        </div>
    );
};

export default Ticket;