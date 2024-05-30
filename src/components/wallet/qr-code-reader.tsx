import React from "react";
// import { QrReader } from "react-qr-reader";
// @ts-ignore
import QrReader from "react-qr-scanner";
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

type CurrentAddressQRProps = {
  isQRReaderOpen: boolean;
  setRecepientAddress: (address: string) => void;
  setIsQRReaderOpen: (open: boolean) => void;
  setTransferDialogOpen: (open: boolean) => void;
};

const QRCodeReader = ({
  setRecepientAddress,
  setIsQRReaderOpen,
  isQRReaderOpen,
  setTransferDialogOpen,
}: CurrentAddressQRProps) => {
  return (
    <Dialog
      onOpenChange={(open) => {
        setIsQRReaderOpen(open);
      }}
      open={isQRReaderOpen}
    >
      <DialogTrigger asChild>
        <Button>Scan QR</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Send ETH with QR</DialogTitle>
          <DialogDescription>
            Scan the QR Code to get the recipient address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center w-full py-4">
          {isQRReaderOpen && (
            <QrReader
              onScan={(data: { text: string }) => {
                if (data && data.text && data.text.length > 0) {
                  setRecepientAddress(data.text);
                  setIsQRReaderOpen(false);
                  setTransferDialogOpen(true);
                }
              }}
              constraints={{
                audio: false,
                video: { facingMode: "environment" },
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeReader;
