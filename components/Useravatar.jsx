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
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      const name = user.displayName || user.email.split('@')[0]; // Use displayName or email prefix as name
      setUserName(name);

      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
      setUserInitials(initials);
    }
  }, []);

  return (
    <div className=''>
      <div className="flex flex-row justify-between gap-4">
        <h2 className='font-bold text md:text-[22px] text-[20px] hidden md:block'>
          Welcome Back, {userName || 'Guest'}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              {/* Optionally add a user profile image */}
              <span className="sr-only">Toggle user menu</span>
              <AvatarFallback>{userInitials || 'GU'}</AvatarFallback>
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
      </div>
    </div>
  );
};

export default Useravatar;
