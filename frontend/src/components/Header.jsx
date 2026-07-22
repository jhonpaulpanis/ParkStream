import React, { useState, useEffect } from 'react';
import { stellarState, CONTRACT_ADDRESS } from '../services/stellarService';
import { Car, Building2, Terminal, RefreshCw, ExternalLink, ShieldCheck, Wallet, CheckCircle2 } from 'lucide-react';

export default function Header({ currentView, setCurrentView, activeWallet, setActiveWallet, onOpenScanner }) {
  const [driverBalance, setDriverBalance] = useState(stellarState.accounts.DRIVER.balanceUSDC);
  const [operatorBalance, setOperatorBalance] = useState(stellarState.accounts.OPERATOR.balanceUSDC);
  const [freighterConnected, setFreighterConnected] = useState(stellarState.freighterConnected);
  const [freighterKey, setFreighterKey] = useState(stellarState.freighterPublicKey);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = stellarState.subscribe(() => {
      setDriverBalance(stellarState.accounts.DRIVER.balanceUSDC);
      setOperatorBalance(stellarState.accounts.OPERATOR.balanceUSDC);
      setFreighterConnected(stellarState.freighterConnected);
      setFreighterKey(stellarState.freighterPublicKey);
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

  const handleConnectFreighter = async () => {
    setConnectLoading(true);
    try {
      const res = await stellarState.connectFreighter();
      if (res && res.success) {
        setActiveWallet('driver');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnectFreighter = () => {
    stellarState.disconnectFreighter();
  };

  const scrollToSection = (id) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentBalance = activeWallet === 'driver' ? driverBalance : operatorBalance;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setCurrentView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #0099FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#040D1A',
            fontWeight: 900,
            fontSize: '1.2rem',
            boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)'
          }}>
            P
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            ParkStream<span style={{ color: '#00F2FE' }}>.</span>
          </span>
        </div>

        {/* Center Nav Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setCurrentView('landing')}
            style={{
              background: 'transparent',
              color: currentView === 'landing' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentView('driver')}
            style={{
              background: currentView === 'driver' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: currentView === 'driver' ? '#00F2FE' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Driver App
          </button>

          <button
            onClick={() => setCurrentView('operator')}
            style={{
              background: currentView === 'operator' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: currentView === 'operator' ? '#00F2FE' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Operator Hub
          </button>

          <button
            onClick={() => setCurrentView(currentView === 'inspector' ? 'landing' : 'inspector')}
            style={{
              background: currentView === 'inspector' ? 'rgba(192, 132, 252, 0.15)' : 'transparent',
              color: currentView === 'inspector' ? '#C084FC' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <Terminal size={14} />
            <span>Inspector</span>
          </button>
        </nav>

        {/* Right Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={`https://stellar.expert/explorer/testnet/account/${freighterKey}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Account on Stellar Expert"
            style={{
              background: 'rgba(0, 230, 118, 0.12)',
              border: '1px solid rgba(0, 230, 118, 0.35)',
              color: '#00E676',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E676', boxShadow: '0 0 8px #00E676' }}></span>
            <span>Freighter ({freighterKey.slice(0, 4)}...{freighterKey.slice(-4)})</span>
            <ExternalLink size={12} color="#00E676" />
          </a>
        </div>

      </div>
    </header>
  );
}
