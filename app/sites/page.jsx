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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Useravatar from "@/components/Useravatar";
import Timezone from "@/components/Timezone";
import Country from "@/components/Country";
import { getAccessToken } from "@/components/utils/auth";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    location: "",
    timezone: "",
    image: null,
    status: "",
  });

  const [sites, setSites] = useState([]);

  const [selectedSite, setSelectedSite] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [formError, setFormError] = useState("");
  const [editSite, setEditSite] = useState(null);
  const token = getAccessToken();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/sites",
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
          console.log("Fetched data :", data);
  
         
          setSites(data[0] || []); 
        } else {
          console.error("Error response:", response);
          setFormError("Failed to fetch sites");
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
        setFormError("An error occurred while fetching sites.");
      }
    };
  
    fetchSites();
  }, [token]);
  
  
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

    const newSite = {
      name: formData.name,
      country: formData.country,
      location: formData.location,
      timezone: formData.timezone,
      status: formData.status,
      date: new Date().toLocaleDateString(),
    };

    setSites((prevSites) => {
      const updatedSites = [...prevSites, newSite];
      return updatedSites;
    });

    // Reset the form data to its initial state
    setFormData({
      name: "",
      country: "",
      location: "",
      timezone: "",
      image: null,
      status: "",
    });
    setFormError("");
  };

  const handleDelete = (index) => {
    setSites((prevSites) => {
      const updatedSites = prevSites.filter((site, i) => i !== index);
      return updatedSites;
    });
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedSites = [...sites].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setSites(sortedSites);
  };

  const openDialog = (site) => {
    setSelectedSite(site);
  };

  const closeDialog = () => {
    setSelectedSite(null);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditSite((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const openEditDialog = (site) => {
    setEditSite(site);
  };

  const closeEditDialog = () => {
    setEditSite(null);
  };

  const saveChanges = () => {
    setSites((prevSites) =>
      prevSites.map((site) =>
        site.name === editSite.name ? { ...editSite } : site
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
            <h1 className="font-bold tracking-wider">Site Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {sites.length}
            </Button>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          Fill in the form below to register a site.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Site Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter site name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Site Country</Label>
                  <Country
                    id="country"
                    value={formData.country}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="location">Site Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter site location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                 <Label htmlFor="status">Site Status</Label>
                 <Select
                   id="status"
                   value={formData.status}
                   onValueChange={(value) =>
                     setFormData((prev) => ({
                       ...prev,
                       status: value,
                     }))
                   }
                 >
                   <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Select status" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Active">Active</SelectItem>
                     <SelectItem value="Suspended">Suspended</SelectItem>
                   </SelectContent>
                 </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="timezone">Site Timezone</Label>
                  <Timezone
                    id="timezone"
                    value={formData.timezone}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        timezone: value,
                      }))
                    }
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
                Add Site
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Sites List</h1>
        </div>

        <Card className="ml-4">
          <Table>
            <TableCaption>A list of all the sites.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => sortData("site_name")}>
                  <div className="flex items-center">
                    Site Name
                    <ArrowDownUp
                      size={16}
                      className={`ml-2 ${sortConfig.key === "site_name" && sortConfig.direction === "ascending" ? "rotate-180" : ""}`}
                    />
                  </div>
                </TableHead>
                <TableHead>Site Country</TableHead>
                <TableHead>Site Location</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {sites.map((site, index) => (
                <TableRow key={index}>
                   <TableCell>{site.site_name || "No Name"}</TableCell>
                  <TableCell>{site.country || "No Country"}</TableCell>
                  <TableCell>{site.site_location || "No Location"}</TableCell>
                  <TableCell>{site.latitude || "No Latitude"}</TableCell>
                  <TableCell>{site.longitude || "No Longitude"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDialog(site)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openEditDialog(site)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
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

      {/* View Site Dialog */}
      <Dialog open={!!selectedSite} onOpenChange={closeDialog}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedSite?.site_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>Country: {selectedSite?.country}</div>
          <div>Location: {selectedSite?.site_location}</div>
          <div>Latitude: {selectedSite?.latitude}</div>
          <div>Longitude: {selectedSite?.longitude}</div>
        </div>
      </DialogContent>
    </Dialog>


      {/* Edit Site Dialog */}
      <Dialog open={!!editSite} onOpenChange={closeEditDialog}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                type="text"
                value={editSite?.name || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <Country
                    id="country"
                    value={editSite?.country || ""}
                    onChange={(value) =>
                      setEditSite((prev) => ({
                        ...prev,
                        country: value,
                      }))
                    }
                  />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={editSite?.location || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="timezone">Timezone</Label>
              <Timezone
                    id="timezone"
                    value={editSite?.timezone.toUpperCase() || ""}
                    onChange={(value) =>
                      setEditSite((prev) => ({
                        ...prev,
                        timezone: value,
                      }))
                    }
                  />
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                type="text"
                value={editSite?.status || ""}
                onChange={handleEditChange}
              />
            </div>
          </div>
          <Button onClick={saveChanges} className="bg-blue-500 text-white mt-4">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
