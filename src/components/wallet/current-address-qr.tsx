import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useToast } from "../ui/use-toast";

type CurrentAddressQRProps = {
  address: string;
};

const CurrentAddressQR = ({ address }: CurrentAddressQRProps) => {
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Receive</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Receive ETH</DialogTitle>
          <DialogDescription>
            Use the following QR Code or Your Wallet Address to receive ETH.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <Image
            alt={"QR Code for your address"}
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${address}`}
            width={250}
            height={250}
          />
        </div>
        <DialogFooter>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast({
                  description: "Your Wallet Address is copied to clipboard!",
                });
              }}
            >
              Copy Address
            </Button>
            {/* Download Image */}
            {/* <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${address}`;
                link.download = "wallet-qr.png";
                link.click();
              }}
            >
              Download QR
            </Button> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CurrentAddressQR;
