import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useEffect, useState } from "react";

const MbvSettings = ({ deviceId, token, numTaps}) => {
  const [mbvData, setMbvData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.waterhub.africa/api/v1/client/device/mbv/settings/${deviceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        if (data.status === "Success") {
          const settings = data.data.reduce((acc, item) => {
            acc[item.option_key] = item.option_value;
            return acc;
          }, {});

          setMbvData(settings);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMbvChange = (e, tapNumber, key) => {
    setMbvData((prev) => ({
      ...prev,
      [`tap_unit_${key}_${tapNumber}`]: e.target.value,
    }));
  };

  const handleTapStateChange = (value, tapNumber) => {
    setMbvData((prev) => ({
      ...prev,
      [`tap_state_${tapNumber}`]: value,
    }));
  };

  const handleMbvSubmit = async (e) => {
    e.preventDefault();

    // Format data for API
    const payload = {};
    for (let i = 1; i <= numTaps; i++) {
      payload[`tap_unit_price_${i}`] = formData[`tap_unit_price_${i}`] || "";
      payload[`tap_unit_volume_${i}`] = formData[`tap_unit_volume_${i}`] || "";
      payload[`tap_unit_pulse_${i}`] = formData[`tap_unit_pulse_${i}`] || "";
    }

    try {
      const response = await fetch(
        `https://api.waterhub.africa/api/v1/client/device/mbv/settings/${deviceId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Tap settings updated successfully!");
      } else {
        alert(
          "Error updating tap settings: " + (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  return (
    <form onSubmit={handleMbvSubmit} className="w-full md:max-w-2xl mt-5 pl-2">
      <Card>
        <CardContent className="space-y-6 pt-4">
          {Array.from({ length: numTaps }).map((_, index) => {
            const tapNumber = index + 1;

            return (
              <div key={tapNumber} className="flex flex-col gap-3">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-gray-500 text-md">Tap No {tapNumber}</h3>
                  <div className="space-y-1">
                    <Label htmlFor={`tap_state_${tapNumber}`}>Tap state</Label>
                    <Select
                      onValueChange={(value) =>
                        handleTapStateChange(value, tapNumber)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue
                          placeholder={
                            mbvData[`tap_state_${tapNumber}`] || "Select state"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="On">On</SelectItem>
                        <SelectItem value="Off">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`unit_price_${tapNumber}`}>
                    Unit Price * (KES)
                  </Label>
                  <Input
                    placeholder="Enter unit price"
                    id={`unit_price_${tapNumber}`}
                    type="number"
                    value={mbvData[`tap_unit_price_${tapNumber}`] || ""}
                    onChange={(e) => handleMbvChange(e, tapNumber, "price")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`unit_volume_${tapNumber}`}>
                    Unit Volume * (Litres)
                  </Label>
                  <Input
                    placeholder="Enter unit volume"
                    id={`unit_volume_${tapNumber}`}
                    type="number"
                    value={mbvData[`tap_unit_volume_${tapNumber}`] || ""}
                    onChange={(e) => handleMbvChange(e, tapNumber, "volume")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`unit_pulses_${tapNumber}`}>
                    Unit Pulses * (Flow sensors)
                  </Label>
                  <Input
                    placeholder="Enter unit pulses"
                    id={`unit_pulses_${tapNumber}`}
                    type="number"
                    value={mbvData[`tap_unit_pulse_${tapNumber}`] || ""}
                    onChange={(e) => handleMbvChange(e, tapNumber, "pulse")}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-blue-500 text-white">
            Update Tap Settings
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default MbvSettings;
