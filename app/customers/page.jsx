"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowDownUp, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";
import { getAccessToken } from "@/components/utils/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const Page = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    extraFields: [],
  });

  const [availableFields, setAvailableFields] = useState([
    "Email",
    "Age group",
    "Id Number",
    "Gender",
  ]);
  const [selectedField, setSelectedField] = useState("");
  const [customers, setCustomers] = useState([]);
  const [formError, setFormError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);

  const token = getAccessToken();

  const {toast} = useToast();

 
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
      id: "index",
      header: "#",
      cell: (info) => info.row.index + 1,
    },
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
                Edit
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
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  


  const handleDelete = async (customerId, index) => {
    try {
      const response = await fetch(
        `https://api.waterhub.africa/api/v1/client/customer/delete/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.ok) {
      //  console.log("Customer deleted successfully")
      toast({
        variant: "destructive",
        description: "Customer has been deleted.",
      });
        setCustomers((prevCustomers) =>
          prevCustomers.filter((_, i) => i !== index)
        );
      } else {
        
        const data = await response.json();
        console.error("Error deleting customer:", data.message);
        setFormError(data.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("An error occurred while deleting the customer.");
    }
  };
 
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const addExtraField = (fieldName) => {
    if (
      !fieldName.trim() ||
      formData.extraFields.some((field) => field.name === fieldName.trim())
    )
      return;

    setFormData((prev) => ({
      ...prev,
      extraFields: [...prev.extraFields, { name: fieldName.trim(), value: "" }],
    }));
  };

  
  const handleExtraFieldChange = (index, value) => {
    setFormData((prev) => {
      const updatedFields = [...prev.extraFields];
      updatedFields[index].value = value;
      return { ...prev, extraFields: updatedFields };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedData = {
      name: formData.name,
      phone: formData.phone,
      ...Object.fromEntries(formData.extraFields.map((field) => [field.name, field.value])),
    };
  
    try {
      const response = await fetch("https://api.waterhub.africa/api/v1/client/customer/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const addedCustomer = data.data; 
      
        setCustomers((prevCustomers) => [addedCustomer, ...prevCustomers]);

        toast({
          title: "Customer added successfully!",
          description: `Customer ${formData.name} was added.`,
        });

        setFormData({ name: "", phone: "", extraFields: [] });
  
        
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "An error occurred.", variant: "destructive" });
    }
  };
  
  

  
  const openDialog = (customer) => {
        setSelectedCustomer(customer);
      };
    
      const closeDialog = () => {
        setSelectedCustomer(null);
      };
    
      const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditCustomer((prev) => ({
          ...prev,
          [id]: value,
        }));
        
      };
    
      
     
      const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editCustomer) return;
      
        try {
          const response = await fetch(
            `https://api.waterhub.africa/api/v1/client/customer/update/${editCustomer.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: editCustomer.name,
                phone: editCustomer.phone,
              }),
            }
          );
      
          if (response.ok) {
            const updatedCustomer = await response.json();
            
            
            setCustomers((prevCustomers) =>
              prevCustomers.map((customer) =>
                customer.id === editCustomer.id ? { ...customer, ...editCustomer } : customer
              )
            );
            toast({
              description: "Customer has been edited successfully.",
            });
            console.log("Customer updated successfully");
            closeEditDialog();
          } else {
            const data = await response.json();
            setFormError(data.message || "Failed to update customer");
          }
        } catch (error) {
          console.error("Error:", error);
          setFormError("An error occurred while updating the customer.");
        }
      };
       
    
      const openEditDialog = (customer) => {
        setEditCustomer(customer);
      };
    
      const closeEditDialog = () => {
        setEditCustomer(null);
      };
 
  
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <Sidebar />

      <div className="p-4 flex flex-col sm:gap-4 sm:py-4 sm:pl-14 ">
            <Useravatar />
        <main className=" px-4 py-2 sm:px-6 sm:py-0 ">
          <div className="flex flex-row items-center gap-6">
              <h1 className="font-bold tracking-wider">Customers Management</h1>
              <Button className="bg-blue-500 px-6 py-1 text-white">
                {customers.length} 
              </Button>
            </div>
        

        <p className="mt-2 tracking-wider text-sm font-light ">
          Fill in the form below to register a customer.
        </p>

       <form onSubmit={handleSubmit} className=" mt-5">
       
        <Card className="w-full md:max-w-5xl">
        

          {/* Input to Add New Fields */}
         
          <CardContent>
          <div className="flex flex-wrap items-center gap-8 py-2">
            <div className="space-y-1">
                    <Label htmlFor="name">Customer Name</Label>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                    
          </div>
          <div className="space-y-1">
              <Label htmlFor="phone">Customer Phone</Label>
              <Input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />

            </div>

             {/* Dynamic Extra Fields */}
            
            {formData.extraFields.map((field, index) => (
              <div key={index} className="space-y-1">
                <Label htmlFor={field.name}>{field.name}</Label>

                {field.name === "Gender" ? (
                  <Select
                    value={field.value}
                    onValueChange={(value) => handleExtraFieldChange(index, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : field.name === "Age group" ? (
                  <Select
                    value={field.value}
                    onValueChange={(value) => handleExtraFieldChange(index, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<20">&lt;20</SelectItem>
                      <SelectItem value="<30">&lt;30</SelectItem>
                      <SelectItem value="<40">&lt;40</SelectItem>
                      <SelectItem value="<50">&lt;50</SelectItem>
                      <SelectItem value="<60">&lt;60</SelectItem>
                      <SelectItem value="<70">&lt;70</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    placeholder={field.name}
                    value={field.value}
                    onChange={(e) => handleExtraFieldChange(index, e.target.value)}
                  />
                )}
              </div>
            ))}


            <div className="flex items-center space-x-2 md:space-x-4 mt-5   justify-start">
          
            <Select
                value={selectedField}
                onValueChange={(value) => setSelectedField(value)} 
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
            </Select>
            <Button
                type="button"
                className="bg-blue-500 text-white px-4 py-2"
                onClick={() => {
                  addExtraField(selectedField);
                  setSelectedField("");
                }}
              >
                Add Field
            </Button>

            
              
            </div>
        


          </div>

          </CardContent>

          <CardFooter>
              <Button type="submit" className="bg-blue-500 text-white">
                Submit
              </Button>
            </CardFooter>
          
            
      

        </Card>
       
      
     
     
      </form>


        

        <div className="flex flex-row items-center justify-between gap-6  mt-8">
          <h1 className="font-bold tracking-wide mb-2">Customers List</h1>
        </div>

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
                  No customers found.
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

         {/* Viewing details modal */}
          {selectedCustomer && (
          <Dialog open={!!selectedCustomer} onOpenChange={closeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCustomer.name}</DialogTitle>
                <DialogDescription>
                  Here are the details of {selectedCustomer.name}.
                </DialogDescription>
              </DialogHeader>
              <div>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Date Added:</strong> {selectedCustomer.created_at}</p>
               </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Editing details modal */}
        {editCustomer && (
          <Dialog open={!!editCustomer} onOpenChange={closeEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit}>
              <div className="space-y-4 p-2">
                <div className="space-y-1">
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={editCustomer?.name || ""}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={editCustomer?.phone || ""}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <Button
                 onClick={handleEditSubmit}
                 className="mt-4 bg-blue-500 text-white"
               >
                 Save Changes
               </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        </main>

        

      </div>
    </div>
  );
};

export default Page;


