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
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
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
  
          
          const devicesArray = data["0"].map(device => ({
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
  }, [token]);
  
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
    window.location.href = `/device/${device.serial}`;
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
          Fill in the form below to register a device.
        </p>

        <form className="w-full mt-5 pl-2" onSubmit={handleSubmit}>
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
            <TableCaption>Device List</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead >Serial No </TableHead>
              <TableHead >Taps </TableHead>
              <TableHead >Client Name</TableHead>
              <TableHead >Site Name</TableHead>
              <TableHead >Valve Type </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
            {devices.map((device, index) => (
            <TableRow key={index}>
              <TableCell>{device.serial}</TableCell>
              <TableCell>{device.taps}</TableCell>
              <TableCell>{device.client}</TableCell>
              <TableCell>{device.site}</TableCell>
              <TableCell>{device.valve}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openDialog(device)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(device)}
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

        {/* View Device Details Dialog */}
        {/* <Dialog open={selectedDevice !== null} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Device Details</DialogTitle>
            </DialogHeader>
            {selectedDevice && (
              <div className="p-2">
                <p><strong>Serial Number:</strong> {selectedDevice.serial}</p>
                <p><strong>No of Taps:</strong> {selectedDevice.taps}</p>
                <p><strong>Client Name:</strong> {selectedDevice.client}</p>
                <p><strong>Site Name:</strong> {selectedDevice.site}</p>
                <p><strong>Valve:</strong> {selectedDevice.valve}</p>
              </div>
            )}
          </DialogContent>
        </Dialog> */}

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
