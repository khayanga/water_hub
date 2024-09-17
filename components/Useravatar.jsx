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
import Link from 'next/link';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const Useravatar = () => {
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const { setTheme } = useTheme();

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
    <div className=''>
      <div className="flex flex-row justify-between gap-4 items-center">
        <h2 className='font-bold  md:text-[22px] text-[20px] hidden md:block text-blue-500 dark:text-white'>
          Welcome Back, {userName || 'Guest'}
        </h2>


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

          <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
          </DropdownMenu>

         

        </div>

      </div>
    </div>
  );
};

export default Useravatar;
