"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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

export function TransactionsChart() {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default: Current month
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
        console.log("Fetched Data:", data);

        if (data?.device_data?.length > 0) {
          const rawData = data.device_data[0];

          // Extract and filter transactions for the selected month
          const filteredData = [
            {
              name: "mpesa",
              value: Number(rawData.mpesa_transactions[selectedMonth]) || 0,
              fill: "var(--color-mpesa)"
            },
            {
              name: "topup",
              value: Number(rawData.tag_topup_transactions[selectedMonth]) || 0,
              fill: "var(--color-topup)"
            },
            {
              name: "tagpay",
              value: Number(rawData.tag_pay_transactions[selectedMonth]) || 0,
              fill: "var(--color-tagpay)"
            },
          ];

          console.log("Filtered Data:", filteredData);
          setChartData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, selectedMonth]);

  // Calculate total transactions
  const totalTransactions = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData]
  );

  return (
    <Card className="flex flex-col w-1/2 mx-auto mb-4 ">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tranasactions Statistics</CardTitle>
        <CardDescription>
            Total amount earned for the month {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())}
            </CardDescription>

      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTransactions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                        Shillings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        
      </CardFooter>
    </Card>
  );
}


  