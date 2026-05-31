import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import api from '../api/axios';

const AdminScanner = () => {
    const [scanStatus, setScanStatus] = useState('scanning'); // 'scanning', 'success', 'error'
    const [message, setMessage] = useState('Point camera at the VIP Ticket');
    const navigate = useNavigate();

    const handleScan = async (result) => {
        // If it finds a code and we are currently scanning
        if (result && result.length > 0 && scanStatus === 'scanning') {
            const appointmentId = result[0].rawValue;
            setScanStatus('loading');
            setMessage('Processing ticket...');

            try {
                // Send the ID directly to the database to mark as completed
                await api.put(`/bookings/${appointmentId}/status`, { status: 'completed' });

                setScanStatus('success');
                setMessage('✅ Ticket Scanned & Completed!');

                // Vibrate the phone slightly if supported to give physical feedback!
                if (navigator.vibrate) navigator.vibrate(200);

            } catch (error) {
                setScanStatus('error');
                setMessage('❌ Invalid or Expired Ticket.');
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#111827', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>QR Scanner</h2>
                <p style={{ fontSize: '1.2rem', margin: 0, color: scanStatus === 'success' ? '#10b981' : scanStatus === 'error' ? '#ef4444' : 'white' }}>
                    {message}
                </p>
            </div>

            {/* The Camera Window */}
            <div style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden', border: `4px solid ${scanStatus === 'success' ? '#10b981' : '#374151'}`, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', marginBottom: '30px' }}>
                {scanStatus === 'scanning' && (
                    <Scanner
                        onScan={handleScan}
                        onError={(error) => console.log(error?.message)}
                        components={{ audio: false, finder: true }}
                    />
                )}

                {scanStatus === 'success' && (
                    <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#1f2937' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🎯</div>
                        <h3>Transaction Closed</h3>
                    </div>
                )}

                {scanStatus === 'error' && (
                    <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#1f2937' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>⚠️</div>
                        <h3>Scan Failed</h3>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '400px' }}>
                {(scanStatus === 'success' || scanStatus === 'error') && (
                    <button onClick={() => { setScanStatus('scanning'); setMessage('Point camera at the VIP Ticket'); }} style={{ flex: 1, padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem' }}>
                        Scan Another
                    </button>
                )}
                <button onClick={() => navigate('/admin/dashboard')} style={{ flex: 1, padding: '15px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem' }}>
                    Exit Scanner
                </button>
            </div>

        </div>
    );
};

export default AdminScanner;