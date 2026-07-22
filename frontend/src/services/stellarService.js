/**
 * ParkStream Soroban Smart Contract & Stellar Service
 * Contract Address: CC54GXK5TCO54O4HTS3H7KCBKZH6XV733SDERTPVBHOHW3ZJRQO7D325
 * Explorer: https://lab.stellar.org/r/testnet/contract/CC54GXK5TCO54O4HTS3H7KCBKZH6XV733SDERTPVBHOHW3ZJRQO7D325
 */

export const CONTRACT_ADDRESS = "CC54GXK5TCO54O4HTS3H7KCBKZH6XV733SDERTPVBHOHW3ZJRQO7D325";
export const TOKEN_ADDRESS = "CC4W7G5X3USDC7STELAR4TESTNETX6XV733SDERTPVBHOHW3ZJRQO7D325";
export const STELLAR_NETWORK = "Testnet";
export const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
export const EXPLORER_BASE_URL = "https://stellar.expert/explorer/testnet/tx/";

// Default Demo Accounts
export const DEMO_ACCOUNTS = {
  DRIVER: {
    name: "Maria Santos (Driver)",
    address: "GD5XMARIASANTOS7PARKSTREAMTESTNETDRIVERR7PA25",
    role: "driver",
    balanceUSDC: 50.00,
    avatar: "🚗"
  },
  OPERATOR: {
    name: "Makati Parking Corp (Operator)",
    address: "GB7YOPERATORMAKATICENTRALPARKSTREAMSTELLARX99",
    role: "operator",
    balanceUSDC: 1250.80,
    avatar: "🏢"
  }
};

// Parking Lots Initialized in the Contract
export const INITIAL_PARKING_LOTS = [
  {
    id: 1,
    name: "Makati Central Commercial Lot #1",
    location: "Ayala Ave / Paseo de Roxas, Makati",
    operator: "GB7YOPERATORMAKATICENTRALPARKSTREAMSTELLARX99",
    ratePerMinute: 1000000, // 0.1 USDC/min (in stroops: 1,000,000 stroops = 0.1 USDC with 7 decimals)
    rateFormatted: "0.10",
    capacity: 120,
    occupied: 42,
    activeDriversCount: 1,
    status: "active"
  },
  {
    id: 2,
    name: "BGC High Street Underground Garage #2",
    location: "5th Ave, Bonifacio Global City, Taguig",
    operator: "GB7YOPERATORMAKATICENTRALPARKSTREAMSTELLARX99",
    ratePerMinute: 1500000, // 0.15 USDC/min (1,500,000 stroops)
    rateFormatted: "0.15",
    capacity: 250,
    occupied: 188,
    activeDriversCount: 0,
    status: "active"
  },
  {
    id: 3,
    name: "Ortigas Tech Hub Surface Lot #3",
    location: "Julia Vargas Ave, Ortigas Center, Pasig",
    operator: "GB7YOPERATORMAKATICENTRALPARKSTREAMSTELLARX99",
    ratePerMinute: 800000, // 0.08 USDC/min (800,000 stroops)
    rateFormatted: "0.08",
    capacity: 85,
    occupied: 29,
    activeDriversCount: 0,
    status: "active"
  }
];

// Helper to format stroops (7 decimals) to USDC string
export function stroopsToUSDC(stroops) {
  return (Number(stroops) / 10000000).toFixed(4);
}

export function usdcToStroops(usdcAmount) {
  return Math.round(Number(usdcAmount) * 10000000);
}

// Global State Store for local interactive reactivity
class StateStore {
  constructor() {
    this.parkingLots = [...INITIAL_PARKING_LOTS];
    this.accounts = { ...DEMO_ACCOUNTS };
    
    // Active session: { driverAddress, lotId, startTimeSec, ratePerMinute, active: true }
    this.activeSessions = {};
    
    // Receipt history: array of receipt objects
    this.receipts = [
      {
        txHash: "0d3e7a13bfc783fa22ff178b7168eefb081c0a6cff796d9bbd60049c7544cc40",
        driver: "GD5XMARIASANTOS7PARKSTREAMTESTNETDRIVERR7PA25",
        lotId: 1,
        lotName: "Makati Central Commercial Lot #1",
        operator: "GB7YOPERATORMAKATICENTRALPARKSTREAMSTELLARX99",
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date(Date.now() - 1800000).toISOString(),
        durationSeconds: 1800,
        durationMinutes: 30,
        ratePerMinute: 1000000,
        feeUSDC: "3.0000",
        ledgerSequence: 582910,
        verifiedOnStellar: true
      }
    ];

    // Soroban Invocation Log
    this.logs = [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
        fnName: "init",
        args: { token: TOKEN_ADDRESS, lot_id: 1, operator: DEMO_ACCOUNTS.OPERATOR.address },
        txHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        status: "SUCCESS",
        gasUsed: "142,500"
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
        fnName: "end_session",
        args: { driver: DEMO_ACCOUNTS.DRIVER.address, lot_id: 1 },
        txHash: "0d3e7a13bfc783fa22ff178b7168eefb081c0a6cff796d9bbd60049c7544cc40",
        status: "SUCCESS",
        resultFeeStroops: 30000000,
        gasUsed: "210,800"
      }
    ];

    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // --- Smart Contract Functions ---

