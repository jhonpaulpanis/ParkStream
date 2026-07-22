import React, { useState, useEffect } from 'react';
import { stellarState, CONTRACT_ADDRESS } from '../services/stellarService';
import { Car, Building2, Terminal, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

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
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => scrollToSection('home')}
            style={{
              background: 'transparent',
              color: currentView === 'landing' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection('features')}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection('developers')}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Developers
          </button>

          <button
            onClick={() => scrollToSection('about')}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            About
          </button>
        </nav>

        {/* Interactive App Mode Switcher & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Quick Faucet Button */}
          {activeWallet === 'driver' && (
            <button
              onClick={handleFaucet}
              disabled={faucetLoading}
              title="Top up Testnet USDC balance"
              style={{
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                color: '#00F2FE',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={12} className={faucetLoading ? 'animate-spin' : ''} />
              + $25 USDC Faucet (${currentBalance.toFixed(2)})
            </button>
          )}

          {/* Operator Hub Button */}
          <button
            onClick={() => setCurrentView('operator')}
            style={{
              background: currentView === 'operator' ? 'rgba(0, 242, 254, 0.25)' : 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: '#00F2FE',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E676' }}></span>
            <span>Operator Hub</span>
          </button>

          {/* GET STARTED Primary Purple Button */}
          <button
            onClick={() => setCurrentView('driver')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
            }}
          >
            GET STARTED
          </button>

          {/* Soroban Inspector View Toggle */}
          <button
            onClick={() => setCurrentView(currentView === 'inspector' ? 'landing' : 'inspector')}
            title="Toggle Soroban Smart Contract Inspector"
            style={{
              background: currentView === 'inspector' ? 'rgba(192, 132, 252, 0.2)' : 'transparent',
              border: '1px solid var(--border-subtle)',
              color: '#C084FC',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Terminal size={14} />
            <span>Inspector</span>
          </button>

        </div>

      </div>
    </header>
  );
}
