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

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [admins, setAdmins] = useState(() => {
    const storedAdmins = localStorage.getItem("admins");
    return storedAdmins ? JSON.parse(storedAdmins) : [];
  });

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");
  const [editAdmin, setEditAdmin] = useState(null);

  useEffect(() => {
    localStorage.setItem("admins", JSON.stringify(admins));
  }, [admins]);

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

    const newAdmin = {
      name: formData.name,
      email: formData.email,
      status: "Active",
      contact: formData.phone,
      date: new Date().toLocaleDateString(),
    };

    setAdmins((prevAdmins) => {
      const updatedAdmins = [...prevAdmins, newAdmin];
      return updatedAdmins;
    });

    // Reset the form data to its initial state
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
    setAdmins((prevAdmins) => {
      const updatedAdmins = prevAdmins.filter(
        (admin, i) => i !== index
      );
      return updatedAdmins;
    });
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedAdmins = [...admins].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setAdmins(sortedAdmins);
  };

  const openDialog = (admin) => {
    setSelectedAdmin(admin);
  };

  const closeDialog = () => {
    setSelectedAdmin(null);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditAdmin((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const openEditDialog = (admin) => {
    setEditAdmin(admin);
  };

  const closeEditDialog = () => {
    setEditAdmin(null);
  };

  const saveChanges = () => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.email === editAdmin.email ? { ...editAdmin, contact: editAdmin.phone } : admin
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
            <h1 className="font-bold tracking-wider">Admin Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {admins.length}
            </Button>
          </div>
          <div>
            <Useravatar/>
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          Fill in the form below to register an admin.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Admin Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter admin's name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Admin Phone</Label>
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
                Add Admin
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Admins List</h1>
        </div>

        <Card className="ml-4">
          <Table>
            <TableCaption>A list of all the admins.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => sortData("name")}>
                  <div className="flex items-center">
                    Admin Name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead>Admin Email</TableHead>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin, index) => (
                <TableRow key={index}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.status}</TableCell>
                  <TableCell>{admin.contact}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost">
                          <Ellipsis size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDialog(admin)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(admin)}>
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
      </div>

      {/* View Admin Dialog */}
      {selectedAdmin && (
        <Dialog open={selectedAdmin !== null} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Admin Details</DialogTitle>
              <DialogClose onClick={closeDialog} />
            </DialogHeader>
            <DialogDescription>
              <p>Name: {selectedAdmin.name}</p>
              <p>Email: {selectedAdmin.email}</p>
              <p>Status: {selectedAdmin.status}</p>
              <p>Contact: {selectedAdmin.contact}</p>
              <p>Date: {selectedAdmin.date}</p>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Admin Dialog */}
      {editAdmin && (
        <Dialog open={editAdmin !== null} onOpenChange={closeEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Admin Details</DialogTitle>
              <DialogClose onClick={closeEditDialog} />
            </DialogHeader>
            <DialogDescription>
              <form>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Admin Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={editAdmin.name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editAdmin.email}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Admin Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={editAdmin.phone}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      type="text"
                      value={editAdmin.status}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
              </form>
            </DialogDescription>
            <div className="flex justify-end mt-4">
              <Button
                onClick={saveChanges}
                className="bg-blue-500 text-white"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Page;
