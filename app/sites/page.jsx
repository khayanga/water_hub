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
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const columns = [
    {
      id: "index",
      header: "#",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "site_name",
      header: "Site Name",
      cell: ({ row }) => <div>{row.original.site_name}</div>,
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => <div>{row.original.country}</div>,
    },
    {
      accessorKey: "site_location",
      header: "Site Location",
      cell: ({ row }) => {
       
        return <div>{row.original.site_location}</div>;
      },
    },
    {
      accessorKey: "latitude",
      header: "Latitude",
      cell: ({ row }) => {
       
        return <div>{row.original.latitude}</div>;
      },
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
      cell: ({ row }) => {
       
        return <div>{row.original.longitude}</div>;
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
    data: sites,
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
          The table below has a list of all the sites.
        </p>

        <form className="w-full mt-5 pl-2 hidden " onSubmit={handleSubmit}>
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
