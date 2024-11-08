"use client";
import React, { useState, useEffect } from "react";
import { ArrowDownUp, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";
import { getAccessToken } from "@/components/utils/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

const Page = () => {
  const [formData, setFormData] = useState({
    serial: "",
    client: "",
    site: "",
    status: "",
  });

  const [tags, setTags] = useState([]);
  const [customers, setCustomers] = useState([]);
  const token = getAccessToken();
  const [selectedTag, setSelectedTag] = useState(null);
  const [formError, setFormError] = useState("");
  const [editTag, setEditTag] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/customer/list",
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



  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/tag/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === "Success") {
         
          const tagsData = data.data.flatMap((device) => device.tags);
          setTags(tagsData);
          setTotalPages(data.total_pages); 
          console.log("Fetched Tags:", tagsData); 
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [token]);

  const columns = [
    {
      id: "index",
      header: "#",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "tag_id",
      header: "Tag ID",
      cell: ({ row }) => <div>{row.original.tag_id}</div>,
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      cell: ({ row }) => <div>{row.original.customer.customer_name}</div>,
    },
    {
      accessorKey: "token_balance",
      header: "Token Balance",
      cell: ({ row }) => {
       
        return <div>{row.original.token_balance}</div>;
      },
    },
    {
      accessorKey: "device",
      header: "Device Serial",
      cell: ({ row }) => {
       
        return <div>{row.original.device}</div>;
      },
    },
    
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              
              <DropdownMenuItem onClick={() => openDialog(row.original)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditDialog(row.original)}>
                Allocate
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.index)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tags,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTag = {
      serial: formData.serial,
      client: formData.client,
      site: formData.site,
      status: formData.status,
      date: new Date().toLocaleDateString(),
    };

    setTags((prevTags) => [...prevTags, newTag]);

    
    setFormData({
      serial: "",
      client: "",
      site: "",
      status: "",
    });
    setFormError("");
  };
  
  const handleDelete = async (tagId, index) => {
    try {
      const response = await fetch(
        `https://api.waterhub.africa/api/v1/client/tag/revoke/${tagId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.ok) {
       console.log("Tag deleted successfully")
       setTags((prevTags) => prevTags.filter((_, i) => i !== index));
      } else {
        
        const data = await response.json();
        console.error("Error deleting tag:", data.message);
        
      }
    } catch (error) {
      console.error("Error:", error);
      
    }
  };
 

  
  const openDialog = (tag) => {
    window.location.href = `/tag/${tag.id}`;
  };

  const closeDialog = () => {
    setSelectedTag(null);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditTag((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const openEditDialog = (tag) => {
    setEditTag(tag);
  };

  const closeEditDialog = () => {
    setEditTag(null);
  };

  const saveChanges = async () => {
    if (!editTag) return;
  
    try {
      const response = await fetch(
        `https://api.waterhub.africa/api/v1/client/tag/allocate/customer/${editTag.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer: editTag.client,
          }),
        }
      );
  
      if (response.ok) {
        const { data } = await response.json();
  
        
        setTags((prevTags) =>
          prevTags.map((tag) =>
            tag.id === editTag.id
              ? {
                  ...tag,
                  tag_id: data.tag_id,
                  token_balance: data.token_balance,
                  client: data.customer.customer_name,
                  device: data.device,
                }
              : tag
          )
        );
  
        toast({
          description: "Tag has been allocated successfully.",
        });
        closeEditDialog();
      } else {
        console.error("Failed to allocate customer:", await response.json());
      }
    } catch (error) {
      console.error("Error updating customer allocation:", error);
    }
  };
  
 

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Sidebar />

      <div className="p-4 flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <Useravatar />

        <main className=" px-4 py-2 sm:px-6 sm:py-0 ">
        <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Tag Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {tags.length}
            </Button>
          </div>

          <p className="mt-2 tracking-wider text-sm font-light ">
          The table below shows a list of all registered tags.
        </p>

        <form className="w-full mt-5  hidden" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="serial">Tag Serial</Label>
                  <Input
                    id="serial"
                    type="text"
                    placeholder="Enter serial no"
                    value={formData.serial}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="client">Customer Assigned</Label>
                  <Select
                    id="client"
                    value={formData.client}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, client: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer 1">Customer 1</SelectItem>
                      <SelectItem value="Customer 2">Customer 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="site">Water ATM Assigned</Label>
                  <Select
                    id="site"
                    value={formData.site}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, site: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATM 1">ATM 1</SelectItem>
                      <SelectItem value="ATM 2">ATM 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Tag Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="bg-blue-500 px-4 text-white">
                Add Tag
              </Button>
            </CardFooter>
          </Card>
        </form>
        <div className="flex flex-row items-center justify-between gap-6 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Registered Tags</h1>
        </div>

        <div className="w-full mt-2">
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
                  No sites found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
         {/* Pagination Controls */}
         <div className="flex items-center justify-end space-x-2 py-4 mx-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
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

        

      {/* Edit Tag Dialog */}
      
      <Dialog open={Boolean(editTag)} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="client">Customer Assigned</Label>
            <Select
              id="client"
              value={editTag?.client?.id || ""}
              onValueChange={(customerId) => {
                const selectedCustomer = customers.find((customer) => customer.id === customerId);
                if (selectedCustomer) {
                  setEditTag((prev) => ({ ...prev, client: selectedCustomer }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent className="max-h-min">
                <ScrollArea className="h-72 rounded-md border">
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={saveChanges} className="mt-4 bg-blue-500 text-white">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>


        </main>
     
      </div>

      
    </div>
  );
};

export default Page;
