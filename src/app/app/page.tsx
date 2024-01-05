import Wallet from "@/components/Wallet";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";

const getSessionUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return {
    sessionUser: user,
    session: session,
  };
}

const getUserFromDb = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      ethereumAddress: true,
      ethereumBalance: true,
      ethereumPrivKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}

export default async function App() {

  const { sessionUser, session } = await getSessionUser();

  let user = null;
  if (sessionUser && sessionUser.email) {
    user = await getUserFromDb(sessionUser.email);
  }

  return (
    <>
      {
        sessionUser && user &&
        (
          <Navbar {...user} />
        )
      }
      <main className="flex h-screen w-screen flex-col items-center justify-between">
        <div className="bg-slate-900 w-full h-full">
          <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
              <div className="flex justify-center">
                <Link className="group inline-block bg-white/[.05] hover:bg-white/[.1] border border-white/[.05] p-1 pl-4 rounded-full shadow-md" href="mailto:rishabh@geeekgod.in">
                  <p className="mr-2 inline-block text-white text-sm">
                    Got any suggestions? <span className="font-semibold">
                      Get in touch
                    </span>
                  </p>
                  <span className="group-hover:bg-white/[.1] py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/[.075] font-semibold text-white text-sm">
                    <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </Link>
              </div>

              <div className="max-w-3xl text-center mx-auto">
                <h4 className="block font-medium text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                  Explore your 0xFeather wallet.
                </h4>
              </div>

              <div className="max-w-3xl text-center mx-auto">
                {sessionUser && user ? (
                  <>
                    <p className="text-lg text-gray-400">Welcome back, {user.email}!</p>
                    {/* Crypto Wallet */}
                    <Wallet {...user} />
                  </>
                ) : (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
