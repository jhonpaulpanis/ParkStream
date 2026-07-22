import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, ExternalLink, Download, FileText, CheckCircle2, Copy, Check } from 'lucide-react';
import { EXPLORER_BASE_URL } from '../services/stellarService';

export default function ReceiptModal({ receipt, onClose }) {
  const [copiedHash, setCopiedHash] = React.useState(false);

  useEffect(() => {
    if (receipt) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [receipt]);

  if (!receipt) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(receipt.txHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const rateUSDC = (Number(receipt.ratePerMinute) / 10000000).toFixed(2);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-fade-in">

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '32px',
        position: 'relative',
        border: '1px solid var(--color-emerald-glow)',
        boxShadow: '0 0 50px rgba(0, 230, 118, 0.2)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
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

        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(0, 230, 118, 0.4)'
          }}>
            <CheckCircle2 size={36} color="#04140B" strokeWidth={2.5} />
          </div>

          <div className="pulse-badge active" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={14} /> Settlement Complete on Stellar
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>
            Official Parking Receipt
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Instant per-minute micropayment settled via Soroban smart contract
          </p>
        </div>

        {/* Total Amount Badge */}
        <div style={{
          background: 'rgba(0, 230, 118, 0.08)',
          border: '1px solid rgba(0, 230, 118, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Total Fee Paid
          </div>
          <div className="mono gradient-text-emerald" style={{ fontSize: '2.4rem', fontWeight: 800, margin: '4px 0' }}>
            ${receipt.feeUSDC} USDC
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {receipt.durationMinutes} min @ ${rateUSDC} USDC / min
          </div>
        </div>

        {/* Itemized Details Table */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '18px',
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Parking Location:</span>
            <span style={{ fontWeight: 600, color: 'white', textAlign: 'right' }}>{receipt.lotName}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Lot ID:</span>
            <span className="mono" style={{ fontWeight: 600 }}>#{receipt.lotId}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Entry Timestamp:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{new Date(receipt.startTime).toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Exit Timestamp:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{new Date(receipt.endTime).toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Driver Wallet:</span>
            <span className="mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem' }}>
              {receipt.driver.slice(0, 8)}...{receipt.driver.slice(-6)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Operator Wallet:</span>
            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {receipt.operator.slice(0, 8)}...{receipt.operator.slice(-6)}
            </span>
          </div>
        </div>

        {/* Transaction Hash */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '10px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Transaction Hash:</span>
            <span className="mono" style={{ color: 'var(--text-primary)' }}>{receipt.txHash}</span>
          </div>

          <button
            onClick={handleCopyHash}
            style={{ background: 'transparent', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            {copiedHash ? <Check size={14} color="#00E676" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={`${EXPLORER_BASE_URL}${receipt.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ flex: 1, padding: '12px', borderRadius: '12px', textDecoration: 'none', justifyContent: 'center', fontSize: '0.9rem' }}
          >
            View on Stellar Expert <ExternalLink size={16} />
          </a>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '12px 20px', borderRadius: '12px' }}
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
