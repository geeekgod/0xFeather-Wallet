"use client";

import { useEffect, useState } from "react";
import { createWallet } from "../lib/createWallet";
import { ethers, JsonRpcProvider } from "ethers";
import { User } from "@prisma/client";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "./ui/use-toast";
import { TransferDialog } from "./wallet/transfer-dialog";
import CurrentAddressQR from "./wallet/current-address-qr";
import QRCodeReader from "./wallet/qr-code-reader";

type UserType = Omit<User, "password">;

const Wallet = (user: UserType) => {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
  const [] = useLocalStorage("wallets", []);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactionCount, setTransactionCount] = useState<string | null>(null);
  const [transferAmount, setTransferAmount] = useState<string | null>(null);
  const [recepientAddress, setRecepientAddress] = useState<string | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState<boolean>(false);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [isQRReaderOpen, setIsQRReaderOpen] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    const saveWallet = async (wallet: ethers.Wallet) => {
      const res = await fetch("/api/wallet", {
        method: "POST",
        body: JSON.stringify({
          ethereumAddress: wallet.address,
          ethereumPrivKey: wallet.privateKey,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: user.id.toString(),
        },
      });

      if (!res.ok) {
        toast({
          description: (await res.json()).message,
          variant: "destructive",
        });
        return;
      }
    };

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
    const res = await fetch("/api/wallet", {
      method: "POST",
      body: JSON.stringify({
        ethereumAddress: wallet.address,
        ethereumPrivKey: wallet.privateKey,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user.id.toString(),
      },
    });

    if (!res.ok) {
      toast({
        description: (await res.json()).message,
        variant: "destructive",
      });
      return;
    }
  };

  const fetchTransactions = async () => {
    const res = await fetch("/api/wallet/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.id.toString(),
      },
    });

    const response = await res.json();

    console.log("Transactions: ", response);
  };

  const fetchBalance = async () => {
    if (!wallet) return;
    if (!wallet.provider) return;
    if (!wallet.address) return;

    const balance = await wallet.provider.getBalance(wallet.address);
    const transactionCount = await wallet.provider.getTransactionCount(
      wallet.address
    );

    const etherString = ethers.formatEther(balance);
    setBalance(etherString);

    setTransactionCount(transactionCount.toString());
  };

  useEffect(() => {
    if (!wallet) return;

    if (!wallet.provider) {
      const newWallet = wallet.connect(provider);
      setWallet(newWallet);
    }
    fetchBalance();

    // Fetch realtime balance
    if (!wallet || !wallet.provider) return;
    wallet.provider.on("block", () => {
      fetchBalance();
    });
  }, [wallet]);

  useEffect(() => {
    const transactionInterval = setInterval(() => {
      fetchTransactions();
    }, 15000);

    return () => {
      if (!transactionInterval) return;
      clearInterval(transactionInterval);
    };
  }, [wallet, fetchTransactions]);

  const transfer = async () => {
    if (!wallet) return;
    if (!wallet.provider) return;
    if (!wallet.address) return;
    if (!recepientAddress) {
      return toast({
        description: "Please enter a recipient address",
        variant: "destructive",
      });
    }
    if (!transferAmount) {
      return toast({
        description: "Please enter a transfer amount",
        variant: "destructive",
      });
    }

    if (isNaN(parseFloat(transferAmount))) {
      return toast({
        description: "Please enter a valid transfer amount",
        variant: "destructive",
      });
    }
    try {
      setIsTransferring(true);
      const transaction = await wallet.sendTransaction({
        to: recepientAddress,
        value: ethers.parseEther(transferAmount),
      });

      await transaction.wait();
      fetchBalance();
      setRecepientAddress(null);
      setTransferAmount(null);
      setTimeout(() => {
        setTransferDialogOpen(false);
      }, 500);
      return toast({
        description: "Transaction successful!",
      });
    } catch (error: any) {
      if (error.message.includes("network does not support ENS "))
        return toast({
          description: "Please Enter Correct Wallet Address!",
          variant: "destructive",
        });
      else if (error.message.includes("insufficient funds"))
        return toast({
          title: "Please enter correct Amount!",
          description: "Your wallet doesn't have sufficient funds!",
          variant: "destructive",
        });
      else
        return toast({
          description: "There was some error please try again later!",
          variant: "destructive",
        });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div>
      {wallet && (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <Jazzicon diameter={50} seed={jsNumberForAddress(wallet.address)} />
          {/* Wallet Informations */}
          <div className="my-2 grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Balance</CardTitle>
                <CardDescription>Your total ETH Balance</CardDescription>
              </CardHeader>
              <CardContent>
                {balance ? (
                  <p className="text-xl sm:text-2xl font-medium">
                    {balance} ETH
                  </p>
                ) : (
                  <div
                    className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total ETH Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Total ETH Transactions you initiated
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactionCount ? (
                  <p className="text-xl sm:text-2xl font-medium">
                    {transactionCount}
                  </p>
                ) : (
                  <div
                    className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Wallet Address */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center justify-center">
              <p className="text-xs uppercase tracking-wide text-gray-500 mr-3">
                {"Wallet Address: "}
              </p>
            </div>

            <div className="mt-1 flex items-center justify-center">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200">
                {`${wallet.address.slice(0, 8)}...${wallet.address.slice(-5)}`}
              </h3>
            </div>

            {/* Copy to clipboard button for wallet address */}
            <div className="ml-4">
              <CurrentAddressQR address={wallet.address} />
            </div>
          </div>

          {/* Transfer Form */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <TransferDialog
              transferDialogOpen={transferDialogOpen}
              setTransferDialogOpen={setTransferDialogOpen}
              recepientAddress={recepientAddress}
              setRecepientAddress={setRecepientAddress}
              transferAmount={transferAmount}
              setTransferAmount={setTransferAmount}
              transfer={transfer}
              isTransferring={isTransferring}
            />
            <QRCodeReader
              isQRReaderOpen={isQRReaderOpen}
              setRecepientAddress={setRecepientAddress}
              setIsQRReaderOpen={setIsQRReaderOpen}
              setTransferDialogOpen={setTransferDialogOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
