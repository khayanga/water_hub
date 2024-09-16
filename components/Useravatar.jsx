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

const Useravatar = () => {
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');

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
      <div className="flex flex-row justify-between gap-4">
        <h2 className='font-bold  md:text-[22px] text-[20px] hidden md:block text-blue-500 dark:text-white'>
          Welcome Back, {userName || 'Guest'}
        </h2>
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
      </div>
    </div>
  );
};

export default Useravatar;
