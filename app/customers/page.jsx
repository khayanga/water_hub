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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [customers, setCustomers] = useState([]);
  const [formError, setFormError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const token = getAccessToken();

 
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `https://api.waterhub.africa/api/v1/client/customer/list?per_page=${itemsPerPage}&page=${currentPage}`,
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
          setTotalPages(data.total_pages); // Assuming the API returns total pages
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
  }, [token, currentPage]);
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const newCustomer = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const response = await fetch(
        "https://api.waterhub.africa/api/v1/client/customer/store",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCustomer),
        }
      );

      const data = await response.json();
      
      console.log("List of customers", data);

      if (response.ok) {
        setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          image: null,
        });
        setFormError("");
      } else {
        setFormError(data.message || "Failed to add customer");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("An error occurred while adding the customer.");
    }
  };



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
       console.log("Customer deleted successfully")
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
  

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedCustomers = [...customers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setCustomers(sortedCustomers);
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
                email: editCustomer.email,
                phone: editCustomer.phone,
              }),
            }
          );
      
          if (response.ok) {
            const updatedCustomer = await response.json();
            setCustomers((prevCustomers) =>
              prevCustomers.map((customer) =>
                customer.id === updatedCustomer.id ? updatedCustomer : customer
              )
            );

            console.log("Customer updated succesfully")
            closeEditDialog();
          } else {
            const data = await response.json();
            setFormError(data.message || "Failed to update customer");
          }
        } catch (error) {
          setFormError("An error occurred while updating the customer.");
        }
      };
      
    
      const openEditDialog = (customer) => {
        setEditCustomer(customer);
      };
    
      const closeEditDialog = () => {
        setEditCustomer(null);
      };

      const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    
  
  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Customers Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {customers.length} 
            </Button>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2">
          Fill in the form below to register a customer.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && <div className="text-red-500 mb-2">{formError}</div>}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter client's name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Customer Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Customer Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(+254...)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="image">Upload Image (optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-blue-500 text-white">
                Add customer
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Customers List</h1>
        </div>

        <Card className="ml-4">
          <Table>
            <TableCaption>A list of all the customers.</TableCaption>
            <TableHeader>
              <TableRow>
              <TableHead>#</TableHead>
                <TableHead onClick={() => sortData("name")}>
                  <div className="flex items-center">
                    Customer Name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${
                        sortConfig.key === "name" &&
                        sortConfig.direction === "ascending"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                   <TableCell>{index + 1}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.created_at}</TableCell>
                  <TableCell>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <Ellipsis className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger onClick={() => openDialog(customer)}>View</DialogTrigger>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger onClick={() => openEditDialog(customer)}>Edit</DialogTrigger>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(customer.id, index)}>Delete</DropdownMenuItem>
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="my-2 pr-4 ">
            <Pagination className="flex items-center justify-end ">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={editCustomer?.email || ""}
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

      </div>
    </div>
  );
};

export default Page;
