'use client'

import { User } from "@prisma/client"
import { signOut } from "next-auth/react"
import Link from "next/link";
import { useState } from "react";

type UserType = Omit<User, 'password'>

export default function Navbar(user: UserType) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userSignOut = () => {
    signOut({ callbackUrl: '/' })
  };

  return (
    <header className="flex justify-start flex-nowrap z-50 w-full bg-violet-900 border-b border-white/[.5] text-sm py-3 sm:py-0">
      <nav className="relative max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between">
          <Link className="flex-none text-xl font-semibold text-white" href="/" aria-label="Brand">BhangarEth</Link>
        </div>
        <div id="navbar-collapse-with-animation" className="hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block">
          <div className="flex flex-row gap-y-4  items-center justify-end gap-x-5 mt-0 pl-7">
            <button
              onClick={userSignOut}
              className="flex items-center gap-x-2 font-medium text-white/[.8] hover:text-white sm:border-l sm:border-white/[.3] sm:my-6 sm:pl-6">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
