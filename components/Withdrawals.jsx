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

const Withdrawals = () => {
    const token = getAccessToken();
     const [withdrawTransactions, setWithdrawTransactions] =useState([])
     const fetchWithdrawTransactions = async () => {
        try {
          const response = await fetch("https://api.waterhub.africa/api/v1/client/withdraw/history", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
          });
      
          const data = await response.json();
          if (data && data.data) {
            setWithdrawTransactions(data.data);
             
          } else {
            console.error("Unexpected response structure", data);
          }
        } catch (error) {
          console.error("Error fetching withdrwal transactions:", error);
        }
      };

      useEffect(() => {
        fetchWithdrawTransactions();
        }, []);
      
    
    
      const withdrawColumns = [
        {
          id: "index",
          header: "#",
          cell: (info) => info.row.index + 1,
        },
        {
          accessorKey: "transaction_reference",
          header: "Transaction Reference",
          cell: ({ row }) => <div>{row.original.transaction_reference}</div>,
        },
        {
          accessorKey: "site_name",
          header: "Site Name",
          cell: ({ row }) => <div>{row.original.site_name}</div>,
        },
        {
          accessorKey: "device_serial",
          header: "Device serial",
          cell: ({ row }) => <div>{row.original.device_serial}</div>,
        },
        
        {
          accessorKey: "requester",
          header: "Phone Number",
          cell: ({ row }) => <div>{row.original.requester}</div>,
        },
        {
          accessorKey: "bank_account",
          header: "Account Number",
          cell: ({ row }) => <div>{row.original.bank_account}</div>,
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
                className={status === "failed" ? "text-red-500" : "text-blue-500"}
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
    
      const withdrawTable = useReactTable({
        data: withdrawTransactions,
        columns: withdrawColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      });


  return (
    <div className="w-full mt-2">
            <Card >
                <Table>
                  <TableHeader>
                    {withdrawTable.getHeaderGroups().map((headerGroup) => (
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
                    {withdrawTable.getRowModel().rows.length ? (
                      withdrawTable.getRowModel().rows.map((row) => (
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
                        <TableCell colSpan={withdrawColumns.length} className="text-center">
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
                      onClick={() => withdrawTable.previousPage()}
                      disabled={!withdrawTable.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => withdrawTable.nextPage()}
                      disabled={!withdrawTable.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
    </div>
  )
}

export default Withdrawals