# ParkStream

Per-minute metered parking payments, settled instantly in USDC on Stellar.

## Problem

A commuter in Metro Manila circles the block near her office in Makati for
15 minutes, then pays an informal parking attendant in cash with no receipt —
and often gets shorted on change or quoted a higher "rate" than posted, with
no record to dispute it.

## Solution

The driver scans a QR code at the entry barrier to open a metered session on
Stellar. A Soroban smart contract tracks elapsed time on-chain and, the
instant she scans out at the exit, computes the fee and streams a USDC
micropayment directly to the lot operator's wallet. Stellar is essential
here: sub-cent fees and multi-second settlement are what make true
per-minute billing (instead of flat/hourly guesswork) economically viable —
something card rails can't do at this fee level.

## Timeline (hackathon build)

- Day 1: Contract design + `init` / `start_session` / `end_session`
- Day 2: Test suite, testnet deployment, QR-based mobile flow
- Day 3: Demo polish, receipt UI, pitch

## Stellar Features Used

- USDC transfers (SEP-41 token interface)
- Soroban smart contracts (session tracking + billing logic)
- Trustlines (driver must hold a USDC trustline to pay)

## Vision and Purpose

Give small, informal parking operators a way to collect fair, metered,
disputable-by-design payments without handling cash or hiring collectors —
while giving drivers a receipt and a rate they can trust every time they park.

## Prerequisites

- Rust (stable toolchain) with the `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- Soroban CLI v21+:
  ```bash
  cargo install --locked soroban-cli
  ```

## Build

```bash
soroban contract build
```

## Test

```bash
cargo test
```

## Deploy to Testnet

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/parkstream.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

## Sample CLI Invocation (MVP flow)

```bash
# One-time: register the USDC token contract and operator for lot #1
soroban contract invoke \
  --id <CONTRACT_ID> --source <ADMIN_KEY> --network testnet \
  -- init \
  --token <USDC_CONTRACT_ID> \
  --lot_id 1 \
  --operator <OPERATOR_ADDRESS>

# Driver scans entry QR -> opens session at 0.1 USDC/minute (7 decimals)
soroban contract invoke \
  --id <CONTRACT_ID> --source <DRIVER_KEY> --network testnet \
  -- start_session \
  --driver <DRIVER_ADDRESS> \
  --lot_id 1 \
  --rate_per_minute 1000000

# Driver scans exit QR -> pays for elapsed time, returns fee charged
soroban contract invoke \
  --id <CONTRACT_ID> --source <DRIVER_KEY> --network testnet \
  -- end_session \
  --driver <DRIVER_ADDRESS> \
  --lot_id 1
```

LINK 
https://stellar.expert/explorer/testnet/tx/0d3e7a13bfc783fa22ff178b7168eefb081c0a6cff796d9bbd60049c7544cc40
https://lab.stellar.org/r/testnet/contract/CC54GXK5TCO54O4HTS3H7KCBKZH6XV733SDERTPVBHOHW3ZJRQO7D325

## License

MIT



