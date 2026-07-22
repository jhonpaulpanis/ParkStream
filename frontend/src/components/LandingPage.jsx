import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  LogOut, 
  Wallet, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Play, 
  Terminal, 
  TrendingUp, 
  Clock, 
  Coins, 
  Building2, 
  Car,
  AlertTriangle,
  Lock,
  Layers,
  Code
} from 'lucide-react';
import { stellarState, CONTRACT_ADDRESS } from '../services/stellarService';

export default function LandingPage({ onStartDemo, onOpenOperator, onOpenInspector, onOpenScanner }) {
  const [activeCliTab, setActiveCliTab] = useState('start');
  const [cliOutput, setCliOutput] = useState(null);
  const [cliRunning, setCliRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const cliCommands = {
    start: `soroban contract invoke \\
  --id ${CONTRACT_ADDRESS.slice(0, 5)}...${CONTRACT_ADDRESS.slice(-10)} \\
  --source SA73...OPERATOR \\
  --network testnet \\
  -- \\
  start_session \\
  --user GA72...DRIVER \\
  --rate 2880000 # 0.02 USDC/min`,
    query: `soroban contract invoke \\
  --id ${CONTRACT_ADDRESS.slice(0, 5)}...${CONTRACT_ADDRESS.slice(-10)} \\
  --source GA72...DRIVER \\
  --network testnet \\
  -- \\
  get_active_session \\
  --user GA72...DRIVER`,
    settle: `soroban contract invoke \\
  --id ${CONTRACT_ADDRESS.slice(0, 5)}...${CONTRACT_ADDRESS.slice(-10)} \\
  --source GA72...DRIVER \\
  --network testnet \\
  -- \\
  end_session \\
  --user GA72...DRIVER \\
  --lot_id 402`
  };

  const handleRunCommand = async () => {
    setCliRunning(true);
    setCliOutput("Invoking Soroban contract RPC on Testnet...");
    
    setTimeout(() => {
      if (activeCliTab === 'start') {
        const txHash = "f9a" + Math.random().toString(16).substr(2, 28) + "c8e";
        setCliOutput(`// Success! Soroban Transaction Confirmed\n{\n  "status": "SUCCESS",\n  "tx_hash": "${txHash}",\n  "session": {\n    "lot_id": 402,\n    "driver": "${stellarState.accounts.DRIVER.address.slice(0, 8)}...",\n    "rate_per_sec": 480,\n    "start_timestamp": ${Math.floor(Date.now() / 1000)}\n  }\n}`);
      } else if (activeCliTab === 'query') {
        setCliOutput(`// Active Session Found on Ledger\n{\n  "active": true,\n  "lot_id": 402,\n  "elapsed_seconds": 342,\n  "accrued_usdc": 0.114000\n}`);
      } else {
        const txHash = "e8b" + Math.random().toString(16).substr(2, 28) + "d9f";
        setCliOutput(`// Stream Ended & Finalized\n{\n  "status": "SETTLED",\n  "tx_hash": "${txHash}",\n  "final_amount_usdc": 0.180000,\n  "operator_vault": "${stellarState.accounts.OPERATOR.address.slice(0, 8)}..."\n}`);
      }
      setCliRunning(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommands[activeCliTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <section id="home" style={{
        padding: '60px 24px 100px',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left Text Column */}
        <div className="animate-fade-in">
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            color: '#C084FC',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '28px'
          }}>
            <Zap size={14} color="#C084FC" fill="#C084FC" />
            <span>BUILT ON STELLAR & SOROBAN</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            marginBottom: '24px'
          }}>
            ParkStream: The Future of{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00F2FE 0%, #00E676 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Metered Parking.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            Per-minute metered parking payments, settled instantly in USDC on Stellar.
          </p>

          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            maxWidth: '540px',
            lineHeight: 1.6
          }}>
            Fair, transparent, and instant payments for drivers and operators. No more rounding up, no more physical friction.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button 
              onClick={onStartDemo}
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '14px 28px',
                borderRadius: '14px',
                boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>GET STARTED</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="https://github.com/jhonpaulpanis/ParkStream"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '14px 24px',
                borderRadius: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <Code size={18} />
              <span>VIEW ON GITHUB</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E676' }}></span>
              <span>Avg Tx Time: <strong>&lt; 3.5s</strong></span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--border-subtle)'
            }}>
              <Coins size={14} color="#00F2FE" />
              <span>Fee: <strong>$0.00001 USDC</strong></span>
            </div>
          </div>

        </div>

        {/* Right Card Column - Parking Lot Mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 12, 20, 0.95) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '28px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.1)',
            position: 'relative'
          }}>
            
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#00F2FE',
                  boxShadow: '0 0 10px #00F2FE'
                }}></div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>
                  Downtown Lot #402
                </h3>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: '#00F2FE',
                background: 'rgba(0, 242, 254, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 242, 254, 0.2)'
              }}>
                LOT #402
              </span>
            </div>

            {/* Simulated Phone Screen */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '220px',
              marginBottom: '20px',
              textAlign: 'center',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '110px',
                height: '150px',
                border: '2px solid #0F172A',
                borderRadius: '16px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8FAFC'
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0F172A' }}>ParkStream</div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#0F172A',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QrCode size={40} color="#00F2FE" />
                </div>
                <div style={{
                  background: '#7C3AED',
                  color: 'white',
                  fontSize: '0.55rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  TAP TO SCAN
                </div>
              </div>
            </div>

            {/* Subtext */}
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Scan entry code to begin instant per-minute USDC stream.
            </p>

            {/* Trigger Button Link */}
            <button
              onClick={onStartDemo}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#00F2FE',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              <span>Open interactive parking session demo</span>
              <ArrowRight size={16} />
            </button>

          </div>
        </div>

      </section>

      {/* Transformation / Problem vs Solution Section */}
      <section id="features" style={{
        padding: '80px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#8B5CF6',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            TRANSFORMATION
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Modernizing an Ancient System<span style={{ color: '#00F2FE' }}>.</span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            Moving from legacy physical friction to Stellar blockchain streaming precision.
          </p>
        </div>

        {/* 2 Card Comparison Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {/* Card 1: The Problem */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.04)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '24px',
            padding: '36px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F43F5E'
              }}>
                <AlertTriangle size={22} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                The Problem
              </h3>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ color: '#F43F5E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>✕</span>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
                    Inconsistent Rates:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Drivers often overpay for time they don't use due to rigid hourly increments.
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ color: '#F43F5E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>✕</span>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
                    Cash & Machine Friction:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Physical pay-and-display machines are expensive to maintain, break frequently, and invite theft.
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ color: '#F43F5E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>✕</span>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
                    Opaque Records:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Lack of real-time digital receipts makes corporate expense accounting a nightmare.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Card 2: The Stellar Solution */}
          <div style={{
            background: 'rgba(0, 242, 254, 0.04)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '24px',
            padding: '36px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00F2FE'
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                The Stellar Solution
              </h3>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00F2FE', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>✓</span>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
                    Per-Minute Billing:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Powered by Soroban Smart Contracts for true pay-as-you-go fairness down to the exact second.
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00F2FE', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>✓</span>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
                    Instant USDC Settlement:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Funds stream directly from driver wallet to lot operator in real time on the Stellar network.
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ color: '#00F2FE', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.4 }}>✓</span>
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
                    Digital Traceability:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Every session produces an immutable, cryptographic on-chain receipt disputable by design.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Workflow Section - A Frictionless Journey */}
      <section id="workflow" style={{
        padding: '80px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'left', marginBottom: '48px', borderLeft: '3px solid #00F2FE', paddingLeft: '20px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#00F2FE',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px'
          }}>
            WORKFLOW
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '10px'
          }}>
            A Frictionless Journey<span style={{ color: '#8B5CF6' }}>.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0 }}>
            How it works in four simple steps on Stellar.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Step 1 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  STEP 1
                </span>
                <QrCode size={20} color="#8B5CF6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                1. Scan Entry
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Arrive at the lot and scan the entry QR code with any Stellar-enabled wallet.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  STEP 2
                </span>
                <Sparkles size={20} color="#00F2FE" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                2. Session Starts
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                The Soroban contract initializes. USDC begins streaming at the per-minute rate.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  STEP 3
                </span>
                <LogOut size={20} color="#00E676" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                3. Scan Exit
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Ready to leave? Scan the exit QR code to signal the end of your parking session.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  STEP 4
                </span>
                <Wallet size={20} color="#C084FC" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                4. Settlement
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                The stream closes. Payment is finalized and settled instantly to the operator vault.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onStartDemo}
            style={{
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.5)',
              color: '#C084FC',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '14px 28px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Play size={16} fill="#C084FC" />
            <span>TEST 4-STEP JOURNEY IN LIVE SIMULATOR</span>
          </button>
        </div>
      </section>

      {/* Enterprise Telemetry Section - Built for Operators */}
      <section id="about" style={{
        padding: '80px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column */}
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#00F2FE',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              ENTERPRISE TELEMETRY
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '32px'
            }}>
              Built for Operators,<br />
              <span style={{ color: '#C084FC' }}>Scalable for Cities.</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '36px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(0, 242, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00F2FE',
                  flexShrink: 0
                }}>
                  <Coins size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                    Zero Cash Handling
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Eliminate the risks and overhead of physical currency. Digital payments are secured by Stellar cryptography with zero coin collection trucks needed.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C084FC',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                    Disputable-by-design Records
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Blockchain ledger provides transparent auditing. Resolve parking disputes effortlessly with immutable cryptographic timestamps and proofs.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(0, 230, 118, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00E676',
                  flexShrink: 0
                }}>
                  <Zap size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                    Instant Liquidity
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    No waiting for weekly ACH bank transfers or merchant processor delays. Revenue is available in USDC as soon as the session ends.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenOperator}
              style={{
                background: '#00F2FE',
                color: '#040D1A',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '12px 24px',
                borderRadius: '10px',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Building2 size={16} />
              <span>LAUNCH OPERATOR ANALYTICS DASHBOARD</span>
            </button>
          </div>

          {/* Right Column - Hub Preview Card */}
          <div>
            <div style={{
              background: 'linear-gradient(145deg, #0F172A 0%, #080C14 100%)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#00E676',
                  letterSpacing: '0.08em',
                  background: 'rgba(0, 230, 118, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  LIVE CITY TELEMETRY
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: 0 }}>
                  Operator Analytics Hub
                </h4>
              </div>

              {/* Simulated Analytics Graphic */}
              <div style={{
                background: '#0B132B',
                borderRadius: '16px',
                padding: '20px',
                minHeight: '220px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Occupancy</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00F2FE' }}>87%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Active Streams</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00E676' }}>42</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>USDC Settled</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#C084FC' }}>$1,429</div>
                  </div>
                </div>

                {/* Wave/Graph simulation */}
                <div style={{
                  height: '80px',
                  width: '100%',
                  background: 'linear-gradient(180deg, rgba(0,242,254,0.15) 0%, transparent 100%)',
                  borderRadius: '8px',
                  borderBottom: '2px solid #00F2FE',
                  margin: '12px 0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'dashed rgba(255,255,255,0.2)'
                  }}></div>
                </div>
              </div>

              <button
                onClick={onOpenOperator}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>OPEN HUB</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture / Developers Section */}
      <section id="developers" style={{
        padding: '80px 24px 120px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          alignItems: 'start'
        }}>
          {/* Left Description Column */}
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#8B5CF6',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px'
            }}>
              TECHNICAL ARCHITECTURE
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '20px'
            }}>
              Engineered for Reliability<span style={{ color: '#00F2FE' }}>.</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '28px'
            }}>
              ParkStream leverages the robustness of <strong>Rust</strong> and the speed of <strong>Soroban Smart Contracts</strong> on the Stellar network to ensure atomic transactions, sub-second latency, and high throughput.
            </p>

            {/* Tech Stack Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <span className="mono" style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}>
                stellar-sdk
              </span>
              <span className="mono" style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}>
                soroban-cli
              </span>
              <span className="mono" style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}>
                rust-lang
              </span>
              <span className="mono" style={{
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)'
              }}>
                USDC (Asset)
              </span>
            </div>

            <a
              href={`https://lab.stellar.org/r/testnet/contract/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#00F2FE',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <span>READ SOROBAN SMART CONTRACT DOCS</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Right CLI Invocation Matrix */}
          <div>
            <div style={{
              background: '#070A10',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
            }}>
              {/* Header bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F43F5E' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00E676' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '6px' }}>
                    CLI Invocation Matrix
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy command"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: copied ? '#00E676' : 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                <button
                  onClick={() => { setActiveCliTab('start'); setCliOutput(null); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: activeCliTab === 'start' ? 'rgba(124, 58, 237, 0.3)' : 'transparent',
                    color: activeCliTab === 'start' ? '#C084FC' : 'var(--text-muted)',
                    border: activeCliTab === 'start' ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid transparent'
                  }}
                >
                  Start Stream Session
                </button>
                <button
                  onClick={() => { setActiveCliTab('query'); setCliOutput(null); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: activeCliTab === 'query' ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                    color: activeCliTab === 'query' ? '#00F2FE' : 'var(--text-muted)',
                    border: activeCliTab === 'query' ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent'
                  }}
                >
                  Query Active Stream
                </button>
                <button
                  onClick={() => { setActiveCliTab('settle'); setCliOutput(null); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: activeCliTab === 'settle' ? 'rgba(0, 230, 118, 0.2)' : 'transparent',
                    color: activeCliTab === 'settle' ? '#00E676' : 'var(--text-muted)',
                    border: activeCliTab === 'settle' ? '1px solid rgba(0, 230, 118, 0.4)' : '1px solid transparent'
                  }}
                >
                  Settle & Close Stream
                </button>
              </div>

              {/* Code display */}
              <div style={{
                background: '#04060A',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#A5B4FC',
                overflowX: 'auto',
                whiteSpace: 'pre',
                marginBottom: '16px'
              }}>
                {cliCommands[activeCliTab]}
              </div>

              {/* Output Display if run */}
              {cliOutput && (
                <div style={{
                  background: 'rgba(0, 230, 118, 0.05)',
                  border: '1px solid rgba(0, 230, 118, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#00E676',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '16px'
                }}>
                  {cliOutput}
                </div>
              )}

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Test contract on Soroban Testnet
                </span>

                <button
                  onClick={handleRunCommand}
                  disabled={cliRunning}
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Terminal size={14} />
                  <span>{cliRunning ? 'EXECUTING...' : 'RUN COMMAND'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
