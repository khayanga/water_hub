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

  const [partners, setPartners] = useState(() => {
    const storedPartners = localStorage.getItem("partners");
    return storedPartners ? JSON.parse(storedPartners) : [];
  });

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");
  const [editPartner, setEditPartner] = useState(null);

  useEffect(() => {
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

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

    const newPartner = {
      name: formData.name,
      email: formData.email,
      status: "Active",
      contact: formData.phone,
      date: new Date().toLocaleDateString(),
    };

    setPartners((prevPartners) => {
      const updatedPartners = [...prevPartners, newPartner];
      return updatedPartners;
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
    setPartners((prevPartners) => {
      const updatedPartners = prevPartners.filter(
        (partner, i) => i !== index
      );
      return updatedPartners;
    });
  };

  // const sortData = (key) => {
  //   let direction = "ascending";
  //   if (sortConfig.key === key && sortConfig.direction === "ascending") {
  //     direction = "descending";
  //   }

  //   const sortedPartners = [...partners].sort((a, b) => {
  //     if (a[key] < b[key]) {
  //       return direction === "ascending" ? -1 : 1;
  //     }
  //     if (a[key] > b[key]) {
  //       return direction === "ascending" ? 1 : -1;
  //     }
  //     return 0;
  //   });

  //   setSortConfig({ key, direction });
  //   setPartners(sortedPartners);
  // };

  const openDialog = (partner) => {
    setSelectedPartner(partner);
  };

  const closeDialog = () => {
    setSelectedPartner(null);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditPartner((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const openEditDialog = (partner) => {
    setEditPartner(partner);
  };

  const closeEditDialog = () => {
    setEditPartner(null);
  };

  const saveChanges = () => {
    setPartners((prevPartners) =>
      prevPartners.map((partner) =>
        partner.email === editPartner.email ? { ...editPartner, contact: editPartner.phone } : partner
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
            <h1 className="font-bold tracking-wider">Partner Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {partners.length}
            </Button>
          </div>
          <div>
            <Useravatar/>
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          Fill in the form below to register a partner.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Partner Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter partner's name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Partner Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Partner Phone</Label>
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
                Add Partner
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Partners List</h1>
        </div>

        <Card className="ml-4">
          <Table>
            <TableCaption>A list of all the partners.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => sortData("name")}>
                  <div className="flex items-center">
                    Partner Name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "name" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead>Partner Email</TableHead>
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
              {partners.map((partner, index) => (
                <TableRow key={index}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.status}</TableCell>
                  <TableCell>{partner.contact}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost">
                          <Ellipsis size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDialog(partner)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(partner)}>
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

      {/* View Partner Dialog */}
      {selectedPartner && (
        <Dialog open={selectedPartner !== null} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Partner Details</DialogTitle>
              <DialogClose onClick={closeDialog} />
            </DialogHeader>
            <DialogDescription>
              <p>Name: {selectedPartner.name}</p>
              <p>Email: {selectedPartner.email}</p>
              <p>Status: {selectedPartner.status}</p>
              <p>Contact: {selectedPartner.contact}</p>
              <p>Date: {selectedPartner.date}</p>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Partner Dialog */}
      {editPartner && (
        <Dialog open={editPartner !== null} onOpenChange={closeEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Partner Details</DialogTitle>
              <DialogClose onClick={closeEditDialog} />
            </DialogHeader>
            <DialogDescription>
              <form>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Partner Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={editPartner.name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Partner Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editPartner.email}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Partner Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={editPartner.phone}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Input
                      id="status"
                      type="text"
                      value={editPartner.status}
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
