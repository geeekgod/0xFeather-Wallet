import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface TransferDialogProps {
  transferDialogOpen: boolean;
  setTransferDialogOpen: (open: boolean) => void;
  recepientAddress: string | null;
  setRecepientAddress: (address: string) => void;
  transferAmount: string | null;
  setTransferAmount: (amount: string) => void;
  transfer: () => void;
  isTransferring: boolean;
}

export const TransferDialog = ({
  transferDialogOpen,
  setTransferDialogOpen,
  recepientAddress,
  setRecepientAddress,
  transferAmount,
  setTransferAmount,
  transfer,
  isTransferring,
}: TransferDialogProps) => {
  return (
    <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
      <DialogTrigger asChild>
        <Button className="my-4">Transfer ETH</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (isTransferring) e.preventDefault();
        }}
        closeButtonDisabled={isTransferring}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Transfer</DialogTitle>
          <DialogDescription>
            Send ETH with 0xFeather to anyone in the world!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient_address" className="text-right">
              Recipient Address
            </Label>
            <Input
              id="recipient_address"
              value={recepientAddress || ""}
              onChange={(e) => setRecepientAddress(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="transfer_amount" className="text-right">
              Amount
            </Label>
            <Input
              id="transfer_amount"
              value={transferAmount || ""}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isTransferring} type="button" onClick={transfer}>
            {isTransferring ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                {"Transferring"}
              </>
            ) : (
              "Send ETH!"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
