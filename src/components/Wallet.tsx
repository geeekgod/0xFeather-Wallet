'use client'

import { useState } from 'react';
import { createWallet } from '../lib/createWallet';
import { ethers } from 'ethers';


const Wallet = () => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);

  const handleCreateWallet = async () => {
    const walletData = await createWallet();
    const newWallet = new ethers.Wallet(walletData.privateKey);
    setWallet(newWallet);
  };

  return (
    <div>
      <button onClick={handleCreateWallet}>Create Ethereum Wallet</button>
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
