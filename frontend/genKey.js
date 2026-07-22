import { Keypair } from '@stellar/stellar-sdk';

async function main() {
  const kp = Keypair.random();
  console.log("PUBLIC_KEY:", kp.publicKey());
  console.log("SECRET_KEY:", kp.secret());
  
  // Fund via Friendbot
  const res = await fetch(`https://friendbot.stellar.org/?addr=${kp.publicKey()}`);
  const data = await res.json();
  console.log("FRIENDBOT RESULT:", data.hash ? `Funded! Hash: ${data.hash}` : data);
}

main().catch(console.error);
