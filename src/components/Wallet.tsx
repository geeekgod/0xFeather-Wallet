'use client'

import { useEffect, useState } from 'react';
import { createWallet } from '../lib/createWallet';
import { ethers, JsonRpcProvider } from 'ethers';
import { User } from '@prisma/client';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';


type UserType = Omit<User, 'password'>

const Wallet = (user: UserType) => {
  const provider = new JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_URL,
  );
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactionCount, setTransactionCount] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState<string | null>(null);
  const [recepientAddress, setRecepientAddress] = useState<string | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false);

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

    // Fetch realtime balance
    if (!wallet || !wallet.provider) return;
    wallet.provider.on('block', () => {
      fetchBalance();
    })


  }, [wallet]);


  const transfer = async () => {
    setError(null);
    if (!wallet) return;
    if (!wallet.provider) return;
    if (!wallet.address) return;
    if (!recepientAddress) {
      setError('Please enter a recepient address');
      return;
    };
    if (!transferAmount) {
      setError('Please enter a transfer amount');
      return;
    };

    if (isNaN(parseFloat(transferAmount))) {
      setError('Please enter a valid transfer amount');
      return;
    }
    try {
      const transaction = await wallet.sendTransaction({
        to: recepientAddress,
        value: ethers.parseEther(transferAmount),
      });

      await transaction.wait();
      fetchBalance();
      setSuccess("Transaction successful!")
      setTimeout(() => { setTransferModalOpen(false) }, 6000);
    }
    catch (error: any) {
      if (error.message.includes('network does not support ENS '))
        setError("Please Enter Correct Wallet Address!");
      else if (error.message.includes('insufficient funds'))
        setError("Please enter correct Amount!\n\r\nYour wallet doesn't have sufficient funds!")
      else
        setError("There was some error please try again later!")

      setTimeout(() => { setTransferModalOpen(false) }, 6000);
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
  }, [success]);

  return (
    <div>
      {
        error && (
          <p className="text-center fixed top-5 left-5 z-[1000] w-1/2 bg-red-700 py-4 mb-6 rounded">{error}</p>
        )
      }
      {
        success && (
          <p className="text-center fixed top-5 left-5 z-[1000] w-1/2 bg-green-700 py-4 mb-6 rounded">{success}</p>
        )
      }
      {wallet && (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <Jazzicon diameter={50} seed={jsNumberForAddress(wallet.address)} />
          {/* Wallet Informations */}
          <div className="grid gap-4 sm:gap-6">

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

          {/* Wallet Address */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center justify-center">
              <p className="text-xs uppercase tracking-wide text-gray-500 mr-3">
                {'Wallet Address: '}
              </p>
            </div>

            <div className="mt-1 flex items-center justify-center">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
                {`${wallet.address.slice(0, 8)}...${wallet.address.slice(-5)}`}
              </h3>
            </div>

            {/* Copy to clipboard button for wallet address */}
            <div className="ml-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(wallet.address);
                  setSuccess("Copied to clipboard!");
                }}
                className="inline-flex px-4 py-2 justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Copy!
              </button>
            </div>
          </div>

          {
            !transferModalOpen &&
            <button
              onClick={() => setTransferModalOpen(true)}
              className="mt-6 py-4 px-6 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Transfer ETH with 0xFeather
            </button>
          }

          {/* Transfer form  */}

          {
            transferModalOpen &&
            (
              <div tabIndex={1} className="fixed top-0 left-0 right-0 z-50 w-full p-4 flex justify-center items-center backdrop-blur-lg overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">

                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Send ETH with 0xFeather to anyone in the world!
                      </h3>
                      <button type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setTransferModalOpen(false)}
                      >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="mt-6 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                          <p className="text-xs uppercase tracking-wide text-gray-500 mr-2">
                            Transfer ETH to:
                          </p>
                        </div>

                        <div className="mt-1 flex items-center justify-center">
                          <input
                            required
                            onChange={(e) => setRecepientAddress(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                            placeholder="Recepient Address"
                          />
                        </div>

                      </div>

                      <div className="mt-6 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                          <p className="text-xs uppercase tracking-wide text-gray-500 mr-2">
                            Transfer Amount:
                          </p>
                        </div>

                        <div className="mt-1 flex items-center justify-center">
                          <input
                            required
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                            placeholder="Transfer Amount"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button
                        type="button"
                        onClick={transfer}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send ETH</button>
                      <button
                        onClick={() => setTransferModalOpen(false)}
                        type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
};

export default Wallet;
