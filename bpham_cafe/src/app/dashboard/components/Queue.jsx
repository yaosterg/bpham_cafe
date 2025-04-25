"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Check,
  Clock,
  Coffee,
  MoreHorizontal,
  Search,
  Timer,
  AlertCircle,
  Thermometer,
  Snowflake,
  Milk,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Timer component to display elapsed time
function OrderTimer({ startTime, endTime = null }) {
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    // For completed orders with an end time
    if (endTime) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const elapsed = Math.floor((end - start) / 1000); // in seconds

      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      return;
    }

    // For pending orders, update every second
    const intervalId = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000); // in seconds

      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, endTime]);

  // Determine color based on elapsed time for pending orders
  const getTimerColor = () => {
    if (endTime) return "text-[#5D4B35]"; // Completed orders

    const elapsed = new Date().getTime() - new Date(startTime).getTime();
    const minutes = Math.floor(elapsed / (1000 * 60));

    if (minutes >= 15) return "text-red-600"; // Urgent
    if (minutes >= 10) return "text-orange-500"; // Warning
    if (minutes >= 5) return "text-amber-500"; // Attention
    return "text-[#5D4B35]"; // Normal
  };

  return (
    <div className={`flex items-center ${getTimerColor()}`}>
      <Timer className="h-3 w-3 mr-1" />
      <span className="text-xs font-medium">{elapsedTime}</span>
    </div>
  );
}

