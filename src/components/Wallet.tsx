'use client'

import { useState } from 'react';
import { createWallet } from '../lib/createWallet';
import { ethers } from 'ethers';
import { User } from '@prisma/client';

type UserType = Omit<User, 'password'>

const Wallet = (user: UserType) => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const handleCreateWallet = async () => {

    // set wallet from user's private key and address
    if (user.ethereumPrivKey && user.ethereumAddress) {
      const newWallet = new ethers.Wallet(user.ethereumPrivKey);
      setWallet(newWallet);
      return;
    }

    const walletData = await createWallet();
    const newWallet = new ethers.Wallet(walletData.privateKey);
    setWallet(newWallet);
    saveWallet(newWallet);
  };

  // send address & private key to backend at /api/wallet/new using fetch
  const saveWallet = async (wallet: ethers.Wallet) => {
    const res = await fetch('/api/wallet', {
      method: 'POST',
      body: JSON.stringify({
        ethereumAddress: wallet.address,
        ethereumPrivKey: wallet.privateKey,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.id.toString(),
      },
    });

    if (!res.ok) {
      setError((await res.json()).message);
      return;
    }
  }


  return (
    <div>
      <button onClick={handleCreateWallet}>Create Ethereum Wallet</button>
      {error && <p>{error}</p>}
      {wallet && (
        <div>
          <h3>Wallet Details:</h3>
          <p>Address: {wallet.address}</p>
          <p>Private Key: {wallet.privateKey}</p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