  /**
   * Soroban function: `start_session(env, driver, lot_id, rate_per_minute)`
   */
  async startSession(driverAddress, lotId) {
    const lot = this.parkingLots.find(l => l.id === Number(lotId));
    if (!lot) throw new Error("Lot not found");

    const key = `${driverAddress}_${lotId}`;
    if (this.activeSessions[key] && this.activeSessions[key].active) {
      throw new Error("SessionAlreadyActive: You already have an active parking session at this lot.");
    }

    const startTimeSec = Math.floor(Date.now() / 1000);
    const session = {
      driver: driverAddress,
      lotId: Number(lotId),
      lotName: lot.name,
      location: lot.location,
      startTimeSec,
      ratePerMinute: lot.ratePerMinute,
      active: true
    };

    this.activeSessions[key] = session;
    lot.occupied += 1;
    lot.activeDriversCount += 1;

    // Generate random transaction hash
    const txHash = this.generateTxHash();

    // Log smart contract call
    this.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      fnName: "start_session",
      args: {
        driver: driverAddress,
        lot_id: Number(lotId),
        rate_per_minute: lot.ratePerMinute
      },
      txHash,
      status: "SUCCESS",
      gasUsed: "185,200"
    });

    this.notify();
    return { success: true, session, txHash };
  }

  /**
   * Soroban function: `end_session(env, driver, lot_id)`
   * Logic matches Rust contract:
   * duration_minutes = (elapsed_seconds / 60) + 1 (round up, min 1)
   * fee = duration_minutes * rate_per_minute
   * token_client.transfer(driver, operator, fee)
   */
  async endSession(driverAddress, lotId) {
    const key = `${driverAddress}_${lotId}`;
    const session = this.activeSessions[key];

    if (!session || !session.active) {
      throw new Error("NoActiveSession: No active parking session found.");
    }

    const lot = this.parkingLots.find(l => l.id === Number(lotId));
    const nowSec = Math.floor(Date.now() / 1000);
    const elapsedSeconds = Math.max(1, nowSec - session.startTimeSec);
    const durationMinutes = Math.floor(elapsedSeconds / 60) + 1; // contract logic: round up, min 1
    const feeStroops = durationMinutes * session.ratePerMinute;
    const feeUSDC = (feeStroops / 10000000);

    // Check balance
    if (this.accounts.DRIVER.balanceUSDC < feeUSDC) {
      throw new Error(`Insufficient USDC Balance. Required: $${feeUSDC.toFixed(4)} USDC, Available: $${this.accounts.DRIVER.balanceUSDC.toFixed(4)} USDC.`);
    }

    // Execute transfer
    this.accounts.DRIVER.balanceUSDC -= feeUSDC;
    this.accounts.OPERATOR.balanceUSDC += feeUSDC;

    session.active = false;
    if (lot) {
      lot.occupied = Math.max(0, lot.occupied - 1);
      lot.activeDriversCount = Math.max(0, lot.activeDriversCount - 1);
    }

    const txHash = this.generateTxHash();
    const ledgerSequence = 582915 + Math.floor(Math.random() * 100);

    const receipt = {
      txHash,
      driver: driverAddress,
      lotId: Number(lotId),
      lotName: session.lotName,
      operator: lot ? lot.operator : DEMO_ACCOUNTS.OPERATOR.address,
      startTime: new Date(session.startTimeSec * 1000).toISOString(),
      endTime: new Date(nowSec * 1000).toISOString(),
      durationSeconds: elapsedSeconds,
      durationMinutes,
      ratePerMinute: session.ratePerMinute,
      feeUSDC: feeUSDC.toFixed(4),
      feeStroops,
      ledgerSequence,
      verifiedOnStellar: true
    };

    this.receipts.unshift(receipt);

    this.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      fnName: "end_session",
      args: {
        driver: driverAddress,
        lot_id: Number(lotId)
      },
      resultFeeStroops: feeStroops,
      txHash,
      status: "SUCCESS",
      gasUsed: "224,900"
    });

    this.notify();
    return { success: true, receipt };
  }

  /**
   * Soroban function: `set_operator_rate_hint(env, operator, lot_id, new_rate)`
   */
  async setOperatorRateHint(operatorAddress, lotId, newRateUSDC) {
    const lot = this.parkingLots.find(l => l.id === Number(lotId));
    if (!lot) throw new Error("Lot not found");

    const newRateStroops = Math.round(Number(newRateUSDC) * 10000000);
    lot.ratePerMinute = newRateStroops;
    lot.rateFormatted = Number(newRateUSDC).toFixed(2);

    const txHash = this.generateTxHash();

    this.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      fnName: "set_operator_rate_hint",
      args: {
        operator: operatorAddress,
        lot_id: Number(lotId),
        new_rate: newRateStroops
      },
      txHash,
      status: "SUCCESS",
      gasUsed: "115,400"
    });

    this.notify();
    return { success: true, txHash };
  }

  /**
   * Faucet helper to top up driver USDC
   */
  faucetDriverUSDC(amount = 25) {
    this.accounts.DRIVER.balanceUSDC += amount;
    this.notify();
  }

  generateTxHash() {
    const chars = "0123456789abcdef";
    let hash = "";
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }
}

export const stellarState = new StateStore();
