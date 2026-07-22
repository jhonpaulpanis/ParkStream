#![cfg(test)]

use crate::{ParkStream, ParkStreamClient};
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    Address, Env,
};

/// Deploys a Stellar Asset Contract to stand in for USDC in tests, and
/// returns (token_client, token_admin_client, token_address).
fn create_token_contract<'a>(
    env: &Env,
    admin: &Address,
) -> (
    soroban_sdk::token::Client<'a>,
    soroban_sdk::token::StellarAssetClient<'a>,
    Address,
) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let address = sac.address();
    (
        soroban_sdk::token::Client::new(env, &address),
        soroban_sdk::token::StellarAssetClient::new(env, &address),
        address,
    )
}

fn setup() -> (
    Env,
    ParkStreamClient<'static>,
    Address, // driver
    Address, // operator
    soroban_sdk::token::Client<'static>,
    soroban_sdk::token::StellarAssetClient<'static>,
) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let driver = Address::generate(&env);
    let operator = Address::generate(&env);

    let (token_client, token_admin, token_address) = create_token_contract(&env, &admin);
    // Fund the driver with plenty of test USDC.
    token_admin.mint(&driver, &1_000_000_000);

    let contract_id = env.register_contract(None, ParkStream);
    let client = ParkStreamClient::new(&env, &contract_id);

    let lot_id = 1u32;
    client.init(&token_address, &lot_id, &operator);

    (env, client, driver, operator, token_client, token_admin)
}

#[test]
fn test_happy_path_start_and_end_session() {
    let (env, client, driver, operator, token_client, _admin) = setup();
    let lot_id = 1u32;
    let rate_per_minute: i128 = 1_000_000; // e.g. 0.1 USDC per minute at 7 decimals

    client.start_session(&driver, &lot_id, &rate_per_minute);

    // Advance the ledger clock by 5 minutes to simulate parking duration.
    env.ledger().with_mut(|l| l.timestamp += 5 * 60);

    let fee = client.end_session(&driver, &lot_id);

    // 5 minutes elapsed -> exactly 5 * rate charged.
    assert_eq!(fee, 5 * rate_per_minute);
    assert_eq!(token_client.balance(&operator), 5 * rate_per_minute);
}

#[test]
fn test_edge_case_duplicate_active_session_rejected() {
    let (env, client, driver, _operator, _token_client, _admin) = setup();
    let lot_id = 1u32;
    let rate_per_minute: i128 = 1_000_000;

    client.start_session(&driver, &lot_id, &rate_per_minute);

    // Starting a second session for the same driver+lot while one is active
    // must fail rather than silently overwrite the running session.
    let result = client.try_start_session(&driver, &lot_id, &rate_per_minute);
    assert!(result.is_err());

    let _ = env; // env kept for parity with other tests / potential ledger advances
}

#[test]
fn test_state_verification_session_closed_after_end() {
    let (env, client, driver, _operator, _token_client, _admin) = setup();
    let lot_id = 1u32;
    let rate_per_minute: i128 = 500_000;

    client.start_session(&driver, &lot_id, &rate_per_minute);
    env.ledger().with_mut(|l| l.timestamp += 3 * 60);
    client.end_session(&driver, &lot_id);

    let session = client.get_session(&driver, &lot_id).unwrap();
    assert!(!session.active);
    assert_eq!(session.rate_per_minute, rate_per_minute);
}

#[test]
fn test_end_session_without_start_fails() {
    let (_env, client, driver, _operator, _token_client, _admin) = setup();
    let lot_id = 1u32;

    let result = client.try_end_session(&driver, &lot_id);
    assert!(result.is_err());
}

#[test]
fn test_minimum_one_minute_charged_for_short_stay() {
    let (env, client, driver, operator, token_client, _admin) = setup();
    let lot_id = 1u32;
    let rate_per_minute: i128 = 2_000_000;

    client.start_session(&driver, &lot_id, &rate_per_minute);
    // Exit almost immediately (10 seconds) — should still round up to 1 minute.
    env.ledger().with_mut(|l| l.timestamp += 10);

    let fee = client.end_session(&driver, &lot_id);
    assert_eq!(fee, rate_per_minute);
    assert_eq!(token_client.balance(&operator), rate_per_minute);
}