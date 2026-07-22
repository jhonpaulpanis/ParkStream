import React, { useState } from 'react';
import Header from './components/Header';
import DriverApp from './components/DriverApp';
import OperatorDashboard from './components/OperatorDashboard';
import ContractInspector from './components/ContractInspector';
import QRScannerModal from './components/QRScannerModal';
import ReceiptModal from './components/ReceiptModal';
import { stellarState, CONTRACT_ADDRESS } from './services/stellarService';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('driver'); // 'driver', 'operator', 'inspector'
  const [activeWallet, setActiveWallet] = useState('driver'); // 'driver', 'operator'
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleScanSuccess = async (lotId) => {
    const driverAddress = stellarState.accounts.DRIVER.address;
    const key = `${driverAddress}_${lotId}`;
    const existingSession = stellarState.activeSessions[key];

    try {
      if (existingSession && existingSession.active) {
        // If active session exists, scan exit & pay
        const res = await stellarState.endSession(driverAddress, lotId);
        if (res.receipt) {
          setSelectedReceipt(res.receipt);
        }
      } else {
        // Start new session
        await stellarState.startSession(driverAddress, lotId);
      }
    } catch (err) {
      alert("Soroban Transaction Error: " + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeWallet={activeWallet}
        setActiveWallet={setActiveWallet}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content Body */}
      <main style={{ flex: 1 }}>
        {currentView === 'driver' && (
          <DriverApp
            onOpenScanner={() => setIsScannerOpen(true)}
            onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
          />
        )}

        {currentView === 'operator' && (
          <OperatorDashboard
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {currentView === 'inspector' && (
          <ContractInspector />
        )}
      </main>

      {/* Global Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <ReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Footer */}
      <footer style={{
        background: 'rgba(8, 12, 20, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 0',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'white' }}>ParkStream</span>
            <span>•</span>
            <span>Per-minute metered parking on Stellar USDC</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Built on Stellar
            </a>
            <a
              href={`https://lab.stellar.org/r/testnet/contract/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Soroban Contract <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
