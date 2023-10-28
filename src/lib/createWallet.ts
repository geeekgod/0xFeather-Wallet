import { ethers } from 'ethers';

export const createWallet = async () => {
  const randomWallet = ethers.Wallet.createRandom();
  const walletData = {
    privateKey: randomWallet.privateKey,
    address: randomWallet.address,
  };
  return walletData;
};
