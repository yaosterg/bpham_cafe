"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, Trash2, CheckCircle, Coffee, User, Cake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  selectAllOrders,
  selectOrderItems,
  findAllOrders,
  deleteOrder,
  completeOrder,
} from "@/store/reducers/orderSlice";
import {
  findAllCategories,
  selectAllCategories,
} from "@/store/reducers/categorySlice";
import { createClient } from "@supabase/supabase-js";

// Mock data for orders

function formatElapsedTime(created) {
  const now = new Date();
  const createdTime = new Date(created);
  const diffInMinutes = Math.floor((now - createdTime) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return `${hours}h ${minutes}m ago`;
}

function OrderCard({ order, drinks, bakery, onDelete, onComplete }) {
  const [elapsedTime, setElapsedTime] = useState(
    formatElapsedTime(order.created)
  );
  const [checkedItems, setCheckedItems] = useState({ bakery: {}, drinks: {} });
  function handleToggle(category, key) {
    setCheckedItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(order.created));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [order.created]);

  return (
    <Card className="w-full mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            {order.name}
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {order.id + 1000}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          {/* <span>Created: {order.created.toLocaleTimeString()}</span> */}
          <Separator orientation="vertical" className="h-3" />
          <span className="text-red-500 font-medium">
            Elapsed: {elapsedTime}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          {drinks.length > 0 && (
            <h4 className="font-semibold text-sm text-foreground mb-2 uppercase tracking-wide border-b border-muted pb-1">
              Beverages
            </h4>
          )}
          {drinks.map((item, index) => {
            const isChecked = checkedItems.drinks[item.id] ?? false;
            return (
              <div
                key={index}
                className={`py-2 border-b border-muted/30 last:border-b-0 ml-2 ${
                  isChecked ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {" "}
                    <div className="flex items-center gap-2 mb-1">
                      <Coffee className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <Badge variant="secondary" className="text-xs">
                        {item.quantity}x
                      </Badge>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.selectedOptions &&
                      Object.entries(item.selectedOptions).map(
                        ([key, value]) => (
                          <p
                            key={key}
                            className="text-sm text-muted-foreground ml-5"
                          >
                            {key[0].toUpperCase() + key.slice(1)}:{" "}
                            {value[0].toUpperCase() + value.slice(1)}
                          </p>
                        )
                      )}
                    {item.notes && (
                      <p className="text-sm text-blue-500 ml-5">
                        Notes: {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle("drinks", item.id)}
                      className="w-4 h-4 text-primary bg-background border-2 border-muted-foreground rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mb-4">
          {bakery.length > 0 && (
            <h4 className="font-semibold text-sm text-foreground mb-2 uppercase tracking-wide border-b border-muted pb-1">
              Bakery
            </h4>
          )}
          {bakery.map((item, index) => {
            const isChecked = checkedItems.bakery[item.id] ?? false;
            return (
              <div
                key={index}
                className={`py-2 border-b border-muted/30 last:border-b-0 ml-2 ${
                  isChecked ? "opacity-60" : ""
                }`}
              >
                {" "}
                <div className="flex items-center justify-between">
                  <div>
                    {" "}
                    <div className="flex items-center gap-2 mb-1">
                      <Cake className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <Badge variant="secondary" className="text-xs">
                        {item.quantity}x
                      </Badge>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.selectedOptions &&
                      Object.entries(item.selectedOptions)
                        .sort(([a], [b]) => {
                          if (a === "temp") return -1;
                          if (b === "temp") return 1;
                          return 0;
                        })
                        .map(([key, value]) => (
                          <p
                            key={key}
                            className="text-sm text-muted-foreground ml-5"
                          >
                            {key[0].toUpperCase() + key.slice(1)}:{" "}
                            {value[0].toUpperCase() + value.slice(1)}
                          </p>
                        ))}
                    {item.notes && (
                      <p className="text-sm text-blue-500 ml-5">
                        Notes: {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle("bakery", item.id)}
                      className="w-4 h-4 text-primary bg-background border-2 border-muted-foreground rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-2">
          {!order.completedStatus && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete order {order.id} for{" "}
                    {order.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(order.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {!order.completedStatus && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 "
                  style={{ backgroundColor: "oklch(64.8% 0.2 131.684)" }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Mark order {order.id} for {order.name} as completed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    style={{ backgroundColor: "oklch(64.8% 0.2 131.684)" }}
                    onClick={() => onComplete(order.id)}
                  >
                    Complete Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function useOrderRealtime() {
  const dispatch = useDispatch();

  useEffect(() => {
    const channel = supabase
      .channel("Order-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // listen for INSERT, UPDATE, DELETE
          schema: "public",
          table: "Order", // usually lowercase, adjust if needed
        },
        (payload) => {
          console.log("Order change received:", payload);

          dispatch(findAllOrders()); // refetch orders to update UI
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch]);
}

export default function OrderQueue() {
  const orders = useSelector(selectAllOrders);
  const orderItems = useSelector(selectOrderItems);
  const categories = useSelector(selectAllCategories);
  const [activeTab, setActiveTab] = useState("processing");
  const dispatch = useDispatch();
  useOrderRealtime();

  useEffect(() => {
    const fetchOrders = async () => {
      await dispatch(findAllOrders());
      await dispatch(findAllCategories());
    };
    fetchOrders();
  }, []);

  const processingOrders = orders
    .filter((order) => order.completedStatus === false)
    .sort((a, b) => a.created - b.created); // Oldest first (longest elapsed time)

  const completedOrders = orders
    .filter((order) => order.completedStatus === true)
    .sort((a, b) => a.id - b.id); // Oldest first (longest elapsed time)

  const handleDeleteOrder = async (order) => {
    console.log("Deleting order:", order);
    console.log("Orders:", orders);
    console.log("Order Items:", orderItems);
    await dispatch(deleteOrder(order));
  };

  const handleCompleteOrder = async (order) => {
    await dispatch(completeOrder(order));
  };

  const currentOrders =
    activeTab === "processing" ? processingOrders : completedOrders;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r border-border p-4 hidden md:block">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-4">Order Queue</h2>
          <Button
            variant={activeTab === "processing" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("processing")}
          >
            Processing Orders
            <Badge variant="secondary" className="ml-auto">
              {processingOrders.length}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "completed" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("completed")}
          >
            Completed Orders
            <Badge variant="secondary" className="ml-auto">
              {completedOrders.length}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-10">
        <div className="flex">
          <Button
            variant={activeTab === "processing" ? "default" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab("processing")}
          >
            Processing ({processingOrders.length})
          </Button>
          <Button
            variant={activeTab === "completed" ? "default" : "ghost"}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedOrders.length})
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-4 md:p-6 pt-16 md:pt-6 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold capitalize">
                {activeTab} Orders
              </h1>
              <p className="text-muted-foreground">
                {currentOrders.length} {activeTab} order
                {currentOrders.length !== 1 ? "s" : ""}
              </p>
            </div>

            {currentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <Coffee className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No {activeTab} orders</p>
                  <p className="text-sm">
                    Orders will appear here when available
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    drinks={orderItems
                      .filter((item) => item.orderId === order.id)
                      .filter((item) => item.categoryId !== 25)}
                    bakery={orderItems
                      .filter((item) => item.orderId === order.id)
                      .filter((item) => item.categoryId === 25)}
                    onDelete={() => handleDeleteOrder(order)}
                    onComplete={() => handleCompleteOrder(order)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
