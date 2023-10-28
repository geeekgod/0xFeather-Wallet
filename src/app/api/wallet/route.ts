
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ethereumPrivKey, ethereumAddress } = (await req.json()) as {
      ethereumPrivKey: string;
      ethereumAddress: string;
    };

    const authorization = req.headers.get('authorization');

    // Check if user already has ethereumPrivKey and ethereumAddress
    const user = await prisma.user.findUnique({
      where: { id: authorization as string },
      select: { ethereumPrivKey: true, ethereumAddress: true },
    });

    if (!user) return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "User Not Found",
      }),
      { status: 400 }
    );

    if (user.ethereumPrivKey && user.ethereumAddress) return new NextResponse(
      JSON.stringify({
        status: "error",
        message: 'User already has ethereumPrivKey and ethereumBalance'
      }),
      { status: 400 }
    );


    // Update user with ethereumPrivKey and ethereumAddress
    const updatedUser = await prisma.user.update({
      where: { id: authorization as string },
      data: { ethereumPrivKey, ethereumAddress },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        message: 'User updated successfully',
        user: updatedUser
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
