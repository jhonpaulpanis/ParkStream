import React, { useState, useEffect } from 'react';
import { stellarState, TARGET_TESTNET_ACCOUNT } from '../services/stellarService';
import { Terminal, ExternalLink, Wallet, CheckCircle2, X, ShieldCheck } from 'lucide-react';

export default function Header({ currentView, setCurrentView, activeWallet, setActiveWallet }) {
  const [freighterConnected, setFreighterConnected] = useState(stellarState.freighterConnected);
  const [freighterKey, setFreighterKey] = useState(stellarState.freighterPublicKey);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = stellarState.subscribe(() => {
      setFreighterConnected(stellarState.freighterConnected);
      setFreighterKey(stellarState.freighterPublicKey);
    });
    return unsubscribe;
  }, []);

  const handleConnectExtension = async () => {
    setConnectLoading(true);
    try {
      await stellarState.connectFreighter();
      setIsWalletModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleConnectTargetAccount = async () => {
    setConnectLoading(true);
    try {
      await stellarState.connectFreighter(TARGET_TESTNET_ACCOUNT);
      setIsWalletModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = () => {
    stellarState.disconnectFreighter();
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: '12px',
        zIndex: 100,
        padding: '0 20px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(24, 30, 44, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)'
        }}>
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--color-primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#03101E',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
            }}>
              P
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              ParkStream<span style={{ color: '#38BDF8' }}>.</span>
            </span>
          </div>

          {/* Center Nav Items (Material 3 Pill Switcher) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '9999px' }}>
            <button
              onClick={() => setCurrentView('landing')}
              style={{
                background: currentView === 'landing' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: currentView === 'landing' ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '8px 18px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentView('driver')}
              style={{
                background: currentView === 'driver' ? 'var(--color-primary-gradient)' : 'transparent',
                color: currentView === 'driver' ? '#03101E' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '8px 18px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              Driver App
            </button>

            <button
              onClick={() => setCurrentView('operator')}
              style={{
                background: currentView === 'operator' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: currentView === 'operator' ? '#38BDF8' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '8px 18px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              Operator Hub
            </button>

            <button
              onClick={() => setCurrentView(currentView === 'inspector' ? 'landing' : 'inspector')}
              style={{
                background: currentView === 'inspector' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                color: currentView === 'inspector' ? '#A855F7' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '8px 18px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Terminal size={14} />
              <span>Inspector</span>
            </button>
          </nav>

          {/* Right Wallet Status / Connect Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!freighterConnected ? (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                style={{
                  background: 'var(--color-primary-gradient)',
                  color: '#03101E',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <Wallet size={15} color="#03101E" strokeWidth={2.5} />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${freighterKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Account on Stellar Expert"
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10B981',
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
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
                  <span>Freighter ({freighterKey.slice(0, 4)}...{freighterKey.slice(-4)})</span>
                  <ExternalLink size={12} color="#10B981" />
                </a>

                <button
                  onClick={handleDisconnect}
                  title="Disconnect Wallet"
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#F43F5E',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Wallet Connection Options Modal */}
      {isWalletModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} className="animate-fade-in">
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsWalletModalOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
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

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.3)'
              }}>
                <Wallet size={26} color="#040D1A" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>Connect Stellar Wallet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Choose how you want to connect your wallet to ParkStream
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleConnectExtension}
                disabled={connectLoading}
                className="glass-panel-hover"
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '16px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#06B6D4' }}>
                    Freighter Browser Extension
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Connect active key in installed Freighter extension
                  </div>
                </div>
                <CheckCircle2 size={18} color="#06B6D4" />
              </button>

              <button
                onClick={handleConnectTargetAccount}
                disabled={connectLoading}
                className="glass-panel-hover"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '16px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#10B981' }}>
                    Testnet Account GAANT...MBUM
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    10,000 XLM pre-funded Testnet account
                  </div>
                </div>
                <ShieldCheck size={18} color="#10B981" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
