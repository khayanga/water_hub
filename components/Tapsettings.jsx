import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter } from "./ui/card";
import { getAccessToken } from "./utils/auth";
import { useToast } from "@/hooks/use-toast";

const TapSettings = ({ deviceId, valveType }) => {
    const {toast} = useToast();
        const [tapSettings, setTapSettings] = useState({
    tap_unit_price_1: "",
    min_tap_unit_price_1: "",
    tap_unit_price_2: "",
    min_tap_unit_price_2: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTapSettings((prevSettings) => ({
      ...prevSettings,
      [id]: value,
    }));
  };

  const handleSubmitTapSettings = async (tapNumber, e) => {
    e.preventDefault();

    if (!valveType) {
      toast({ title: "Error", description: "Valve type not provided." });
      return;
    }

    const token = getAccessToken();
    const endpoint =
      valveType === "solenoid"
        ? `https://api.waterhub.africa/api/v1/client/device/solenoid/tap-settings/${deviceId}`
        : `https://api.waterhub.africa/api/v1/client/device/mbv/settings/${deviceId}`;

    const payload =
      tapNumber === 1
        ? {
            tap_unit_price_1: Number(tapSettings.tap_unit_price_1) || 0,
            min_tap_unit_price_1: Number(tapSettings.min_tap_unit_price_1) || 0,
          }
        : {
            tap_unit_price_2: Number(tapSettings.tap_unit_price_2) || 0,
            min_tap_unit_price_2: Number(tapSettings.min_tap_unit_price_2) || 0,
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
          description: `Tap ${tapNumber} settings updated successfully!`,
        });
      } else {
        toast({ title: "Error", 
            variant:"destructive",
            description: `Failed to update Tap ${tapNumber} settings.` });
        console.error("API Error:", result);
      }
    } catch (error) {
      console.error(`Error updating Tap ${tapNumber} settings:`, error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-16 w-full mx-auto">
      {[1, 2].map((tapNumber) => (
        <form key={tapNumber} onSubmit={(e) => handleSubmitTapSettings(tapNumber, e)}>
          <Card className="md:w-[500px]">
            <CardContent className="space-y-2">
              <div className="flex flex-col gap-8 p-2">
                <div className="space-y-1">
                  <Label htmlFor={`tap_unit_price_${tapNumber}`}>Tap No {tapNumber} - Unit Price/Liter (KES)</Label>
                  <Input
                    id={`tap_unit_price_${tapNumber}`}
                    type="number"
                    placeholder="Enter unit price"
                    value={tapSettings[`tap_unit_price_${tapNumber}`]}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`min_tap_unit_price_${tapNumber}`}>Tap No {tapNumber} - Min Dispense Price (KES)</Label>
                  <Input
                    id={`min_tap_unit_price_${tapNumber}`}
                    type="number"
                    placeholder="Enter min dispense price"
                    value={tapSettings[`min_tap_unit_price_${tapNumber}`]}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-blue-500 text-white">
                Update Tap {tapNumber} Settings
              </Button>
            </CardFooter>
          </Card>
        </form>
      ))}
    </div>
  );
};

export default TapSettings;



