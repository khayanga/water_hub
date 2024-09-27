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

    const [transactions, setTransactions] = useState([]);
  
  const token = getAccessToken();
  
  const fetchTransactions = async () => {
    try {
      const response = await fetch("https://api.waterhub.africa/api/v1/client/transactions/mpesa?limit=4", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      
      const data = await response.json();
      if (data && data.device_transactions) {
        setTransactions(data.device_transactions);
      } else {
        console.error("Unexpected response structure", data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    // {
    //   accessorKey: "mobile_no",
    //   header: "Mpesa No",
    //   cell: ({ row }) => <div>{row.original.mobile_no}</div>,
    // },
    {
      accessorKey: "transaction_code",
      header: "Transaction Code",
      cell: ({ row }) => <div>{row.original.transaction_code}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant="outline"
            className={status === "Fail" ? "text-red-500" : "text-blue-500"}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div>{row.original.amount}</div>,
    },
  ];

  const table = useReactTable({
    data: transactions.slice(0, 4),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
    <div className="">
          <Link href="/transaction" className="flex flex-row items-center">
          <Button className="ml-auto gap-1 mb-2 bg-blue-500 px-6 py-2 flex flex-row items-center text-white">
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
                    No transactions found.
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