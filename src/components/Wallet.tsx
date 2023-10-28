'use client'

import { useEffect, useState } from 'react';
import { createWallet } from '../lib/createWallet';
import { ethers, JsonRpcProvider } from 'ethers';
import { User } from '@prisma/client';

type UserType = Omit<User, 'password'>

const Wallet = (user: UserType) => {
  const provider = new JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_URL,
  );
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactionCount, setTransactionCount] = useState<string | null>(null);

  useEffect(() => {

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
    handleCreateWallet();
  }, []);

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

  const fetchBalance = async () => {
    if (!wallet) return;
    if (!wallet.provider) return;
    if (!wallet.address) return;

    const balance = await wallet.provider.getBalance(wallet.address);
    const transactionCount = await wallet.provider.getTransactionCount(wallet.address);

    const etherString = ethers.formatEther(balance);
    setBalance(etherString);

    setTransactionCount(transactionCount.toString());
  }

  useEffect(() => {
    if (!wallet) return;

    if (!wallet.provider) {
      const newWallet = wallet.connect(provider);
      setWallet(newWallet);
    };
    fetchBalance();
  }, [wallet]);

  return (
    <div>
      {
        error && (
          <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
        )
      }
      {wallet && (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">

            {/* Balance */}
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-800">
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-center">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Total Balance
                  </p>
                </div>

                <div className="mt-1 flex items-center justify-center">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200">
                    {
                      balance ?
                        `${balance} ETH` :
                        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                          <span className="sr-only">Loading...</span>
                        </div>
                    }
                  </h3>
                </div>
              </div>
            </div>

            {/* Total ETH Transactions */}
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-800">
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-center">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Transactions
                  </p>
                </div>

                <div className="mt-1 flex items-center justify-center">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200">
                    {
                      transactionCount ?
                        transactionCount :
                        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                          <span className="sr-only">Loading...</span>
                        </div>
                    }
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
