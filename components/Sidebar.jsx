"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Package2 } from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import from next/navigation
import { navItems } from '@/data';

const Sidebar = () => {
  const pathname = usePathname(); // Get current path

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        
        
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.href; // Check if link is active
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href || '#'}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors 
                      ${isActive ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:text-foreground'} 
                      md:h-8 md:w-8`}
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
                          <Link href={link.href} className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;

