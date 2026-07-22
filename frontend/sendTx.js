import { Horizon, TransactionBuilder, Networks, Operation, Asset, Keypair, Memo } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

async function run() {
  const relayKp = Keypair.fromSecret('SBLNLV3HNBT7QJLDH2FIIAJT5VHG6SOH3JM6ZZS4EJPWU74WR657PFJX');
  const account = await server.loadAccount(relayKp.publicKey());
  
  const tx = new TransactionBuilder(account, {
    fee: '1000',
    networkPassphrase: Networks.TESTNET
  })
  .addOperation(
    Operation.payment({
      destination: 'GAANT3ETP7B3HRWVXV5UID6J6WX5GEZKDJA5SXT4FBJAYBL64HI4MBUM',
      asset: Asset.native(),
      amount: '0.1000000'
    })
  )
  .addMemo(Memo.text('ParkStream Stellar Session'))
  .setTimeout(180)
  .build();

  tx.sign(relayKp);
  const res = await server.submitTransaction(tx);
  console.log('--- STELLAR TESTNET TRANSACTION SUBMITTED ---');
  console.log('TX_HASH:', res.hash);
  console.log('LEDGER:', res.ledger);
  console.log('EXPLORER_URL:', `https://stellar.expert/explorer/testnet/tx/${res.hash}`);
  console.log('ACCOUNT_URL:', `https://stellar.expert/explorer/testnet/account/GAANT3ETP7B3HRWVXV5UID6J6WX5GEZKDJA5SXT4FBJAYBL64HI4MBUM`);
}

run().catch(console.error);
