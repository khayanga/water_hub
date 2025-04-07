import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SolenoidCallibration = ({ deviceId, token, numTaps, toast }) => {
  const [tapCalibration, setTapCalibration] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!deviceId || !token) return;

    const fetchCalibrationSettings = async () => {
      setLoading(true);
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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "Success") {
          const calibrationMap = {};
          data.data.settings.forEach((tap) => {
            const tapNumber = tap.tap;
            calibrationMap[`tap_unit_pulse_${tapNumber}`] = tap.unit_pulse ?? 0;
            calibrationMap[`tap_unit_volume_${tapNumber}`] =
              tap.unit_volume ?? 0;
          });
          setTapCalibration(calibrationMap);
        }
      } catch (error) {
        console.error("Error fetching calibration settings:", error);
        setError("Failed to load calibration settings");
        toast({
          title: "Error",
          description: "Could not fetch calibration settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCalibrationSettings();
  }, [deviceId, token, toast]);

  const handleCalibrationChange = (e) => {
    setTapCalibration({ ...tapCalibration, [e.target.id]: e.target.value });
  };

  const handleSubmitCalibration = async (e) => {
    e.preventDefault();
    setError("");

    if (!deviceId) {
      toast({ title: "Error", description: "Device ID is missing." });
      return;
    }

    const endpoint = `https://api.waterhub.africa/api/v1/client/device/solenoid/callibration/${deviceId}`;

    const payload = {};
    for (let i = 1; i <= numTaps; i++) {
      payload[`tap_unit_pulse_${i}`] =
        Number(tapCalibration[`tap_unit_pulse_${i}`]) || 0;
      payload[`min_tap_unit_volume_${i}`] =
        Number(tapCalibration[`min_tap_unit_volume_${i}`]) || 0;
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
          description: "Tap calibration updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to update tap calibration.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating tap calibration.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmitCalibration}
      className="w-full md:max-w-2xl mt-5 pl-2"
    >
      <Card>
        <CardContent className="space-y-6 pt-4">
          {Array.from({ length: numTaps }).map((_, index) => {
            const tapNumber = index + 1;
            return (
              <div key={tapNumber} className="flex flex-col  gap-2 p-2">
                <h3 className="text-gray-500 text-md">Tap No {tapNumber}</h3>
                <div className="space-y-1">
                  <Label htmlFor={`tap_unit_pulse_${tapNumber}`}>
                    Unit Pulse/Liter
                  </Label>
                  <Input
                    placeholder="Enter unit pulse"
                    id={`tap_unit_pulse_${tapNumber}`}
                    type="number"
                    value={tapCalibration[`tap_unit_pulse_${tapNumber}`] || 0}
                    onChange={handleCalibrationChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`tap_unit_volume_${tapNumber}`}>
                    {" "}
                    Unit Volume in Litres
                  </Label>
                  <Input
                    placeholder="Enter unit volume"
                    id={`tap_unit_volume_${tapNumber}`}
                    type="number"
                    value={tapCalibration[`tap_unit_volume_${tapNumber}`] || 0}
                    onChange={handleCalibrationChange}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-blue-500 text-white">
            Update Tap Calibration
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SolenoidCallibration;
