import { NextResponse } from "next/server";
import axios from "axios";

const NEXT_ALCHEMY_SEPOLIA_KEY = process.env.NEXT_ALCHEMY_SEPOLIA_KEY;

// sepolia api
const url = `https://eth-sepolia.g.alchemy.com/v2/${NEXT_ALCHEMY_SEPOLIA_KEY}`;

const fetchOutGoingTransactions = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    id: 0,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        fromAddress: address,
        category: ["external", "erc20", "erc721", "erc1155"],
      },
    ],
  });

  const res = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    console.error("result", res.data);
    throw new Error(res.data.message);
  }

  const { result } = await res.data;

  const { transfers } = result;

  return {
    outGoingTransfers: transfers,
  };
};

const fetchIncomingTransactions = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    id: 0,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        excludeZeroValue: true,
        toAddress: address,
        category: ["internal", "external", "erc20", "erc721", "erc1155"],
      },
    ],
  });

  const res = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    console.error("result", res.data);
    throw new Error(res.data.message);
  }

  const { result } = await res.data;

  const { transfers } = result;

  return {
    inComingTransfers: transfers,
  };
};

export async function POST(req: Request) {
  try {
    const { ethereumAddress } = (await req.json()) as {
      ethereumAddress: string;
    };

    if (!ethereumAddress) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Address not present!",
        }),
        { status: 400 }
      );
    }

    const { outGoingTransfers } = await fetchOutGoingTransactions(
      ethereumAddress
    );
    const { inComingTransfers } = await fetchIncomingTransactions(
      ethereumAddress
    );

    const transfers = {
      outGoingTransfers,
      inComingTransfers,
    };

    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: "User Transactions found successfully",
        transfers: transfers,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
