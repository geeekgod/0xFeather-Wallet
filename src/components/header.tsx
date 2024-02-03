import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import { UserAccountNav } from "./user-account-nav";

export const Header = async () => {
  const user = await getCurrentUser()
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Image src="/icon.png" width={50} height={50} alt="0xFeather" />
        <span className="sr-only">Lazy Learning</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {
          !user && (
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth/sign_in">
              Login
            </Link>
          )
        }
        <ModeToggle />
        {
          user && (
            <UserAccountNav user={user} />
          )
        }
      </nav>
    </header>
  );
}
