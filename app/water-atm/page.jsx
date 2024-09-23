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

const Page = () => {
  const [formData, setFormData] = useState({
    serial: "",
    taps: "",
    client: "",
    site: "",
    status: "",
    version: "",
    valve: "",
  });

  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedDevice, setSelectedDevice] = useState(null);
 
  const [formError, setFormError] = useState("");
  const [editDevice, setEditDevice] = useState(null);
  const token = getAccessToken();


  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/device/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
            },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setTotalPages(data.total_pages);
  
          
          const devicesArray = data["0"].map(device => ({
            id:device.id,
            serial: device.device_serial,
            taps: device.no_of_tap,
            client: device.user.client,
            site: device.site.site_name,
            valve: device.valve_type,
          }));
  
          setDevices(devicesArray);
        } else {
          console.error("Error response:", response);
          setFormError("Failed to fetch devices");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        setFormError("An error occurred while fetching devices.");
      }
    };
  
    fetchDevices();
  }, [token, currentPage]);


  const columns = [
    {
      id: "index",
      header: "#",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "serial",
      header: "Device Serial",
      cell: ({ row }) => <div>{row.original.serial}</div>,
    },
    {
      accessorKey: "taps",
      header: "Taps",
      cell: ({ row }) => <div>{row.original.taps}</div>,
    },
    {
      accessorKey: "client",
      header: "Client name",
      cell: ({ row }) => {
       
        return <div>{row.original.client}</div>;
      },
    },
    {
      accessorKey: "site",
      header: "Site Name",
      cell: ({ row }) => {
       
        return <div>{row.original.site}</div>;
      },
    },
    {
      accessorKey: "valve",
      header: "Valve Type",
      cell: ({ row }) => {
       
        return <div>{row.original.valve}</div>;
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
    data: devices,
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

    const newDevice = {
      serial: formData.serial,
      taps: formData.taps,
      client: formData.client,
      site: formData.site,
      status: formData.status,
      version: formData.version,
      valve: formData.valve,
      date: new Date().toLocaleDateString(),
    };

    setDevices((prevDevices) => [...prevDevices, newDevice]);

    // Reset the form data to its initial state
    setFormData({
      serial: "",
      taps: "",
      client: "",
      site: "",
      status: "",
      version: "",
      valve: "",
    });
    setFormError("");
  };

  const handleDelete = (index) => {
    setDevices((prevDevices) => prevDevices.filter((_, i) => i !== index));
  };

  const openDialog = (device) => {
    window.location.href = `/device/${device.id}`;
  };

  const closeDialog = () => {
    setSelectedDevice(null);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditDevice((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const openEditDialog = (device) => {
    setEditDevice(device);
  };

  const closeEditDialog = () => {
    setEditDevice(null);
  };

  const saveChanges = () => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.serial === editDevice.serial ? { ...editDevice } : device
      )
    );
    closeEditDialog();
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
            <h1 className="font-bold tracking-wider">Device Management</h1>
            <Button className="bg-blue-500 px-6 py-1 text-white">
              {devices.length}
            </Button>
          </div>
          <div>
            <Useravatar />
          </div>
        </div>

        <p className="mt-2 tracking-wider text-sm font-light pl-2 ">
          The table below hasa list of all the devices.
        </p>

        <form className="w-full mt-5 pl-2 hidden" onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-2">
              {formError && (
                <div className="text-red-500 mb-2">{formError}</div>
              )}
              <div className="flex flex-wrap gap-8  p-2">
                <div className="space-y-1">
                  <Label htmlFor="serial">Serial No * (User IMEI number for this field)</Label>
                  <Input
                    id="serial"
                    type="text"
                    placeholder="Enter serial no"
                    value={formData.serial}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="taps">Config Details* (Number of Taps)</Label>
                  <Input
                    id="taps"
                    type="text"
                    placeholder="Enter number of taps"
                    value={formData.taps}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="client">Clients Assigned</Label>
                  <Select
                    id="client"
                    value={formData.client}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, client: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client 1">Client 1</SelectItem>
                      <SelectItem value="Client 2">Client 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="site">Site Assigned</Label>
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
                      <SelectItem value="Site 1">Site 1</SelectItem>
                      <SelectItem value="Site 2">Site 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Device Status</Label>
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
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="version">Version</Label>
                  <Select
                    id="version"
                    value={formData.version}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, version: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.01,Beta II">1.01,Beta II</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="valve">Valve Type</Label>
                  <Select
                    id="valve"
                    value={formData.valve}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, valve: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select valve type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorized Valve">
                        Motorized Valve
                      </SelectItem>
                      <SelectItem value="Solenoid">Solenoid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="bg-blue-500 px-4 text-white">
                Add Device
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="flex flex-row items-center justify-between gap-6 pl-4 mt-8">
          <h1 className="font-bold tracking-wide mb-2">Water ATM Lists</h1>
        </div>

        <div className="w-full mt-2">
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

        

        {/* Edit Device Dialog */}
        <Dialog open={editDevice !== null} onOpenChange={closeEditDialog} >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Device</DialogTitle>
            </DialogHeader>
            {editDevice && (
              <form onSubmit={saveChanges} className="space-y-2 p-2 ">
                <div className="space-y-1">
                  <Label htmlFor="serial">Serial No</Label>
                  <Input
                    id="serial"
                    type="text"
                    value={editDevice.serial}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="taps">Config Details (Number of Taps)</Label>
                  <Input
                    id="taps"
                    type="text"
                    value={editDevice.taps}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="client">Clients Assigned</Label>
                  <Select
                    id="client"
                    value={editDevice.client}
                    onValueChange={(value) =>
                      setEditDevice((prev) => ({ ...prev, client: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client 1">Client 1</SelectItem>
                      <SelectItem value="Client 2">Client 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="site">Site Assigned</Label>
                  <Select
                    id="site"
                    value={editDevice.site}
                    onValueChange={(value) =>
                      setEditDevice((prev) => ({ ...prev, site: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Site 1">Site 1</SelectItem>
                      <SelectItem value="Site 2">Site 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="status">Device Status</Label>
                  <Select
                    id="status"
                    value={editDevice.status}
                    onValueChange={(value) =>
                      setEditDevice((prev) => ({ ...prev, status: value }))
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
                  <Label htmlFor="version">Version</Label>
                  <Select
                    id="version"
                    value={editDevice.version}
                    onValueChange={(value) =>
                      setEditDevice((prev) => ({ ...prev, version: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.01,Beta II">1.01,Beta II</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="valve">Valve Type</Label>
                  <Select
                    id="valve"
                    value={editDevice.valve}
                    onValueChange={(value) =>
                      setEditDevice((prev) => ({ ...prev, valve: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select valve type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorized Valve">
                        Motorized Valve
                      </SelectItem>
                      <SelectItem value="Manual Valve">Manual Valve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" className="bg-blue-500 text-white" onClick={saveChanges}>
                  Save Changes
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
