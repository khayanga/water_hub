"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { getAccessToken } from "./utils/auth";

const chartConfig = {
  mpesa: {
    label: "Mpesa Transactions",
    color: "hsl(var(--chart-1))",
  },
  topup: {
    label: "Tag Top-up Transactions",
    color: "hsl(var(--chart-2))",
  },
  tagpay: {
    label: "Tag Pay Transactions",
    color: "hsl(var(--chart-3))",
  },
};

export function Comparison() {
  const [chartData, setChartData] = useState([]);

  const token = getAccessToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.waterhub.africa/api/v1/client/stats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (data?.device_data?.length > 0) {
          const rawData = data.device_data[0];

          // Ensure correct mapping for January - June
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

          const filteredData = months.map((month, index) => ({
            month, // Correct month label
            mpesa: Number(rawData.mpesa_transactions[index + 1]) || 0,
            topup: Number(rawData.tag_topup_transactions[index + 1]) || 0,
            tagpay: Number(rawData.tag_pay_transactions[index + 1]) || 0,
          }));

          setChartData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Card className="w-full md:w-[450px] mx-auto mb-4">
      <CardHeader>
        <CardTitle>Transaction Comparison</CardTitle>
        <CardDescription>January - June {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0} // Force all months to be shown
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="mpesa"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="topup"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="tagpay"
              type="monotone"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total transactions for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}


