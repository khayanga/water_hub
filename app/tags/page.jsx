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

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Useravatar from "@/components/Useravatar";

const Page = () => {
  const [formData, setFormData] = useState({
    serial: "",
    client: "",
    site: "",
    status: "",
  });

  const [tags, setTags] = useState(() => {
    const storedTags = localStorage.getItem("tags");
    return storedTags ? JSON.parse(storedTags) : [];
  });

  const [selectedTag, setSelectedTag] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");
  const [editTag, setEditTag] = useState(null);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

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

    // Reset the form data to its initial state
    setFormData({
      serial: "",
      client: "",
      site: "",
      status: "",
    });
    setFormError("");
  };

  const handleDelete = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedTags = [...tags].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setTags(sortedTags);
  };

  const openDialog = (tag) => {
    setSelectedTag(tag);
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

  const saveChanges = () => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.serial === editTag.serial ? { ...editTag } : tag
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
            <h1 className="font-bold tracking-wider">Tag Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {tags.length}
            </Button>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          Fill in the form below to register a tag.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
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

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Registered Tags</h1>
        </div>

        <div className="w-full mt-2">
          <Card className="ml-4">
            <Table>
              <TableCaption>Tag List</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => sortData("serial")}
                  >
                    Serial No{" "}
                    <ArrowDownUp className="inline-block ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => sortData("client")}
                  >
                    Client{" "}
                    <ArrowDownUp className="inline-block ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => sortData("site")}
                  >
                    Site{" "}
                    <ArrowDownUp className="inline-block ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => sortData("status")}
                  >
                    Status{" "}
                    <ArrowDownUp className="inline-block ml-2 h-4 w-4" />
                  </TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag, index) => (
                  <TableRow key={index}>
                    <TableCell>{tag.serial}</TableCell>
                    <TableCell>{tag.client}</TableCell>
                    <TableCell>{tag.site}</TableCell>
                    <TableCell>{tag.status}</TableCell>
                    <TableCell>{tag.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Ellipsis className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32">
                          
                          <DropdownMenuItem
                            onClick={() => openDialog(tag)}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(tag)}
                          >
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
      </div>

      {/* View Tag Dialog */}
      <Dialog open={Boolean(selectedTag)} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>Serial: {selectedTag?.serial}</p>
            <p>Client: {selectedTag?.client}</p>
            <p>Site: {selectedTag?.site}</p>
            <p>Status: {selectedTag?.status}</p>
            <p>Date: {selectedTag?.date}</p>
          </div>
          
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={Boolean(editTag)} onOpenChange={closeEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="serial">Tag Serial</Label>
              <Input
                id="serial"
                type="text"
                value={editTag?.serial}
                onChange={handleEditChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="client">Customer Assigned</Label>
              <Select
                id="client"
                value={editTag?.client}
                onValueChange={(value) =>
                  setEditTag((prev) => ({ ...prev, client: value }))
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
                value={editTag?.site}
                onValueChange={(value) =>
                  setEditTag((prev) => ({ ...prev, site: value }))
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
                value={editTag?.status}
                onValueChange={(value) =>
                  setEditTag((prev) => ({ ...prev, status: value }))
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
          <Button onClick={saveChanges} className="mt-4 bg-blue-500 text-white">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
