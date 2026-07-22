import React, { useState, useEffect } from 'react';
import { stellarState, DEMO_ACCOUNTS, stroopsToUSDC, EXPLORER_BASE_URL } from '../services/stellarService';
import ParkingMeter from './ParkingMeter';
import { QrCode, MapPin, DollarSign, Clock, ShieldCheck, ArrowRight, ExternalLink, Receipt, FileText, Sparkles, AlertCircle, Wallet, CheckCircle2 } from 'lucide-react';

export default function DriverApp({ onOpenScanner, onSelectReceipt }) {
  const [parkingLots, setParkingLots] = useState(stellarState.parkingLots);
  const [activeSession, setActiveSession] = useState(null);
  const [receipts, setReceipts] = useState(stellarState.receipts);
  const [driverBalance, setDriverBalance] = useState(stellarState.accounts.DRIVER.balanceUSDC);
  const [freighterConnected, setFreighterConnected] = useState(stellarState.freighterConnected);
  const [freighterKey, setFreighterKey] = useState(stellarState.freighterPublicKey);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentDriver = stellarState.accounts.DRIVER.address;

  useEffect(() => {
    const updateState = () => {
      setParkingLots([...stellarState.parkingLots]);
      setReceipts([...stellarState.receipts]);
      setDriverBalance(stellarState.accounts.DRIVER.balanceUSDC);
      setFreighterConnected(stellarState.freighterConnected);
      setFreighterKey(stellarState.freighterPublicKey);

      // Check active session for driver
      let foundActive = null;
      for (const lot of stellarState.parkingLots) {
        const key = `${currentDriver}_${lot.id}`;
        if (stellarState.activeSessions[key] && stellarState.activeSessions[key].active) {
          foundActive = stellarState.activeSessions[key];
          break;
        }
      }
      setActiveSession(foundActive);
    };

    updateState();
    const unsubscribe = stellarState.subscribe(updateState);
    return unsubscribe;
  }, [currentDriver]);

  const handleStartSession = async (lotId) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await stellarState.startSession(currentDriver, lotId);
    } catch (err) {
      setErrorMsg(err.message || "Failed to start parking session");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await stellarState.endSession(currentDriver, activeSession.lotId);
      if (res.receipt) {
        onSelectReceipt(res.receipt);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to end parking session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>

      {/* Freighter.app Connected Account Banner */}
      <div style={{
        background: freighterConnected 
          ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)' 
          : 'rgba(15, 23, 42, 0.6)',
        border: freighterConnected ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: '20px 24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: freighterConnected ? 'linear-gradient(135deg, #00F2FE 0%, #7C3AED 100%)' : 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: freighterConnected ? '#040D1A' : 'var(--text-muted)',
            boxShadow: freighterConnected ? '0 0 20px rgba(0, 242, 254, 0.3)' : 'none'
          }}>
            <Wallet size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: freighterConnected ? '#00F2FE' : 'var(--text-muted)' }}>
                {freighterConnected ? 'FREIGHTER.APP CONNECTED' : 'STELLAR WALLET (FREIGHTER SUPPORTED)'}
              </span>
              {freighterConnected && (
                <span style={{ fontSize: '0.7rem', background: 'rgba(0, 230, 118, 0.15)', color: '#00E676', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0, 230, 118, 0.3)', fontWeight: 700 }}>
                  Active Account
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginTop: '2px' }}>
              {currentDriver}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Freighter USDC Token</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00E676' }}>
              ${driverBalance.toFixed(2)} USDC
            </div>
          </div>

          {!freighterConnected ? (
            <button
              onClick={async () => {
                await stellarState.connectFreighter();
              }}
              style={{
                background: 'linear-gradient(135deg, #00F2FE 0%, #7C3AED 100%)',
                color: '#040D1A',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '10px 20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)',
                cursor: 'pointer'
              }}
            >
              <Wallet size={16} color="#040D1A" />
              <span>Connect Freighter</span>
            </button>
          ) : (
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                padding: '8px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Freighter.app</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#FDA4AF'
        }}>
          <AlertCircle size={20} color="#F43F5E" />
          <div style={{ flex: 1, fontSize: '0.9rem' }}>{errorMsg}</div>
          <button onClick={() => setErrorMsg('')} style={{ background: 'transparent', color: '#FDA4AF', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Active Session Parking Meter or Entry Banner */}
      {activeSession ? (
        <ParkingMeter
          session={activeSession}
          onEndSession={handleEndSession}
          loading={loading}
        />
      ) : (
        <div className="glass-panel animate-fade-in" style={{
          padding: '36px',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <span className="pulse-badge" style={{ background: 'rgba(0, 242, 254, 0.12)', color: 'var(--color-cyan)', border: '1px solid rgba(0, 242, 254, 0.3)', marginBottom: '12px' }}>
              <Sparkles size={12} /> Ready to Park
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
              Scan Gate QR to Start Per-Minute Parking
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              No cash, no overcharging. Scan the entry barrier QR code to open an instant metered session on Stellar. Settled in USDC directly from your Freighter wallet to the parking operator's vault upon exit.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={onOpenScanner}
            style={{ fontSize: '1.05rem', padding: '16px 32px', borderRadius: '14px' }}
          >
            <QrCode size={22} /> Scan Gate QR Code
          </button>
        </div>
      )}

      {/* Available Parking Lots Grid */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Nearby Parking Lots (Stellar & Soroban Enabled)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select a lot below to manually simulate gate entry or scan QR code with your connected wallet</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {parkingLots.map((lot) => {
            const isThisLotActive = activeSession && activeSession.lotId === lot.id;
            return (
              <div
                key={lot.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  position: 'relative',
                  border: isThisLotActive ? '1px solid var(--color-cyan)' : '1px solid var(--border-subtle)',
                  background: isThisLotActive ? 'rgba(0, 242, 254, 0.05)' : 'var(--bg-card)'
                }}
              >
                {/* Rate tag */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(0, 230, 118, 0.15)',
                  border: '1px solid rgba(0, 230, 118, 0.3)',
                  color: '#00E676',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }} className="mono">
                  ${lot.rateFormatted} USDC/min
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Lot #{lot.id}
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', paddingRight: '90px' }}>
                  {lot.name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--color-cyan)" /> {lot.location}
                </p>

                {/* Capacity stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Occupancy:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lot.occupied} / {lot.capacity} spaces ({Math.round((lot.occupied / lot.capacity) * 100)}% full)
                  </span>
                </div>

                {/* Action button */}
                {isThisLotActive ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: 'var(--color-cyan)',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    Current Active Session
                  </div>
                ) : (
                  <button
                    className="btn-secondary"
                    disabled={!!activeSession || loading}
                    onClick={() => handleStartSession(lot.id)}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {activeSession ? 'Session in Progress Elsewhere' : `Enter Lot #${lot.id} & Start Session`}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Parking History & Receipts */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={22} color="var(--color-cyan)" /> Parking Receipts & History
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All payments are cryptographically settled and recorded on Stellar Testnet from your connected Freighter wallet
            </p>
          </div>
        </div>

        {receipts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No parking receipts found yet. Start and end a parking session to create a receipt!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {receipts.map((rec) => (
              <div
                key={rec.txHash}
                onClick={() => onSelectReceipt(rec)}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  cursor: 'pointer',
                  background: 'rgba(15, 23, 42, 0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(0, 230, 118, 0.1)',
                    border: '1px solid rgba(0, 230, 118, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={20} color="#00E676" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rec.lotName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{new Date(rec.endTime).toLocaleString()}</span>
                      <span>•</span>
                      <span>Duration: {rec.durationMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-emerald)' }}>
                      -${rec.feeUSDC} USDC
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#00E676', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                      <ShieldCheck size={12} /> Stellar Verified
                    </div>
                  </div>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
