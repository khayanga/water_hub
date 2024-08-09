"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'


const page = () => {

  return (
    <div className='w-11/12 mx-auto '>
      <Sidebar />

      <div className='p-4 w-full '>

          <div className='flex flex-row justify-between  p-2 w-full '>
          <div className='flex flex-row  items-center gap-6'>
           <h1 className='font-bold tracking-wider'>Customers Management</h1>
           
           <Button className="bg-blue-500 px-6 py-1 text-white">
            2
           </Button>
           </div>
           <div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <span className="sr-only">Toggle user menu</span>
            <AvatarFallback>TY</AvatarFallback>
          </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/sign-in">
              <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
              
            </DropdownMenuContent>
          </DropdownMenu>
           {/* <Button className="bg-blue-500 px-6 py-2  text-white">
            Add customers 
           </Button> */}
           </div>


          </div>

          <p className='mt-2 tracking-wider text-sm font-light pl-2'>Fill in the form below to register a client</p>
           
        </div>
        
    </div>
  )
}

export default page
