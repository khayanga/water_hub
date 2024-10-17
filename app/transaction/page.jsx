
"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Useravatar from "@/components/Useravatar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { getAccessToken } from "@/components/utils/auth";

const page = () => {
  const [transactions, setTransactions] = useState([]);
  const [tagTransactions, setTagTransactions] = useState([]);
  const [date, setDate] = useState(null); 

  const token = getAccessToken();

  useEffect(() => {
    fetchTransactions();
    fetchTagTransactions();
  }, []);

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

  const fetchTagTransactions = async () => {
    try {
      const response = await fetch("https://api.waterhub.africa/api/v1/client/transactions/tag", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      if (data && data.tag_pay_transactions) {
        setTagTransactions(data.tag_pay_transactions);
        
        
      } else {
        console.error("Unexpected response structure", data);
      }
    } catch (error) {
      console.error("Error fetching tag transactions:", error);
    }
  };

  const tagColumns = [
    {
      id: "index",
      header: "#",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "tag_id",
      header: "Tag ID",
      cell: ({ row }) => <div>{row.original.tag.tag_id}</div>,
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

  const tagTable = useReactTable({
    data: tagTransactions,
    columns: tagColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


 

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar />
      <div className="p-4 flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Useravatar />

        <main className=" px-4 py-2 sm:px-6 sm:py-0 ">
        <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Transaction Reports.</h1>
          </div>

          <p className="mt-1 tracking-wider text-sm font-light ">
          Get transaction reports down below
          </p>

          <Tabs defaultValue="mpesa" className="w-full">
          <TabsList className="flex flex-row gap-5 w-[370px] my-5">
            <TabsTrigger value="mpesa">Mpesa</TabsTrigger>
            <TabsTrigger value="tag">Tag</TabsTrigger>
            <TabsTrigger value="tag_pay">Tag Pay</TabsTrigger>
            <TabsTrigger value="tag_top_up">Tag Top Up</TabsTrigger>
          </TabsList>

          {/* Mpesa Transactions */}
          <TabsContent value="mpesa">
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
          </TabsContent>

          {/* Tag Transactions */}
          <TabsContent value="tag">
            <div className="w-full mt-2">
            <Card >
                <Table>
                  <TableHeader>
                    {tagTable.getHeaderGroups().map((headerGroup) => (
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
                    {tagTable.getRowModel().rows.length ? (
                      tagTable.getRowModel().rows.map((row) => (
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
                        <TableCell colSpan={tagColumns.length} className="text-center">
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
                      onClick={() => tagTable.previousPage()}
                      disabled={!tagTable.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => tagTable.nextPage()}
                      disabled={!tagTable.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tag_pay">
            <div className="w-full mt-2">
              <div className="ml-5 space-x-3 flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Button className="bg-blue-500 hover:bg-none px-6 py-1 text-white">Generate</Button>
              </div>
              <Card className=" mt-5">
                <Table>
                  <TableCaption>Tag Transactions</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag ID</TableHead>
                      <TableHead>Transaction Code</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tagTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.tag.tag_id}</TableCell>
                        <TableCell>{transaction.transaction_code}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell><Badge variant="outline">{transaction.status}</Badge></TableCell>
                        <TableCell>{transaction.created_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        </main>
        
        
        
      </div>
    </div>
  );
};

export default page;
