import React, { useState, useEffect } from 'react';
import { stellarState, CONTRACT_ADDRESS, TOKEN_ADDRESS, SOROBAN_RPC_URL, EXPLORER_BASE_URL } from '../services/stellarService';
import { Terminal, Shield, ExternalLink, Code2, Cpu, CheckCircle2, Zap, Copy, Check } from 'lucide-react';

export default function ContractInspector() {
  const [logs, setLogs] = useState(stellarState.logs);
  const [copiedContract, setCopiedContract] = useState(false);

  useEffect(() => {
    const updateLogs = () => setLogs([...stellarState.logs]);
    const unsubscribe = stellarState.subscribe(updateLogs);
    return unsubscribe;
  }, []);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Contract Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(88, 28, 135, 0.2) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)'
            }}>
              <Terminal size={28} color="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Soroban Smart Contract Inspector</h2>
                <span className="pulse-badge active" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
                  Soroban v21+
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Per-minute metered parking payments engine on Stellar Testnet
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href={`https://lab.stellar.org/r/testnet/contract/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Open in Stellar Lab <ExternalLink size={14} />
            </a>

            <a
              href={`${EXPLORER_BASE_URL}0d3e7a13bfc783fa22ff178b7168eefb081c0a6cff796d9bbd60049c7544cc40`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.85rem', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#C084FC' }}
            >
              Stellar Expert Explorer <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Contract Address Copy Bar */}
        <div style={{
          marginTop: '24px',
          padding: '14px 18px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONTRACT ID:</span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--color-cyan)', fontSize: '0.9rem' }}>
              {CONTRACT_ADDRESS}
            </span>
          </div>

          <button
            onClick={handleCopyContract}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copiedContract ? <Check size={14} color="#00E676" /> : <Copy size={14} />}
            {copiedContract ? 'Copied ID' : 'Copy Contract ID'}
          </button>
        </div>
      </div>

      {/* Contract Functions Specification Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--color-cyan)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }} className="mono">
            fn init(env, token, lot_id, operator)
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            One-time setup: registers the SEP-41 settlement token and operator wallet address for a parking lot.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: '#00E676', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }} className="mono">
            fn start_session(env, driver, lot_id, rate)
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Scans entry QR code. Locks driver authentication, records ledger timestamp, and sets active parking state.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }} className="mono">
            fn end_session(env, driver, lot_id)
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Scans exit QR code. Computes elapsed minutes (rounded up), streams USDC fee via token client, and closes session lock.
          </p>
        </div>

      </div>

      {/* Live Soroban Invocation Log Feed */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={20} color="#C084FC" /> Live Soroban Invocation Feed
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time smart contract function executions, parameters, and gas metrics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                background: 'rgba(11, 15, 23, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: log.fnName === 'end_session' ? 'rgba(0,230,118,0.2)' : log.fnName === 'start_session' ? 'rgba(0,242,254,0.2)' : 'rgba(245,158,11,0.2)',
                    color: log.fnName === 'end_session' ? '#00E676' : log.fnName === 'start_session' ? '#00F2FE' : '#F59E0B',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {log.fnName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    [{log.timestamp}]
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Gas: {log.gasUsed}</span>
                  <span style={{ color: '#00E676', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> {log.status}
                  </span>
                </div>
              </div>

              {/* Function Parameters JSON */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#94A3B8',
                overflowX: 'auto',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#64748B' }}>// Function Call Arguments</span><br />
                {JSON.stringify(log.args, null, 2)}
              </div>

              {/* Tx Hash */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Tx Hash: <strong style={{ color: 'white' }}>{log.txHash.slice(0, 20)}...{log.txHash.slice(-10)}</strong></span>
                <a
                  href={`${EXPLORER_BASE_URL}${log.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Verify Explorer <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
