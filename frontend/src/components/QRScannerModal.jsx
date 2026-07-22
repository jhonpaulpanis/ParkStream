import React, { useState } from 'react';
import { QrCode, Camera, X, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { stellarState } from '../services/stellarService';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [selectedLotId, setSelectedLotId] = useState(1);
  const [scanning, setScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onScanSuccess(selectedLotId);
      onClose();
    }, 1200);
  };

  const lots = stellarState.parkingLots;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-fade-in">

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '28px',
        position: 'relative',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 0 40px rgba(0, 242, 254, 0.2)'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Camera size={24} color="var(--color-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px 0' }}>Scan Parking Gate QR Code</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Position QR code inside the camera reticle to authenticate
          </p>
        </div>

        {/* Simulated Camera Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: '#040810',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          {/* Animated Laser Scan Line */}
          <div className="scan-line" />

          {/* Camera Frame Reticle Corners */}
          <div style={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            border: '2px dashed var(--color-cyan)',
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 242, 254, 0.03)'
          }}>
            {scanning ? (
              <div style={{ color: 'var(--color-cyan)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} className="animate-spin" /> Verifying QR...
              </div>
            ) : (
              <QrCode size={64} color="rgba(0, 242, 254, 0.4)" />
            )}
          </div>
        </div>

        {/* Gate Selection Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Simulate Camera Detection at Gate:
          </label>
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-subtle)',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            {lots.map(l => (
              <option key={l.id} value={l.id}>
                Lot #{l.id} — {l.name} (${l.rateFormatted}/min)
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          className="btn-primary"
          onClick={handleSimulateScan}
          disabled={scanning}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', justifyContent: 'center' }}
        >
          {scanning ? 'Reading Soroban Parameters...' : 'Simulate Camera QR Detection'}
        </button>

      </div>
    </div>
  );
}
