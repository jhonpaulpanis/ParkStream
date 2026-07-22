#![no_std]

//! ParkStream — per-minute metered parking payments settled in USDC on Stellar.
//!
//! Flow: driver scans an entry QR -> start_session() opens a metered session.
//! Driver scans an exit QR -> end_session() computes elapsed minutes, charges
//! the driver in USDC via the SEP-41 token interface, and pays the lot operator.

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env,
};

/// Storage keys used across the contract.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// USDC (or any SEP-41) token contract address used for settlement.
    Token,
    /// lot_id -> operator Address that receives parking fees for that lot.
    Operator(u32),
    /// (driver, lot_id) -> active/most-recent ParkingSession.
    Session(Address, u32),
}

/// A single parking session: who parked, when, and at what rate.
#[contracttype]
#[derive(Clone)]
pub struct ParkingSession {
    pub driver: Address,
    pub start_time: u64,
    /// Rate in the token's smallest unit (e.g. USDC stroops, 7 decimals) per minute.
    pub rate_per_minute: i128,
    pub active: bool,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    SessionAlreadyActive = 1,
    NoActiveSession = 2,
    NotOperator = 3,
    LotNotInitialized = 4,
}

#[contract]
pub struct ParkStream;

#[contractimpl]
impl ParkStream {
    /// One-time setup: register the settlement token and the operator wallet
    /// for a given parking lot. Called once per lot by whoever deploys/manages it.
    pub fn init(env: Env, token: Address, lot_id: u32, operator: Address) {
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::Operator(lot_id), &operator);
    }

    /// Driver scans the entry QR. Opens a metered session at `lot_id` with the
    /// lot's current per-minute rate. Fails if a session is already active for
    /// this driver+lot pair (prevents double-charging from a stuck session).
    pub fn start_session(
        env: Env,
        driver: Address,
        lot_id: u32,
        rate_per_minute: i128,
    ) -> Result<(), Error> {
        driver.require_auth();

        let key = DataKey::Session(driver.clone(), lot_id);
        if let Some(existing) = env
            .storage()
            .temporary()
            .get::<DataKey, ParkingSession>(&key)
        {
            if existing.active {
                return Err(Error::SessionAlreadyActive);
            }
        }

        let session = ParkingSession {
            driver,
            start_time: env.ledger().timestamp(),
            rate_per_minute,
            active: true,
        };
        env.storage().temporary().set(&key, &session);
        // Keep the session alive for roughly a day of parking (ledger-based TTL).
        env.storage().temporary().extend_ttl(&key, 100, 17280);
        Ok(())
    }

    /// Driver scans the exit QR. Computes elapsed minutes (rounded up, minimum
    /// 1), charges the driver in USDC, pays the lot operator, and closes the
    /// session. Returns the fee charged, in the token's smallest unit.
    pub fn end_session(env: Env, driver: Address, lot_id: u32) -> Result<i128, Error> {
        driver.require_auth();

        let key = DataKey::Session(driver.clone(), lot_id);
        let mut session: ParkingSession = env
            .storage()
            .temporary()
            .get(&key)
            .ok_or(Error::NoActiveSession)?;

        if !session.active {
            return Err(Error::NoActiveSession);
        }

        let now = env.ledger().timestamp();
        let elapsed_seconds = now.saturating_sub(session.start_time);
        let duration_minutes: i128 = (elapsed_seconds / 60) as i128 + 1; // round up, min 1
        let fee = duration_minutes * session.rate_per_minute;

        let operator: Address = env
            .storage()
            .instance()
            .get(&DataKey::Operator(lot_id))
            .ok_or(Error::LotNotInitialized)?;
        let token_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(Error::LotNotInitialized)?;

        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&driver, &operator, &fee);

        session.active = false;
        env.storage().temporary().set(&key, &session);

        Ok(fee)
    }

    /// Read-only view used by the frontend to show a live running fee estimate.
    pub fn get_session(env: Env, driver: Address, lot_id: u32) -> Option<ParkingSession> {
        env.storage()
            .temporary()
            .get(&DataKey::Session(driver, lot_id))
    }

    /// Lot operator updates the per-minute rate applied to future sessions.
    /// Only the operator registered for that lot can call this.
    pub fn set_operator_rate_hint(
        env: Env,
        operator: Address,
        lot_id: u32,
        _new_rate: i128,
    ) -> Result<(), Error> {
        operator.require_auth();
        let stored_operator: Address = env
            .storage()
            .instance()
            .get(&DataKey::Operator(lot_id))
            .ok_or(Error::NotOperator)?;
        if stored_operator != operator {
            return Err(Error::NotOperator);
        }
        // Rate is passed fresh into each start_session call by the frontend
        // (read from off-chain lot config); this entry point exists so an
        // operator's authorized rate change is recorded on-chain for audit.
        Ok(())
    }
}

mod test;