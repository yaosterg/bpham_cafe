"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Coffee,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Sample data - replace with your actual data
const salesData = [
  { name: "Mon", total: 580 },
  { name: "Tue", total: 420 },
  { name: "Wed", total: 650 },
  { name: "Thu", total: 750 },
  { name: "Fri", total: 890 },
  { name: "Sat", total: 950 },
  { name: "Sun", total: 750 },
];

const popularItems = [
  { name: "Espresso", sales: 145, growth: "+12.5%" },
  { name: "Cappuccino", sales: 132, growth: "+10.2%" },
  { name: "Latte", sales: 125, growth: "+8.1%" },
  { name: "Cold Brew", sales: 110, growth: "+15.3%" },
  { name: "Mocha", sales: 95, growth: "+5.7%" },
];

const inventoryItems = [
  { name: "Coffee Beans (Arabica)", level: 72, status: "Good" },
  { name: "Coffee Beans (Robusta)", level: 45, status: "Warning" },
  { name: "Milk", level: 65, status: "Good" },
  { name: "Sugar", level: 85, status: "Good" },
  { name: "Cups (12oz)", level: 25, status: "Low" },
];

export default function CoffeeDashboard() {
  const [timeframe, setTimeframe] = useState("week");

  return (
    <div className="flex flex-col gap-5 p-6 bg-[#F9F5F1]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#5F4B32]">
          Brian Coffee Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[#8C7851] text-[#5F4B32]">
            <Clock className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-[#8C7851] hover:bg-[#6F5B3E] text-white">
            <Package className="mr-2 h-4 w-4" />
            Order Inventory
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#E6DDD1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5F4B32]">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#8C7851]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5F4B32]">$4,550.75</div>
            <p className="text-xs text-[#8C7851]">+12.5% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-[#E6DDD1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5F4B32]">
              Cups Sold
            </CardTitle>
            <Coffee className="h-4 w-4 text-[#8C7851]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5F4B32]">1,245</div>
            <p className="text-xs text-[#8C7851]">+8.2% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-[#E6DDD1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5F4B32]">
              New Customers
            </CardTitle>
            <Users className="h-4 w-4 text-[#8C7851]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5F4B32]">145</div>
            <p className="text-xs text-[#8C7851]">+5.1% from last week</p>
          </CardContent>
        </Card>
        <Card className="border-[#E6DDD1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#5F4B32]">
              Avg. Order Value
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#8C7851]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5F4B32]">$6.75</div>
            <p className="text-xs text-[#8C7851]">+2.3% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 border-[#E6DDD1] bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#5F4B32]">Sales Overview</CardTitle>
              <Tabs
                defaultValue={timeframe}
                onValueChange={setTimeframe}
                className="w-[240px]"
              >
                <TabsList className="bg-[#E6DDD1]">
                  <TabsTrigger
                    value="day"
                    className="data-[state=active]:bg-[#8C7851] data-[state=active]:text-white"
                  >
                    Day
                  </TabsTrigger>
                  <TabsTrigger
                    value="week"
                    className="data-[state=active]:bg-[#8C7851] data-[state=active]:text-white"
                  >
                    Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="data-[state=active]:bg-[#8C7851] data-[state=active]:text-white"
                  >
                    Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription className="text-[#8C7851]">
              Daily revenue for the past week
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesData}>
                <XAxis
                  dataKey="name"
                  stroke="#8C7851"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8C7851"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="#8C7851" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-[#E6DDD1] bg-white">
          <CardHeader>
            <CardTitle className="text-[#5F4B32]">Popular Items</CardTitle>
            <CardDescription className="text-[#8C7851]">
              Top selling drinks this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-[#5F4B32]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#8C7851]">
                      {item.sales} cups sold
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#8C7851]">{item.growth}</Badge>
                    <TrendingUp className="h-4 w-4 text-[#8C7851]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#E6DDD1] bg-white">
        <CardHeader>
          <CardTitle className="text-[#5F4B32]">Inventory Status</CardTitle>
          <CardDescription className="text-[#8C7851]">
            Current stock levels of key items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {inventoryItems.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#5F4B32]">
                      {item.name}
                    </p>
                    <Badge
                      variant={
                        item.status === "Low"
                          ? "destructive"
                          : item.status === "Warning"
                          ? "outline"
                          : "default"
                      }
                      className={
                        item.status === "Good"
                          ? "bg-green-600"
                          : item.status === "Warning"
                          ? "border-amber-500 text-amber-500"
                          : ""
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-[#8C7851]">{item.level}%</span>
                </div>
                <Progress
                  value={item.level}
                  className="h-2 bg-[#E6DDD1]"
                  indicatorClassName={
                    item.level > 60
                      ? "bg-green-600"
                      : item.level > 30
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-[#E6DDD1] pt-4">
          <Button className="w-full bg-[#8C7851] hover:bg-[#6F5B3E] text-white">
            <Package className="mr-2 h-4 w-4" />
            Manage Inventory
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
