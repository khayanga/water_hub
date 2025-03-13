'use client '
import React, { useEffect, useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getAccessToken } from './utils/auth';


const Mpesa = () => {
    const [transactions, setTransactions] = useState([]);
    const token = getAccessToken();
    
    const fetchTransactions = async () => {
        try {
          const response = await fetch("https://api.waterhub.africa/api/v1/client/transactions/mpesa", {
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
        {
          id: "index",
          header: "#",
          cell: (info) => info.row.index + 1,
        },
        {
          accessorKey: "mobile_no",
          header: "Mpesa No",
          cell: ({ row }) => <div>{row.original.mobile_no}</div>,
        },
        {
          accessorKey: "transaction_code",
          header: "Transaction Code",
          cell: ({ row }) => <div>{row.original.transaction_code}</div>,
        },
        {
          accessorKey: "amount",
          header: "Amount",
          cell: ({ row }) => <div>{row.original.amount}</div>,
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
          accessorKey: "created_at",
          header: "Created at",
          cell: ({ row }) => <div>{row.original.created_at}</div>,
        },
      ];
    
      const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      });
  return (
     <div className="w-full mt-2">
                <Card >
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
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-end space-x-2 py-4 mx-4">
                  
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                    </div>
        
                </Card>
    </div>
  )
}

export default Mpesa