import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { Transactions } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLinkIcon,
  ArrowTopRightIcon,
  ArrowBottomLeftIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

const TransactionCard = ({
  className,
  ...props
}: CardProps & {
  transaction: any;
  address: string | null;
}) => {
  const { transaction, address } = props;

  const checkTransactionType = (
    toAddress: string,
    fromAddress: string,
    currentAddress: string | null
  ) => {
    if (!currentAddress) return "Unknown";
    const normalizedToAddress = toAddress.toLowerCase();
    const normalizedFromAddress = fromAddress.toLowerCase();
    const normalizedCurrentAddress = currentAddress.toLowerCase();

    if (
      normalizedToAddress === normalizedCurrentAddress &&
      normalizedFromAddress === normalizedCurrentAddress
    )
      return "Self";
    if (normalizedToAddress === normalizedCurrentAddress) return "Received";
    if (normalizedFromAddress === normalizedCurrentAddress) return "Sent";
    return "Unknown";
  };

  const TransactionIcon = (type: string) => {
    switch (type) {
      case "Sent":
        return <ArrowTopRightIcon className="h-4 w-4" />;
      case "Received":
        return <ArrowBottomLeftIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardContent className="grid gap-4 py-2">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          {TransactionIcon(
            checkTransactionType(transaction.to, transaction.from, address)
          )}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.value} ETH
            </p>
            <p className="text-sm text-muted-foreground">
              {checkTransactionType(transaction.to, transaction.from, address)}
            </p>
            <p className="text-sm text-muted-foreground">
              From:{" "}
              {`${transaction.from.slice(0, 8)}...${transaction.from.slice(
                -5
              )}`}
            </p>
            <p className="text-sm text-muted-foreground">
              To:{" "}
              {`${transaction.to.slice(0, 8)}...${transaction.to.slice(-5)}`}
            </p>
          </div>
        </div>
        <div></div>
      </CardContent>
      <CardFooter className="pb-2">
        <Link
          target="_blank"
          rel="noreferrer"
          href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
        >
          <Button className="w-full">
            <ExternalLinkIcon className="mr-2 h-4 w-4" /> View On Etherscan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const TransactionSkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

interface TransactionListProps {
  transactions: Transactions;
  transactionListDialogOpen: boolean;
  setTransactionListDialogOpen: (open: boolean) => void;
  fetchTransactions: () => Promise<void>;
  transactionsLoading: boolean;
  ethereumAddress: string | null;
}

export const TransactionList = ({
  transactions,
  fetchTransactions,
  setTransactionListDialogOpen,
  transactionListDialogOpen,
  transactionsLoading,
  ethereumAddress,
}: TransactionListProps) => {
  useEffect(() => {
    if (!transactions.fetched && transactionListDialogOpen) {
      fetchTransactions();
    }
  }, [transactionListDialogOpen]);

  return (
    <Dialog
      open={transactionListDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            setTransactionListDialogOpen(open);
          }, 200);
        }
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Transactions</DialogTitle>
          <DialogDescription>List of Transactions</DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            "flex flex-col gap-4 py-4 max-h-[60vh]",
            transactionsLoading ? "" : "overflow-y-scroll"
          )}
        >
          {transactionsLoading ? (
            <>
              <TransactionSkeletonCard />
              <TransactionSkeletonCard />
            </>
          ) : (
            <>
              {transactions.inComingTransfers.map((transaction) => (
                <TransactionCard
                  address={ethereumAddress}
                  transaction={transaction}
                  key={transaction.uniqueId}
                />
              ))}
              {transactions.outGoingTransfers.map((transaction) => (
                <TransactionCard
                  address={ethereumAddress}
                  transaction={transaction}
                  key={transaction.uniqueId}
                />
              ))}
            </>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-center gap-4">
            {transactions.fetched && (
              <Button
                disabled={transactionsLoading}
                onClick={fetchTransactions}
              >
                {transactionsLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    {"Refreshing"}
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
