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

      {/* Integrated Wallet & Gate QR Control Bar */}
      <div className="glass-panel animate-fade-in" style={{
        padding: '24px 28px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.75) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: freighterConnected ? 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)' : 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: freighterConnected ? '#040D1A' : 'var(--text-muted)',
            boxShadow: freighterConnected ? '0 0 24px rgba(6, 182, 212, 0.35)' : 'none'
          }}>
            <Wallet size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: freighterConnected ? '#06B6D4' : 'var(--text-muted)' }}>
                {freighterConnected ? 'FREIGHTER WALLET CONNECTED' : 'STELLAR WALLET DISCONNECTED'}
              </span>
              {freighterConnected ? (
                <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}>
                  Active Account
                </span>
              ) : (
                <span style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700 }}>
                  Select Account
                </span>
              )}
            </div>

            {freighterConnected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'white' }}>
                  {currentDriver.slice(0, 8)}...{currentDriver.slice(-8)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981' }}>
                    ${driverBalance.toFixed(2)} USDC Meter
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                  <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#06B6D4' }}>
                    {(stellarState.accounts.DRIVER.balanceXLM || 0).toLocaleString()} XLM
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Connect wallet to open live metered sessions on Stellar Horizon Testnet
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {freighterConnected ? (
            <a
              href={`https://stellar.expert/explorer/testnet/account/${currentDriver}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '10px 16px', borderRadius: '10px', textDecoration: 'none' }}
            >
              <span>Stellar Expert</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <button
              onClick={async () => {
                await stellarState.connectFreighter();
              }}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '10px 16px', borderRadius: '10px' }}
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          )}

          <button
            className="btn-primary"
            onClick={onOpenScanner}
            style={{ fontSize: '0.88rem', padding: '10px 20px', borderRadius: '10px' }}
          >
            <QrCode size={18} />
            <span>Scan Gate QR</span>
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#FDA4AF'
        }}>
          <AlertCircle size={18} color="#F43F5E" />
          <div style={{ flex: 1, fontSize: '0.88rem' }}>{errorMsg}</div>
          <button onClick={() => setErrorMsg('')} style={{ background: 'transparent', color: '#FDA4AF', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Active Session Meter (if session is in progress) */}
      {activeSession && (
        <div style={{ marginBottom: '32px' }}>
          <ParkingMeter
            session={activeSession}
            onEndSession={handleEndSession}
            loading={loading}
          />
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
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={22} color="var(--color-cyan)" /> Parking Receipts & Meter Sessions
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              All per-minute payments are cryptographically settled and recorded on Stellar Testnet from your connected Freighter wallet
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

      {/* Live Stellar Testnet Horizon Transactions Feed */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#00F2FE' }}>
              <Sparkles size={22} color="#00F2FE" /> Live Stellar Testnet Transactions
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time Stellar Horizon blockchain transactions for account <strong className="mono" style={{ color: '#00F2FE' }}>{currentDriver}</strong>
            </p>
          </div>

          <button
            onClick={() => {
              stellarState.fetchHorizonTransactions(currentDriver);
              stellarState.fetchHorizonBalances(currentDriver);
            }}
            style={{
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: '#00F2FE',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            <span>Refresh Transactions</span>
          </button>
        </div>

        {stellarState.stellarTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            Loading live transactions from Stellar Horizon Testnet...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stellarState.stellarTransactions.map((tx) => (
              <div
                key={tx.hash}
                style={{
                  background: 'rgba(11, 15, 23, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00F2FE'
                  }}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>{tx.type}</span>
                      <span style={{
                        fontSize: '0.7rem',
                        background: tx.successful ? 'rgba(0, 230, 118, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: tx.successful ? '#00E676' : '#F43F5E',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {tx.successful ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                      <span>Ledger: <strong style={{ color: 'white' }}>#{tx.ledger}</strong></span>
                      <span>•</span>
                      <span>{new Date(tx.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    {tx.amountStr && (
                      <div className="mono" style={{ fontWeight: 800, fontSize: '1rem', color: '#00E676' }}>
                        {tx.amountStr}
                      </div>
                    )}
                    <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Fee: {tx.feeCharged}
                    </div>
                  </div>
                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--color-cyan)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>View Tx</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
