import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

const NEXT_ALCHEMY_SEPOLIA_KEY = process.env.NEXT_ALCHEMY_SEPOLIA_KEY;

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("authorization");

    // Check if user already has ethereumPrivKey and ethereumAddress
    const user = await prisma.user.findUnique({
      where: { id: authorization as string },
      select: { ethereumPrivKey: true, ethereumAddress: true },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "User Not Found",
        }),
        { status: 400 }
      );
    }

    const data = JSON.stringify({
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          fromAddress: user.ethereumAddress,
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
        },
      ],
    });

    // sepolia api
    const url = `https://eth-sepolia.g.alchemy.com/v2/${NEXT_ALCHEMY_SEPOLIA_KEY}`;

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
