import Wallet from "@/components/Wallet";
import Link from "next/link";

export default function App() {
  return (
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
                    <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="max-w-3xl text-center mx-auto">
              <h4 className="block font-medium text-gray-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Explore your BhangaarEth wallet.
              </h4>
            </div>

            <div className="max-w-3xl text-center mx-auto">
              <p className="text-lg text-gray-400">BhangaarEth is just another new wallet in the Ethereum ecosystem. And it just works!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
