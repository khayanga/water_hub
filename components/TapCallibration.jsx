import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter } from "./ui/card";
import { getAccessToken } from "./utils/auth";
import { useToast } from "@/hooks/use-toast";

const TapCalibration = ({ deviceId, valveType }) => {
  const { toast } = useToast();
  const [tapCalibration, setTapCalibration] = useState({
    tap_unit_pulse_1: "",
    tap_unit_volume_1: "",
    tap_unit_pulse_2: "",
    tap_unit_volume_2: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTapCalibration((prevCalibration) => ({
      ...prevCalibration,
      [id]: value,
    }));
  };

  const handleSubmitCalibration = async (tapNumber, e) => {
    e.preventDefault();

    if (!valveType) {
      toast({ title: "Error", description: "Valve type not provided." });
      return;
    }

    const token = getAccessToken();
    const endpoint =
      valveType === "solenoid"
        ? `https://api.waterhub.africa/api/v1/client/device/solenoid/callibration/${deviceId}`
        : `https://api.waterhub.africa/api/v1/client/device/mbv/callibration/${deviceId}`;

    const payload =
      tapNumber === 1
        ? {
            tap_unit_pulse_1: Number(tapCalibration.tap_unit_pulse_1) || 0,
            tap_unit_volume_1: Number(tapCalibration.tap_unit_volume_1) || 0,
          }
        : {
            tap_unit_pulse_2: Number(tapCalibration.tap_unit_pulse_2) || 0,
            tap_unit_volume_2: Number(tapCalibration.tap_unit_volume_2) || 0,
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: `Tap ${tapNumber} calibration updated successfully!`,
        });
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: `Failed to update Tap ${tapNumber} calibration.`,
        });
        console.error("API Error:", result);
      }
    } catch (error) {
      console.error(`Error updating Tap ${tapNumber} calibration:`, error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-16 w-full mx-auto">
      {[1, 2].map((tapNumber) => (
        <form key={tapNumber} onSubmit={(e) => handleSubmitCalibration(tapNumber, e)}>
          <Card className="md:w-[500px]">
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor={`tap_unit_pulse_${tapNumber}`}>
                    Tap No {tapNumber} - Unit Pulse/Liter
                  </Label>
                  <Input
                    id={`tap_unit_pulse_${tapNumber}`}
                    type="number"
                    placeholder="Enter unit pulse"
                    value={tapCalibration[`tap_unit_pulse_${tapNumber}`]}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`tap_unit_volume_${tapNumber}`}>
                    Tap No {tapNumber} - Unit Volume in Liters
                  </Label>
                  <Input
                    id={`tap_unit_volume_${tapNumber}`}
                    type="number"
                    placeholder="Enter unit volume"
                    value={tapCalibration[`tap_unit_volume_${tapNumber}`]}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-blue-500 text-white">
                Update Tap {tapNumber}
              </Button>
            </CardFooter>
          </Card>
        </form>
      ))}
    </div>
  );
};

export default TapCalibration;
