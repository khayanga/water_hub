"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Package2 } from 'lucide-react';

import Link from 'next/link';

import { navItems } from '@/data';

const Sidebar = () => {
  

  return (

    <aside className='fixed inset-y-0 left-0 z-10  w-14 flex-col border-r bg-background sm:flex px-2 '>
      <nav className='flex flex-col items-center gap-4 px-2 sm:py-5 '>
      <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center bg-blue-500  gap-2 rounded-full  text-lg font-semibold text-white md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            
      </Link>
      <TooltipProvider>
      {navItems.map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <Link
              href={item.href || '#'} // Use `href` if available, otherwise '#'
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.name}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col space-y-1" side="right">
            {item.links ? (
              <ul className="space-y-1">
                {item.links.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="block px-4 py-2 hover:bg-blue-500 hover:text-foreground rounded">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span>{item.name}</span> // Display the name if no links array
            )}
          </TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
      </nav>

    </aside>
  );
};

export default Sidebar;
