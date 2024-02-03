import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface TransferDialogProps {
  transferDialogOpen: boolean;
  setTransferDialogOpen: (open: boolean) => void;
  recepientAddress: string | null;
  setRecepientAddress: (address: string) => void;
  transferAmount: string | null;
  setTransferAmount: (amount: string) => void;
  transfer: () => void;
}

export const TransferDialog = ({
  transferDialogOpen,
  setTransferDialogOpen,
  recepientAddress,
  setRecepientAddress,
  transferAmount,
  setTransferAmount,
  transfer,
}: TransferDialogProps) => {
  return (
    <Dialog
      open={transferDialogOpen}
      onOpenChange={setTransferDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          className='my-4'
        >Transfer ETH</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
          <Button
            type="button"
            onClick={transfer}
          >Send ETH!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
}
