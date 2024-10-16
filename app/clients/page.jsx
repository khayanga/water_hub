"use client"
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

const Page = () => {
  
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [clients, setClients] = useState(() => {
    const storedClients = localStorage.getItem("clients");
    return storedClients ? JSON.parse(storedClients) : [];
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");
  const [editClient, setEditClient] = useState(null);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const newClient = {
      name: formData.name,
      email: formData.email,
      status: "Active",
      contact: formData.phone,
      date: new Date().toLocaleDateString(),
    };

    setClients((prevClients) => {
      const updatedClients = [...prevClients, newClient];
      return updatedClients;
    });


    

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      image: null,
    });
    setFormError("");
  };

  const handleDelete = (index) => {
    setClients((prevClients) => {
      const updatedClients = prevClients.filter(
        (client, i) => i !== index
      );
      return updatedClients;
    });
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedClients = [...clients].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setClients(sortedClients);
  };

  const openDialog = (client) => {
    setSelectedClient(client);
  };

  const closeDialog = () => {
    setSelectedClient(null);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditClient((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const openEditDialog = (client) => {
    setEditClient(client);
  };

  const closeEditDialog = () => {
    setEditClient(null);
  };

  const saveChanges = () => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.email === editClient.email ? { ...editClient, contact: editClient.phone } : client
      )
    );
    closeEditDialog();
  };

  return (
    <div className="w-11/12 mx-auto">
      <Sidebar />

      <div className="p-4 w-full mx-auto">
        <div className="flex flex-row justify-between p-2 w-full">
          <div className="flex flex-row items-center gap-6">
            <h1 className="font-bold tracking-wider">Client Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {clients.length}
            </Button>
            
            
            
          </div>
          <div>
            <Useravatar/>
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          Fill in the form below to register a client.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter client's name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Client Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Client Phone</Label>
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
                Add client
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Clients List</h1>
        </div>

        <Card className="ml-4">
          <Table>
            <TableCaption>A list of all the clients.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => sortData("name")}>
                  <div className="flex items-center">
                    Client name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead>Client Email</TableHead>
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
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.status}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                  <TableCell>{client.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDialog(client)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(client)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(index)}
                          
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {selectedClient && (
          <Dialog open={true} onOpenChange={closeDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Client Details</DialogTitle>
                <DialogDescription>
                  <p>
                    <strong>Name:</strong> {selectedClient.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedClient.email}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedClient.contact}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedClient.date}
                  </p>
                </DialogDescription>
              </DialogHeader>
              {/* <DialogClose asChild>
                <Button className="mt-4">Close</Button>
              </DialogClose> */}
            </DialogContent>
          </Dialog>
        )}

        {editClient && (
          <Dialog open={true} onOpenChange={closeEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Client Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={editClient.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Client Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editClient.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Client Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editClient.phone}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={saveChanges} className="bg-blue-500 text-white">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Page;