// Component to display drink options
function DrinkOptions({ options }) {
  if (!options) return null;

  // Helper function to get the right color for milk type
  const getMilkColor = (milkType) => {
    switch (milkType) {
      case "oat":
        return "bg-[#E8D4A4] text-[#8B6E4F]";
      case "almond":
        return "bg-[#F5E8D3] text-[#8B6E4F]";
      case "soy":
        return "bg-[#F0E68C] text-[#8B6E4F]";
      default:
        return "bg-[#F8F8FF] text-[#5D4B35]";
    }
  };

  // Helper function to get the right color for temperature
  const getTemperatureColor = (temperature) => {
    return temperature === "hot"
      ? "bg-[#FFEBCD] text-[#8B6E4F]"
      : "bg-[#E0FFFF] text-[#8B6E4F]";
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      <TooltipProvider>
        {options.milkType && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${getMilkColor(
                  options.milkType
                )}`}
              >
                <Milk className="h-3 w-3 mr-1" />
                {options.milkType.charAt(0).toUpperCase() +
                  options.milkType.slice(1)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Milk Type: {options.milkType}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {options.temperature && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${getTemperatureColor(
                  options.temperature
                )}`}
              >
                {options.temperature === "hot" ? (
                  <Thermometer className="h-3 w-3 mr-1" />
                ) : (
                  <Snowflake className="h-3 w-3 mr-1" />
                )}
                {options.temperature.charAt(0).toUpperCase() +
                  options.temperature.slice(1)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Temperature: {options.temperature}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {options.size && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-[#F0F8FF] text-[#5D4B35]">
                {options.size.charAt(0).toUpperCase() + options.size.slice(1)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Size: {options.size}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {options.extras &&
          options.extras.map((extra, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-[#FFF0F5] text-[#8B6E4F]">
                  {extra}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Extra: {extra}</p>
              </TooltipContent>
            </Tooltip>
          ))}
      </TooltipProvider>
    </div>
  );
}

export default function OrderManagement() {
  const today = format(new Date(), "MMMM d, yyyy");
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    orderId: null,
  });

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const filteredPendingOrders = pendingOrders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedOrders = completedOrders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open confirmation dialog
  const openConfirmDialog = (orderId) => {
    setConfirmDialog({ isOpen: true, orderId });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, orderId: null });
  };

  // Mark order as completed after confirmation
  const markAsCompleted = () => {
    if (confirmDialog.orderId) {
      setOrders(
        orders.map((order) =>
          order.id === confirmDialog.orderId
            ? {
                ...order,
                status: "completed",
                completedTime: new Date().toISOString(),
              }
            : order
        )
      );
      closeConfirmDialog();
    }
  };

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getOrderTotal = (items) => {
    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Find the order details for the confirmation dialog
  const getOrderDetails = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const confirmationOrder = confirmDialog.orderId
    ? getOrderDetails(confirmDialog.orderId)
    : null;

  return (
    <div className="py-8" style={{ backgroundColor: "#F9F5F0" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Orders List */}
        <Card className="border-[#D6C8B8] bg-white mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D6C8B8]">
            <CardTitle className="text-[#8B6E4F] flex items-center">
              <Coffee className="h-5 w-5 mr-2 text-[#8B6E4F]" />
              Order Management
            </CardTitle>
            <div className="text-xs text-[#8B6E4F]">
              Today's orders - {today}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#8B6E4F]" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
              />
            </div>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#F9F5F0]">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-[#8B6E4F] data-[state=active]:text-white"
                >
                  Brewing{" "}
                  <Badge className="ml-2 bg-[#D2691E] text-white">
                    {pendingOrders.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-[#8B6E4F] data-[state=active]:text-white"
                >
                  Served{" "}
                  <Badge className="ml-2 bg-[#2E8B57] text-white">
                    {completedOrders.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[60vh]">
                <TabsContent value="pending" className="space-y-2 mt-0">
                  {filteredPendingOrders.length === 0 ? (
                    <div className="text-center py-10 bg-[#F9F5F0] rounded-lg border border-[#D6C8B8]">
                      <Clock className="mx-auto h-10 w-10 text-[#8B6E4F] mb-4" />
                      <h3 className="text-lg font-medium text-[#5D4B35]">
                        No brewing orders
                      </h3>
                      <p className="text-[#8B6E4F]">
                        All orders have been served for today.
                      </p>
                    </div>
                  ) : (
                    filteredPendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-md cursor-pointer hover:bg-[#F9F5F0] border border-[#D6C8B8]"
                        onClick={() => openConfirmDialog(order.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-[#5D4B35] flex items-center">
                              Order #{order.orderNumber}
                              <Badge
                                variant="outline"
                                className="ml-2 bg-[#FFDAB9] text-[#8B6E4F] border-[#D6C8B8]"
                              >
                                Brewing
                              </Badge>
                              <div className="ml-2 flex items-center bg-white px-2 py-0.5 rounded-full border border-[#D6C8B8]">
                                <OrderTimer startTime={order.time} />
                              </div>
                            </div>
                            <div className="text-xs text-[#8B6E4F] mt-0.5">
                              {order.customerName} •{" "}
                              {format(new Date(order.time), "h:mm a")}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#8B6E4F] hover:bg-[#F9F5F0]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border-[#D6C8B8]"
                            >
                              <DropdownMenuItem className="text-[#8B6E4F] focus:text-[#5D4B35] focus:bg-[#F9F5F0]">
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#8B6E4F] focus:text-[#5D4B35] focus:bg-[#F9F5F0]">
                                Print receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#D6C8B8]" />
                              <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-[#F9F5F0]">
                                Cancel order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-2 space-y-1">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <div className="flex items-center">
                                <span className="text-[#5D4B35]">
                                  {item.quantity} × {item.name}
                                </span>
                              </div>
                              <span className="text-[#5D4B35]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="mt-2 p-2 bg-[#F9F5F0] border-l-4 border-[#8B6E4F] rounded">
                            <p className="text-xs italic text-[#5D4B35]">
                              <span className="font-semibold not-italic">
                                Special Request:
                              </span>{" "}
                              {order.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-xs text-[#8B6E4F]">
                            {getTotalItems(order.items)} items • $
                            {getOrderTotal(order.items)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-2 mt-0">
                  {filteredCompletedOrders.length === 0 ? (
                    <div className="text-center py-10 bg-[#F9F5F0] rounded-lg border border-[#D6C8B8]">
                      <Check className="mx-auto h-10 w-10 text-[#8B6E4F] mb-4" />
                      <h3 className="text-lg font-medium text-[#5D4B35]">
                        No served orders
                      </h3>
                      <p className="text-[#8B6E4F]">
                        Served orders will appear here.
                      </p>
                    </div>
                  ) : (
                    filteredCompletedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-md cursor-pointer hover:bg-[#F9F5F0] border border-[#D6C8B8]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-[#5D4B35] flex items-center">
                              Order #{order.orderNumber}
                              <Badge
                                variant="outline"
                                className="ml-2 bg-[#E8F5E9] text-[#2E8B57] border-[#D6C8B8]"
                              >
                                Served
                              </Badge>
                              <div className="ml-2 flex items-center bg-white px-2 py-0.5 rounded-full border border-[#D6C8B8]">
                                <OrderTimer
                                  startTime={order.time}
                                  endTime={order.completedTime}
                                />
                              </div>
                            </div>
                            <div className="text-xs text-[#8B6E4F] mt-0.5">
                              {order.customerName} •{" "}
                              {format(new Date(order.time), "h:mm a")}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#8B6E4F] hover:bg-[#F9F5F0]"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border-[#D6C8B8]"
                            >
                              <DropdownMenuItem className="text-[#8B6E4F] focus:text-[#5D4B35] focus:bg-[#F9F5F0]">
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[#8B6E4F] focus:text-[#5D4B35] focus:bg-[#F9F5F0]">
                                Print receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-2 space-y-1">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <div className="flex items-center">
                                <span className="text-[#5D4B35]">
                                  {item.quantity} × {item.name}
                                </span>
                              </div>
                              <span className="text-[#5D4B35]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="mt-2 p-2 bg-[#F9F5F0] border-l-4 border-[#8B6E4F] rounded">
                            <p className="text-xs italic text-[#5D4B35]">
                              <span className="font-semibold not-italic">
                                Special Request:
                              </span>{" "}
                              {order.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-xs text-[#8B6E4F]">
                            {getTotalItems(order.items)} items • $
                            {getOrderTotal(order.items)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="text-center text-[#8B6E4F] py-4">
          <p>© 2025 Brian's Coffee Shop. All rights reserved.</p>
        </footer>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={closeConfirmDialog}>
        <DialogContent className="bg-[#F9F5F0] border-[#D6C8B8] p-6">
          <DialogHeader className="space-y-1.5 pb-2">
            <DialogTitle className="text-[#5D4B35] flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-[#8B6E4F]" />
              Confirm Order Completion
            </DialogTitle>
            <DialogDescription className="text-[#8B6E4F]">
              Are you sure you want to mark this order as served?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {confirmationOrder && (
              <div className="space-y-4">
                <div className="bg-[#F9F5F0] p-3 rounded-md mb-3 border border-[#D6C8B8]">
                  <p className="font-medium text-[#5D4B35]">
                    Order #{confirmationOrder.orderNumber}
                  </p>
                  <p className="text-sm text-[#8B6E4F]">
                    {confirmationOrder.customerName}
                  </p>
                </div>

                <div className="space-y-2 mb-3">
                  {confirmationOrder.items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#5D4B35]">
                          {item.quantity} × {item.name}
                        </span>
                        <span className="text-[#5D4B35]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.options && <DrinkOptions options={item.options} />}
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#D6C8B8] my-3" />

                {confirmationOrder.notes && (
                  <div className="p-2 bg-[#F9F5F0] border-l-4 border-[#8B6E4F] rounded text-xs italic text-[#5D4B35]">
                    <span className="font-semibold not-italic">
                      Special Request:
                    </span>{" "}
                    {confirmationOrder.notes}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={closeConfirmDialog}
              className="border-[#D6C8B8] text-[#8B6E4F] hover:bg-[#F9F5F0] hover:text-[#5D4B35]"
            >
              Cancel
            </Button>
            <Button
              onClick={markAsCompleted}
              className="bg-[#8B6E4F] hover:bg-[#725A41] text-white"
            >
              <Check className="mr-2 h-4 w-4" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sample data
const initialOrders = [
  {
    id: 1,
    orderNumber: "BC-001",
    customerName: "John Smith",
    time: "2025-04-24T08:30:00",
    status: "pending",
    notes: "Extra hot, no foam on cappuccinos",
    items: [
      {
        name: "Cappuccino",
        quantity: 2,
        price: 4.5,
        type: "coffee",
        options: {
          milkType: "regular",
          temperature: "hot",
          size: "medium",
        },
      },
      { name: "Almond Croissant", quantity: 1, price: 3.25, type: "food" },
    ],
  },
  {
    id: 2,
    orderNumber: "BC-002",
    customerName: "Emily Johnson",
    time: "2025-04-24T09:15:00",
    status: "pending",
    notes: "Light ice in the juice",
    items: [
      {
        name: "Caramel Macchiato",
        quantity: 1,
        price: 4.0,
        type: "coffee",
        options: {
          milkType: "oat",
          temperature: "hot",
          size: "large",
          extras: ["Extra caramel"],
        },
      },
      { name: "Blueberry Muffin", quantity: 1, price: 3.5, type: "food" },
      {
        name: "Fresh Orange Juice",
        quantity: 1,
        price: 3.75,
        type: "drink",
        options: {
          temperature: "cold",
          size: "medium",
        },
      },
    ],
  },
  {
    id: 3,
    orderNumber: "BC-003",
    customerName: "Michael Brown",
    time: "2025-04-24T09:45:00",
    status: "completed",
    completedTime: "2025-04-24T09:52:00",
    notes: "",
    items: [
      {
        name: "Double Espresso",
        quantity: 2,
        price: 3.0,
        type: "coffee",
        options: {
          temperature: "hot",
          size: "small",
        },
      },
    ],
  },
  {
    id: 4,
    orderNumber: "BC-004",
    customerName: "Sarah Wilson",
    time: "2025-04-24T10:00:00",
    status: "pending",
    notes: "Extra chocolate drizzle",
    items: [
      {
        name: "Mocha Frappuccino",
        quantity: 1,
        price: 4.75,
        type: "coffee",
        options: {
          milkType: "almond",
          temperature: "cold",
          size: "large",
          extras: ["Whipped cream", "Chocolate drizzle"],
        },
      },
      { name: "Chocolate Chip Cookie", quantity: 2, price: 2.5, type: "food" },
    ],
  },
  {
    id: 5,
    orderNumber: "BC-005",
    customerName: "David Lee",
    time: "2025-04-24T10:30:00",
    status: "completed",
    completedTime: "2025-04-24T10:45:00",
    notes: "No salt on avocado toast",
    items: [
      {
        name: "Americano",
        quantity: 1,
        price: 3.5,
        type: "coffee",
        options: {
          temperature: "hot",
          size: "medium",
          extras: ["Room for cream"],
        },
      },
      { name: "Avocado Toast", quantity: 1, price: 4.25, type: "food" },
    ],
  },
  {
    id: 6,
    orderNumber: "BC-006",
    customerName: "Jessica Taylor",
    time: "2025-04-24T11:15:00",
    status: "completed",
    completedTime: "2025-04-24T11:22:00",
    notes:
      "Chai not too spicy, heat the cinnamon rollasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfs",
    items: [
      {
        name: "Chai Tea Latte",
        quantity: 1,
        price: 4.25,
        type: "coffee",
        options: {
          milkType: "soy",
          temperature: "hot",
          size: "medium",
          extras: ["Less spice"],
        },
      },
      { name: "Cinnamon Roll", quantity: 1, price: 3.75, type: "food" },
    ],
  },
];
