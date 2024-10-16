"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getAccessToken } from "./utils/auth";


export const description = "A stacked area chart";

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

// Function to transform API data into chart data
const transformData = (deviceData) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return months.map((_, index) => {
    const monthIndex = (index + 1).toString(); 
    return {
      month: months[index],
      mpesa: Math.max(0, deviceData.mpesa_transactions[monthIndex] ?? 0),  
      topup: Math.max(0, deviceData.tag_topup_transactions[monthIndex] ?? 0),  
      tagpay: Math.max(0, deviceData.tag_pay_transactions[monthIndex] ?? 0),  
    };
  });
};


const Clientchart = () => {
    const [chartData, setChartData] = useState([]);
    const token = getAccessToken(); 

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("https://api.waterhub.africa/api/v1/client/stats", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          });
          const data = await response.json();
          console.log("Fetched Data:", data); // Log the fetched data
          if (data && data.device_data && data.device_data.length > 0) {
            const transformedData = transformData(data.device_data[0]);
            console.log("Transformed data:", transformedData);
            setChartData(transformedData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
  }, [token]);

  console.log("Chart Data:", chartData);


      

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>
          Showing transactions for the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
         <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
             margin={{
              left: 12,
              right: 12,
            }}
            
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mpesa"
              fill="var(--color-mpesa)"
              fillOpacity={0.4}
              stroke="var(--color-mpesa)"
              stackId="a"
            />
            <Area
              dataKey="topup"
              fill="var(--color-topup)"
              fillOpacity={0.4}
              stroke="var(--color-topup)"
              stackId="a"
            />
            <Area
              dataKey="tagpay"
              fill="var(--color-tagpay)"
              fillOpacity={0.4}
              stroke="var(--color-tagpay)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trends in months <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - December 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Clientchart
