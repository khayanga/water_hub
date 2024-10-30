"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import axios from "axios";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
import { getAccessToken } from './utils/auth';
import Link from 'next/link';
import { FiArrowUpRight } from "react-icons/fi";

import { useEffect, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "./ui/badge";

const DashboardTable = () => {

    const [customers, setCustomers] = useState([]);
  
  const token = getAccessToken();
  
  

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/customer/list?per_page=7",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setCustomers(data.data || []);
        } else {
          console.error("Error response:", response);
          setFormError("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setFormError("An error occurred while fetching customers.");
      }
    };

    fetchCustomers();
  }, [token]);


  const columns = [
    
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => <div>{row.original.phone}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Date Created",
      cell: ({ row }) => {
       
        return <div>{row.original.created_at}</div>;
      },
    },
    
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
    <div className="">
          <Link href="/customers" className="flex flex-row items-center">
          <Button className="ml-auto gap-1 mb-2 bg-blue-500 px-4 py-2 flex flex-row items-center text-white">
                View All
             <FiArrowUpRight className="h-4 w-4 ml-1" />
              
            </Button>
          </Link>

    </div>

    <Card>
            

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

      
        
    </Card>
    </>
  )
}

export default DashboardTable