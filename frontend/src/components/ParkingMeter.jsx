import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, MapPin, Zap, ShieldCheck, QrCode, AlertCircle } from 'lucide-react';
import { stroopsToUSDC } from '../services/stellarService';

export default function ParkingMeter({ session, onEndSession, loading }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!session || !session.active) return;

    const calculateElapsed = () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const diff = Math.max(0, nowSec - session.startTimeSec);
      setElapsedSeconds(diff);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session || !session.active) return null;

  // Format Elapsed Time: HH:MM:SS
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Smart Contract logic: (elapsedSeconds / 60) + 1 (round up, min 1)
  const durationMinutes = Math.floor(elapsedSeconds / 60) + 1;
  
  // Rate in USDC per minute
  const ratePerMinUSDC = Number(session.ratePerMinute) / 10000000;
  // Per-second stream rate for real-time ticker visualization
  const ratePerSecUSDC = ratePerMinUSDC / 60;
  // Streaming cost (real-time sub-cent accumulator)
  const streamingCostUSDC = Math.max(ratePerMinUSDC, elapsedSeconds * ratePerSecUSDC);
  
  // Final bill if ended right now (rounded up to nearest minute as per contract)
  const contractBillUSDC = durationMinutes * ratePerMinUSDC;

  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '28px',
      border: '1px solid var(--border-glow)',
      boxShadow: '0 0 35px rgba(0, 242, 254, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '32px'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="pulse-badge active">
            <span className="pulse-dot"></span>
            Session Active • Metering Live
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#00E676" /> Soroban Contract State Synced
          </span>
        </div>

        <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px' }}>
          Lot ID: #{session.lotId}
        </div>
      </div>

      {/* Lot Title & Location */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>{session.lotName}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} color="var(--color-cyan)" /> {session.location}
        </p>
      </div>

      {/* Main Grid — Clock vs Cost Ticker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>

        {/* Live Clock Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--color-cyan)" /> Parked Duration
          </div>
          <div className="mono gradient-text-cyan" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.02em', marginBottom: '8px' }}>
            {formattedTime}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Contract Minimum: 1 min • Current: <strong style={{ color: 'white' }}>{durationMinutes} min</strong> charged
          </div>
        </div>

        {/* Live USDC Streaming Cost Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(0, 230, 118, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Zap size={14} color="var(--color-emerald)" /> Live Streamed Fee (USDC)
          </div>
          <div className="mono gradient-text-emerald" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '0.02em', marginBottom: '8px' }}>
            ${Number(streamingCostUSDC || 0).toFixed(4)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Rate: <strong style={{ color: 'white' }}>${Number(ratePerMinUSDC || 0).toFixed(0)} USDC / min</strong> (${Number(ratePerSecUSDC || 0).toFixed(4)}/sec)
          </div>
        </div>

      </div>

      {/* Contract Settlement Summary & Action */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Instant Exit Settlement Total:
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-emerald)' }}>
              ${Number(contractBillUSDC || 0).toFixed(0)} USDC
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ({durationMinutes} min @ ${Number(ratePerMinUSDC || 0).toFixed(0)}/min)
            </span>
          </div>
        </div>

        <button
          className="btn-emerald"
          onClick={onEndSession}
          disabled={loading}
          style={{ fontSize: '1rem', padding: '14px 28px', borderRadius: '12px' }}
        >
          {loading ? (
            <>Processing Soroban Settlement...</>
          ) : (
            <>
              <QrCode size={20} /> Scan Exit Gate & Pay ${Number(contractBillUSDC || 0).toFixed(0)} USDC
            </>
          )}
        </button>
      </div>

    </div>
  );
}
