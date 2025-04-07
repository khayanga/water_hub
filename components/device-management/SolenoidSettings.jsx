import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SolenoidSettings = ({ deviceId, token, numTaps, toast }) => {
  const [tapSettings, setTapSettings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!deviceId || !token) return;

    const fetchSolenoidSettings = async () => {
      try {
        const response = await fetch(
          `https://api.waterhub.africa/api/v1/client/device/solenoid/settings/${deviceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (data.status === "Success") {
          const settingsMap = {};
          data.data.settings.forEach((tap) => {
            const tapNumber = tap.tap;
            settingsMap[`tap_unit_price_${tapNumber}`] = tap.price ?? 0;
            settingsMap[`min_tap_unit_price_${tapNumber}`] =
              tap.min_dispense_amount ?? 0;
          });
          setTapSettings(settingsMap);
        }
      } catch (error) {
        console.error("Error fetching tap settings:", error);
      }
    };

    fetchSolenoidSettings();
  }, [deviceId, token]);

  const handleInputChange = (e) => {
    setTapSettings({ ...tapSettings, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!deviceId) {
      toast({ title: "Error", description: "Device ID is missing." });
      return;
    }

    const endpoint = `https://api.waterhub.africa/api/v1/client/device/solenoid/tap-settings/${deviceId}`;
    const payload = {};

    for (let i = 1; i <= numTaps; i++) {
      const price = tapSettings[`tap_unit_price_${i}`];
      const min = tapSettings[`min_tap_unit_price_${i}`];

      if (price && min) {
        payload[`tap_unit_price_${i}`] = Number(price);
        payload[`min_tap_unit_price_${i}`] = Number(min);
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Tap settings updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description:
            result?.error?.message ||
            result?.message ||
            "Failed to update tap settings.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating tap settings.",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:max-w-2xl">
      <Card>
        <CardContent className="space-y-6 pt-4">
          {Array.from({ length: numTaps }).map((_, index) => {
            const tapNumber = index + 1;
            return (
              <div key={tapNumber} className="flex flex-col gap-2">
                <h3 className="text-gray-500 text-md">Tap No {tapNumber}</h3>
                <div className="space-y-1">
                  <Label htmlFor={`tap_unit_price_${tapNumber}`}>
                    {" "}
                    Unit Price/Liter (KES)
                  </Label>
                  <Input
                    id={`tap_unit_price_${tapNumber}`}
                    type="number"
                    placeholder="Enter unit price"
                    value={tapSettings[`tap_unit_price_${tapNumber}`] || 0}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`min_tap_unit_price_${tapNumber}`}>
                    Min Dispense Price (KES)
                  </Label>
                  <Input
                    id={`min_tap_unit_price_${tapNumber}`}
                    type="number"
                    placeholder="Enter min dispense price"
                    value={tapSettings[`min_tap_unit_price_${tapNumber}`] || 0}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="bg-blue-500 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Tap Settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SolenoidSettings;
