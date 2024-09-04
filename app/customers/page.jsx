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

  const token = getAccessToken();

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = getAccessToken();

      try {
        const response = await fetch("https://api.waterhub.africa/api/v1/client/customer/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCustomers(data.customers); // Assuming the data contains a 'customers' array
        } else {
          setFormError("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setFormError("An error occurred while fetching customers.");
      }
    };

    fetchCustomers();
  }, []);

  // const [customers, setCustomers] = useState(() => {
  //   const storedCustomers = localStorage.getItem("customers");
  //   return storedCustomers ? JSON.parse(storedCustomers) : [];
  // });

  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");
  // const [editCustomer, setEditCustomer] = useState(null);

  // useEffect(() => {
  //   localStorage.setItem("customers", JSON.stringify(customers));
  // }, [customers]);

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   if (formData.password !== formData.confirmPassword) {
  //     setFormError("Passwords do not match.");
  //     return;
  //   }

  //   const newCustomer = {
  //     name: formData.name,
  //     email: formData.email,
  //     status: "Active",
  //     contact: formData.phone,
  //     date: new Date().toLocaleDateString(),
  //   };

  //   setCustomers((prevCustomers) => {
  //     const updatedCustomers = [...prevCustomers, newCustomer];
  //     return updatedCustomers;
  //   });

  //   // Reset the form data to its initial state
  //   setFormData({
  //     name: "",
  //     email: "",
  //     phone: "",
  //     password: "",
  //     confirmPassword: "",
  //     image: null,
  //   });
  //   setFormError("");
  // };

  const handleDelete = (index) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = prevCustomers.filter(
        (customer, i) => i !== index
      );
      return updatedCustomers;
    });
  };

  // const sortData = (key) => {
  //   let direction = "ascending";
  //   if (sortConfig.key === key && sortConfig.direction === "ascending") {
  //     direction = "descending";
  //   }

  //   const sortedCustomers = [...customers].sort((a, b) => {
  //     if (a[key] < b[key]) {
  //       return direction === "ascending" ? -1 : 1;
  //     }
  //     if (a[key] > b[key]) {
  //       return direction === "ascending" ? 1 : -1;
  //     }
  //     return 0;
  //   });

  //   setSortConfig({ key, direction });
  //   setCustomers(sortedCustomers);
  // };

  // const openDialog = (customer) => {
  //   setSelectedCustomer(customer);
  // };

  // const closeDialog = () => {
  //   setSelectedCustomer(null);
  // };

  // const handleEditChange = (e) => {
  //   const { id, value } = e.target;
  //   setEditCustomer((prev) => ({
  //     ...prev,
  //     [id]: value,
  //   }));
  // };
  
  

  // const openEditDialog = (customer) => {
  //   setEditCustomer(customer);
  // };

  // const closeEditDialog = () => {
  //   setEditCustomer(null);
  // };

  // const saveChanges = () => {
  //   setCustomers((prevCustomers) =>
  //     prevCustomers.map((customer) =>
  //       customer.email === editCustomer.email ? { ...editCustomer, contact: editCustomer.phone } : customer
  //     )
  //   );
  //   closeEditDialog();
  // };
  
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
      const response = await fetch("https://api.waterhub.africa/api/v1/client/customer/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Use the retrieved token
        },
        body: JSON.stringify(newCustomer),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (response.ok) {
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        
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
  

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto ">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Customers Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {/* {customers.length} */}
            </Button>
          </div>
          <div>
            <Useravatar/>
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          Fill in the form below to register a customer.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
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
                <TableHead onClick={() => sortData("name")}>
                  <div className="flex items-center">
                    Customer name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead onClick={() => sortData("status")}>
                  <div className="flex items-center">
                    Status
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "status" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead onClick={() => sortData("contact")}>
                  <div className="flex items-center">
                    Contact
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "contact" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead onClick={() => sortData("date")}>
                  <div className="flex items-center">
                    Date
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "date" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell >{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>{customer.date}</TableCell>
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
                            <DialogTrigger onClick={() => openEditDialog(customer)}>Edit</DialogTrigger>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(index)}>Delete</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Dialog>
                            <DialogTrigger onClick={() => openDialog(customer)}>View</DialogTrigger>
                          </Dialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Viewing details modal */}
        {/* {selectedCustomer && (
          <Dialog open={!!selectedCustomer} onOpenChange={closeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCustomer.name}</DialogTitle>
                <DialogDescription>
                  Here are the details of {selectedCustomer.name}.
                </DialogDescription>
              </DialogHeader>
              <div>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Status:</strong> {selectedCustomer.status}</p>
                <p><strong>Contact:</strong> {selectedCustomer.contact}</p>
                <p><strong>Date Added:</strong> {selectedCustomer.date}</p>
              </div>
            </DialogContent>
          </Dialog>
        )} */}

        {/* Editing details modal */}
        {/* {editCustomer && (
          <Dialog open={!!editCustomer} onOpenChange={closeEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit {editCustomer.name}</DialogTitle>
              </DialogHeader>
              <form>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="editName">Customer Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter customer's name"
                      value={editCustomer.name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="editEmail">Customer Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@gmail.com"
                      value={editCustomer.email}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="editPhone">Customer Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(+254...)"
                      value={editCustomer.phone}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
              </form>
              <DialogClose asChild>
                <Button
                  onClick={saveChanges}
                  className="mt-4 bg-blue-500 text-white"
                >
                  Save Changes
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )} */}
      </div>
    </div>
  );
};

export default Page;
