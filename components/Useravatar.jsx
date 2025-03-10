"use client";

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  
  SheetTrigger,
} from "@/components/ui/sheet"

import Link from 'next/link';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AlignLeft } from 'lucide-react';
import { navItems } from '@/data';

const Useravatar = () => {
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const { theme, setTheme } = useTheme();
 

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      const name = user.name || user.email.split('@')[0]; // Get full name from user data
      setUserName(name);

      // Get initials from the full name
      const initial = name[0].toUpperCase();
      setUserInitial(initial);
    }
  }, []);


  // Logout functionality
  const handleLogout = async () => {
    const url = new URL("https://api.waterhub.africa/api/v1/client/logout");
    const accessToken = localStorage.getItem('accessToken');

    const headers = {
      "Authorization": `Bearer ${accessToken}`, 
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.removeItem('user');
        localStorage.removeItem('accessToken');

        console.log("User logged out successfully")

       
        router.push('/sign-in');
      } else {
        console.error('Failed to log out:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className=' sticky top-0 z-30 flex h-14 sm:justify-between items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6' >

      <div className="text-lg font-semibold sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <AlignLeft className="h-6 w-6 font-bold" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

      
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {navItems.map((item)=>
          <Link
          key={item.id}
          href={item.href}
          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">

            <item.icon className="h-5 w-5 " />
            <span  className="text-gray-800 dark:text-white">{item.name}</span>
          
          </Link>
          
          )}

        </nav>
      </SheetContent>
      </Sheet>

      </div>
      <div>
        <h2 className='font-bold  md:text-[22px] text-[20px] hidden md:block text-blue-500 dark:text-white'>
          Welcome Back, {userName || 'Guest'}
        </h2>

        </div>

      <div className="flex flex-row justify-between gap-4 items-center ml-auto">

        <div className=' flex flex-row gap-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar classname="bg-blue-500">
              {/* Optionally add a user profile image */}
              <span className="sr-only">Toggle user menu</span>
              <AvatarFallback >{userInitial || 'GU'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href="/account">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator />
            <Link href="/sign-in">
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
          </DropdownMenu>

         

          <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          ) : (
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

         

        </div>

      </div>
    </header>
  );
};

export default Useravatar;
