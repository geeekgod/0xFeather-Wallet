'use client'

import { User } from "@prisma/client"
import { signOut } from "next-auth/react"


type UserType = Omit<User, 'password'>

const LogOut = (user: UserType) => {
  return (
    <button onClick={() => {
      signOut({ callbackUrl: '/' })
    }} className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white py-3 px-6 dark:focus:ring-offset-gray-800">
      Log Out
    </button>
  )
}

export default LogOut
