import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter } from "./ui/card";
import { getAccessToken } from "./utils/auth";
import { useToast } from "@/hooks/use-toast";

const TapSettings = ({ deviceId }) => {
    const {toast} = useToast();
    const [error, setError] = useState('');
    const token = getAccessToken();
    const [tapSettings, setTapSettings] = useState({
      tap_unit_price_1: '',
      min_tap_unit_price_1: '',
      tap_unit_price_2: '',
      min_tap_unit_price_2: '',
    });
   
    const [tapCalibration, setTapCalibration] = useState({
      tap_unit_pulse_1: '',
      tap_unit_volume_1: '',
      tap_unit_pulse_2: '',
      tap_unit_volume_2: '',
    });
  

    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setTapSettings((prevSettings) => ({
        ...prevSettings,
        [id]: value,
      }));
    };
  

    const handleSubmitTapSettings = async (e) => {
      e.preventDefault();
      setError('');
      
      
      try {
        const response = await fetch(`https://api.waterhub.africa/api/v1/client/device/solenoid/tap-settings/${deviceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(tapSettings),
        });
  
        const result = await response.json();
        if (response.ok) {
          
          // alert("Tap settings updated successfully")
          toast({
            description: "Tap settings updated successfully.",
          });
          console.log('Updated tap settings:', result);
        } else {
          toast({
            variant:"destructive",
            description: "Failed to update, try again .",
          });
          setError('Failed to update tap settings');
          console.error('API Error:', result);
        }
      } catch (error) {
        setError('An error occurred while updating tap settings.');
        console.error('Error:', error);
      }
    };
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-16 w-full mx-auto">
          <form onSubmit={handleSubmitTapSettings} className="w-full md:max-w-2xl mt-5 pl-2">
           
              <Card>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_price_1">Tap No 1 - Unit Price/Liter(KES)</Label>
                      <Input
                        id="tap_unit_price_1"
                        type="text"
                        placeholder="Enter unit price"
                        value={tapSettings.tap_unit_price_1}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="min_tap_unit_price_1">Tap No 1 - Min Dispense Price(KES)</Label>
                      <Input
                        id="min_tap_unit_price_1"
                        type="text"
                        placeholder="Enter min dispense price"
                        value={tapSettings.min_tap_unit_price_1}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-8 p-2">
                    <div className="space-y-1">
                      <Label htmlFor="tap_unit_price_2">Tap No 2 - Unit Price/Liter(KES)</Label>
                      <Input
                        id="tap_unit_price_2"
                        type="text"
                        placeholder="Enter unit price"
                        value={tapSettings.tap_unit_price_2}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="min_tap_unit_price_2">Tap No 2 - Min Dispense Price(KES)</Label>
                      <Input
                        id="min_tap_unit_price_2"
                        type="text"
                        placeholder="Enter min dispense price"
                        value={tapSettings.min_tap_unit_price_2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Update Tap Settings
                  </Button>
                </CardFooter>
              </Card>
            
          </form>
    </div>
  );
};

export default TapSettings;



