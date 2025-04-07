import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";

const ApiKeys = ({ token }) => {
    const { toast } = useToast();
  const [apiKeysData, setApiKeysData] = useState({
    client_id: "",
    consumer_secret: "",
    consumer_key: "",
    short_code: "",
    pass_key: "",
    account: "",
    mpesa_till: "",
    account_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/device/keys/list",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (
          response.ok &&
          result.status === "Success" &&
          result.data.length > 0
        ) {
          const keys = result.data[0];
          setApiKeysData({
            consumer_secret: keys.MPESA_CONSUMER_SECRET || "",
            consumer_key: keys.MPESA_CONSUMER_KEY || "",
            short_code: keys.MPESA_STK_SHORTCODE || "",
            pass_key: keys.MPESA_PASSKEY || "",
            account: keys.MPESA_ACCOUNT || "",
            account_type: keys.ACCOUNT_TYPE || "",
          });
        } else {
          console.error("Failed to fetch API keys:", result);
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };

    fetchApiKeys();
  }, []);

  const handleApiKeysInputChange = (e) => {
    setApiKeysData({ ...apiKeysData, [e.target.id]: e.target.value });
  };

  const handleAccountTypeChange = (value) => {
    setApiKeysData({ ...apiKeysData, account_type: value });
  };

  const handleSubmitApiKeys = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getAccessToken();

    try {
      const response = await fetch(
        "https://api.waterhub.africa/api/v1/client/device/keys/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(apiKeysData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast({ description: "API Keys added successfully." });
      } else {
        toast({
          variant: "destructive",
          description: result.message || "Failed to add API keys.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred while adding API keys.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmitApiKeys}
      className="w-full md:max-w-2xl mt-5 pl-2"
    >
      <Card>
        <CardContent className="space-y-2 pt-2">
          <div className="flex flex-col  gap-8 p-2">
            <h1>Add your Api keys</h1>
            <div className="space-y-1">
              <Label htmlFor="consumer_secret">Consumer Secret</Label>
              <Input
                id="consumer_secret"
                type="text"
                placeholder="Enter consumer secret"
                value={apiKeysData.consumer_secret}
                onChange={handleApiKeysInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="consumer_key">Consumer Key</Label>
              <Input
                id="consumer_key"
                type="text"
                placeholder="Enter consumer key"
                value={apiKeysData.consumer_key}
                onChange={handleApiKeysInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="short_code">Short Code</Label>
              <Input
                id="short_code"
                type="text"
                placeholder="Enter short code"
                value={apiKeysData.short_code}
                onChange={handleApiKeysInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pass_key">Pass Key</Label>
              <Input
                id="pass_key"
                type="text"
                placeholder="Enter pass key"
                value={apiKeysData.pass_key}
                onChange={handleApiKeysInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="account">Account Number</Label>
              <Input
                id="account"
                type="text"
                placeholder="Enter account number"
                value={apiKeysData.account}
                onChange={handleApiKeysInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="account_type">Account Type</Label>
              <Select
                onValueChange={handleAccountTypeChange}
                value={apiKeysData.account_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAYBILL">PayBill</SelectItem>
                  <SelectItem value="TILL NUMBER">Till Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-blue-500 text-white">
            Add Keys
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ApiKeys;
