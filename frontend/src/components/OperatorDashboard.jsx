import React, { useState, useEffect } from 'react';
import { stellarState, DEMO_ACCOUNTS, CONTRACT_ADDRESS, TOKEN_ADDRESS } from '../services/stellarService';
import { Building2, DollarSign, Users, QrCode, TrendingUp, Settings, Plus, RefreshCw, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import QRCode from 'qrcode';

export default function OperatorDashboard({ onOpenScanner }) {
  const [lots, setLots] = useState(stellarState.parkingLots);
  const [operatorBalance, setOperatorBalance] = useState(stellarState.accounts.OPERATOR.balanceUSDC);
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(1);
  const [newRateUSDC, setNewRateUSDC] = useState('0.12');
  const [updatingRate, setUpdatingRate] = useState(false);
  const [rateSuccess, setRateSuccess] = useState('');
  
  // QR Code generator state
  const [qrMode, setQrMode] = useState('entry'); // 'entry' or 'exit'
  const [qrDataUrl, setQrDataUrl] = useState('');

  const operatorAddress = stellarState.accounts.OPERATOR.address;

  const updateDashboardState = () => {
    setLots([...stellarState.parkingLots]);
    setOperatorBalance(stellarState.accounts.OPERATOR.balanceUSDC);

    // Filter active sessions across all lots
    const active = [];
    Object.values(stellarState.activeSessions).forEach(session => {
      if (session.active) {
        active.push(session);
      }
    });
    setActiveSessions(active);
  };

  useEffect(() => {
    updateDashboardState();
    const unsubscribe = stellarState.subscribe(updateDashboardState);
    return unsubscribe;
  }, []);

  // Generate QR Code data URL
  useEffect(() => {
    const selectedLot = lots.find(l => l.id === Number(selectedLotId)) || lots[0];
    const payload = JSON.stringify({
      app: "ParkStream",
      lotId: selectedLot.id,
      lotName: selectedLot.name,
      contract: CONTRACT_ADDRESS,
      ratePerMinute: selectedLot.ratePerMinute,
      type: qrMode,
      timestamp: Date.now()
    });

    QRCode.toDataURL(payload, { width: 300, margin: 2, color: { dark: '#00F2FE', light: '#0B0F17' } })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [selectedLotId, qrMode, lots]);

  const handleUpdateRate = async (e) => {
    e.preventDefault();
    setUpdatingRate(true);
    setRateSuccess('');
    try {
      await stellarState.setOperatorRateHint(operatorAddress, selectedLotId, newRateUSDC);
      setRateSuccess(`Rate updated to $${newRateUSDC} USDC/min on Soroban contract!`);
      setTimeout(() => setRateSuccess(''), 4000);
    } catch (err) {
      alert("Error updating rate: " + err.message);
    } finally {
      setUpdatingRate(false);
    }
  };

  const currentSelectedLot = lots.find(l => l.id === Number(selectedLotId)) || lots[0];
  const totalOccupied = lots.reduce((acc, l) => acc + l.occupied, 0);
  const totalCapacity = lots.reduce((acc, l) => acc + l.capacity, 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Top Banner / Operator Identity */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 230, 118, 0.3)'
          }}>
            <Building2 size={28} color="#04140B" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Makati Parking Corporation</h2>
              <span className="pulse-badge active">Verified Lot Operator</span>
            </div>
            <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Wallet: {operatorAddress}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue Collected</div>
            <div className="mono gradient-text-emerald" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              ${Number(operatorBalance || 0).toFixed(2)} USDC
            </div>
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="var(--color-cyan)" /> Parked Drivers Now
          </div>
          <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activeSessions.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', marginTop: '4px' }}>
            Live metering on Soroban
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} color="var(--color-emerald)" /> Total Parking Capacity
          </div>
          <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalOccupied} / {totalCapacity}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {Math.round((totalOccupied / totalCapacity) * 100)}% Lot Utilization
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="var(--color-purple)" /> Stellar Settlement Network
          </div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#C084FC', marginTop: '4px' }}>
            Stellar Testnet
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sub-cent fees • Instant transfers
          </div>
        </div>

      </div>

      {/* Main 2-Column Grid: Gate QR Generator vs Lot Management & Active Vehicles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px', marginBottom: '32px' }}>
        
        {/* Printable Gate QR Generator Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={20} color="var(--color-cyan)" /> Gate QR Code Generator
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Generate Entry or Exit QR posters to display at physical parking lot gates.
          </p>

          {/* Select Lot & Mode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Select Lot</label>
              <select
                value={selectedLotId}
                onChange={(e) => setSelectedLotId(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              >
                {lots.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Gate Type</label>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
                <button
                  onClick={() => setQrMode('entry')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: qrMode === 'entry' ? 700 : 500,
                    background: qrMode === 'entry' ? 'var(--color-cyan)' : 'transparent',
                    color: qrMode === 'entry' ? '#040D1A' : 'var(--text-secondary)'
                  }}
                >
                  Entry Gate
                </button>
                <button
                  onClick={() => setQrMode('exit')}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: qrMode === 'exit' ? 700 : 500,
                    background: qrMode === 'exit' ? 'var(--color-emerald)' : 'transparent',
                    color: qrMode === 'exit' ? '#04140B' : 'var(--text-secondary)'
                  }}
                >
                  Exit Gate
                </button>
              </div>
            </div>
          </div>

          {/* QR Display */}
          <div style={{
            background: '#0B0F17',
            border: '1px dashed var(--border-glow)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Gate QR Code"
                style={{ width: '200px', height: '200px', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)' }}
              />
            )}
            <div style={{ marginTop: '14px', fontWeight: 700, fontSize: '0.95rem', color: qrMode === 'entry' ? 'var(--color-cyan)' : 'var(--color-emerald)' }}>
              {qrMode === 'entry' ? 'SCAN TO START SESSION' : 'SCAN TO END SESSION & PAY'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {currentSelectedLot.name} • ${currentSelectedLot.rateFormatted} USDC/min
            </div>
          </div>

          <a
            href={qrDataUrl}
            download={`ParkStream_Lot_${selectedLotId}_${qrMode}.png`}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Download size={16} /> Download Printable Gate Poster QR
          </a>
        </div>

        {/* Lot Rates & Soroban Contract Settings */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="var(--color-emerald)" /> Lot Pricing & Soroban Contract Audit
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Update per-minute parking fees recorded on-chain (`set_operator_rate_hint`).
          </p>

          {rateSuccess && (
            <div style={{
              background: 'rgba(0, 230, 118, 0.15)',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              color: '#00E676',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} /> {rateSuccess}
            </div>
          )}

          <form onSubmit={handleUpdateRate}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Select Lot to Update
              </label>
              <select
                value={selectedLotId}
                onChange={(e) => {
                  setSelectedLotId(Number(e.target.value));
                  const lot = lots.find(l => l.id === Number(e.target.value));
                  if (lot) setNewRateUSDC(lot.rateFormatted);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              >
                {lots.map(l => (
                  <option key={l.id} value={l.id}>{l.name} (Current: ${l.rateFormatted}/min)</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                New Per-Minute Rate (USDC)
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newRateUSDC}
                  onChange={(e) => setNewRateUSDC(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 700
                  }}
                  className="mono"
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>USDC / min</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingRate}
              className="btn-emerald"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {updatingRate ? 'Updating Soroban Rate Hint...' : 'Submit Soroban Rate Hint Transaction'}
            </button>
          </form>

          {/* Smart Contract details */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              Soroban Smart Contract Configuration:
            </div>
            <div className="mono" style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', overflowX: 'auto', color: 'var(--text-secondary)' }}>
              Contract: {CONTRACT_ADDRESS.slice(0, 16)}...{CONTRACT_ADDRESS.slice(-8)}<br />
              Token: {TOKEN_ADDRESS.slice(0, 16)}...{TOKEN_ADDRESS.slice(-8)}
            </div>
          </div>

        </div>

      </div>

      {/* Active Parked Vehicles List */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
          Active Parked Vehicles (Live Soroban Metering)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Vehicles currently parked in your lots with open on-chain session locks
        </p>

        {activeSessions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No vehicles are currently parked in any lot. Drivers will appear here when they scan an entry QR code.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Driver Address</th>
                  <th style={{ padding: '12px 16px' }}>Lot</th>
                  <th style={{ padding: '12px 16px' }}>Entry Time</th>
                  <th style={{ padding: '12px 16px' }}>Rate</th>
                  <th style={{ padding: '12px 16px' }}>Soroban Lock</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map((session, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="mono" style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-cyan)' }}>
                      {session.driver.slice(0, 12)}...{session.driver.slice(-6)}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{session.lotName}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {new Date(session.startTimeSec * 1000).toLocaleTimeString()}
                    </td>
                    <td className="mono" style={{ padding: '14px 16px', color: '#00E676' }}>
                      ${(Number(session.ratePerMinute) / 10000000).toFixed(2)} USDC/min
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="pulse-badge active">
                        <span className="pulse-dot"></span> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
