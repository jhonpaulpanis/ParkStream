import React, { useState, useEffect } from 'react';
import { stellarState, DEMO_ACCOUNTS, CONTRACT_ADDRESS } from '../services/stellarService';
import { Car, Building2, Terminal, Wallet, Sparkles, RefreshCw, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Header({ currentView, setCurrentView, activeWallet, setActiveWallet, onOpenScanner }) {
  const [driverBalance, setDriverBalance] = useState(stellarState.accounts.DRIVER.balanceUSDC);
  const [operatorBalance, setOperatorBalance] = useState(stellarState.accounts.OPERATOR.balanceUSDC);
  const [faucetLoading, setFaucetLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = stellarState.subscribe(() => {
      setDriverBalance(stellarState.accounts.DRIVER.balanceUSDC);
      setOperatorBalance(stellarState.accounts.OPERATOR.balanceUSDC);
    });
    return unsubscribe;
  }, []);

  const handleFaucet = () => {
    setFaucetLoading(true);
    setTimeout(() => {
      stellarState.faucetDriverUSDC(25);
      setFaucetLoading(false);
    }, 600);
  };

  const activeAccount = activeWallet === 'driver' ? stellarState.accounts.DRIVER : stellarState.accounts.OPERATOR;
  const currentBalance = activeWallet === 'driver' ? driverBalance : operatorBalance;

  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <Car size={24} color="#040D1A" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }} className="gradient-text-cyan">
                ParkStream
              </h1>
              <span className="pulse-badge active">
                <span className="pulse-dot"></span>
                Stellar Soroban
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Per-Minute Metered Payments in USDC
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setCurrentView('driver')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: currentView === 'driver' ? 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)' : 'transparent',
              color: currentView === 'driver' ? '#040D1A' : 'var(--text-secondary)',
              fontWeight: currentView === 'driver' ? 700 : 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Car size={16} /> Driver App
          </button>

          <button
            onClick={() => setCurrentView('operator')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: currentView === 'operator' ? 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)' : 'transparent',
              color: currentView === 'operator' ? '#04140B' : 'var(--text-secondary)',
              fontWeight: currentView === 'operator' ? 700 : 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Building2 size={16} /> Operator Dashboard
          </button>

          <button
            onClick={() => setCurrentView('inspector')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: currentView === 'inspector' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
              color: currentView === 'inspector' ? '#C084FC' : 'var(--text-secondary)',
              fontWeight: currentView === 'inspector' ? 700 : 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: currentView === 'inspector' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent'
            }}
          >
            <Terminal size={16} /> Soroban Inspector
          </button>
        </div>

        {/* Account & Wallet Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Quick Faucet for Driver */}
          {activeWallet === 'driver' && (
            <button
              onClick={handleFaucet}
              disabled={faucetLoading}
              title="Top up Testnet USDC balance"
              style={{
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                color: 'var(--color-cyan)',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} className={faucetLoading ? 'animate-spin' : ''} />
              + $25 USDC Faucet
            </button>
          )}

          {/* Account Selector Badge */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <select
              value={activeWallet}
              onChange={(e) => setActiveWallet(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <option value="driver">🚗 Maria (Driver Wallet)</option>
              <option value="operator">🏢 Makati Corp (Operator Wallet)</option>
            </select>

            <div style={{ height: '16px', width: '1px', background: 'var(--border-subtle)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USDC:</span>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '0.9rem' }}>
                ${currentBalance.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
