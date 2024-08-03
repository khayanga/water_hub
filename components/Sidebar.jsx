"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { navItems } from '@/data';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? '' : name);
  };

  return (
    <div className="h-full bg-gray-800 text-white w-64 space-y-6 px-4 py-4">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.key}>
              <button 
                className="w-full text-left py-2 px-4 rounded flex justify-between items-center hover:bg-gray-700"
                onClick={() => toggleDropdown(item.dropdownName)}
              >
                {item.title}
                {openDropdown === item.dropdownName ? (
                  <FaChevronUp className="w-2 h-2" />
                ) : (
                  <FaChevronDown className="w-2 h-2" />
                )}
              </button>
              {openDropdown === item.dropdownName && (
                <ul className="space-y-1 pl-4 mt-1">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="block py-2 px-4 rounded hover:bg-gray-700">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul> 
      </nav>
    </div>
  );
};

export default Sidebar;
