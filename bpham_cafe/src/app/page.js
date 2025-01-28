"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  CheckSquare,
  User,
  ShoppingBag,
  X,
  Check,
  Trash2,
  Coffee,
  CakeSlice,
  Clock,
  StickyNote,
} from "lucide-react";

const SIGNATURE_LATTES = [
  "The BP.HAM",
  "XO",
  "Heritage",
  "Posh",
  "Flower Power",
  "Mocha Bird",
];
const CLASSICS = [
  "Espresso",
  "Macchiato",
  "Espresso + Splash of Milk",
  "Cortado",
  "Cappuccino",
  "Latte",
  "Americano",
  "Aerocano",
  'Espresso + "Nitro"',
];
const BAKERY_ITEMS = {
  Cookies: ["Triple Chocolate", "Ube White Chocolate", "Cookies & Cream"],
  Breads: ["Banana Chocolate Chip", "Earl Gray"],
  Cake: ["Carrot Cake Cupcakes", "Chocolate Cake"],
};

const getItemCategory = (itemName) => {
  if (SIGNATURE_LATTES.includes(itemName)) return "signature";
  if (CLASSICS.includes(itemName)) return "classic";
  return "bakery";
};

const getCategoryColor = (category) => {
  switch (category) {
    case "signature":
      return "bg-blue-50";
    case "classic":
      return "bg-purple-50";
    case "bakery":
      return "bg-green-50";
    default:
      return "bg-gray-50";
  }
};

const orderHistory = [
  {
    id: 1,
    customerName: "Alice Johnson",
    items: [
      {
        name: "The BP.HAM",
        quantity: 2,
        price: 5.99,
        milkOption: "Whole Milk",
        temperature: "Hot",
      },
      {
        name: "XO",
        quantity: 1,
        price: 5.99,
        milkOption: "Oat Milk",
        temperature: "Cold",
      },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    notes: "Extra hot, please!",
  },
  {
    id: 2,
    customerName: "Bob Smith",
    items: [
      {
        name: "Heritage",
        quantity: 1,
        price: 5.99,
        milkOption: "Whole Milk",
        temperature: "Hot",
      },
      {
        name: "Posh",
        quantity: 1,
        price: 5.99,
        milkOption: "Oat Milk",
        temperature: "Cold",
      },
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    notes: "No sugar in the Heritage",
  },
  {
    id: 3,
    customerName: "Charlie Brown",
    items: [
      {
        name: "Flower Power",
        quantity: 3,
        price: 5.99,
        milkOption: "Whole Milk",
        temperature: "Cold",
      },
      {
        name: "Mocha Bird",
        quantity: 2,
        price: 5.99,
        milkOption: "Oat Milk",
        temperature: "Hot",
      },
    ],
    status: "complete",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    completedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    notes: "Birthday order",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = React.useState([
    {
      id: 1,
      customerName: "Alice Johnson",
      items: [
        {
          name: "The BP.HAM",
          quantity: 2,
          price: 5.99,
          milkOption: "Whole Milk",
          temperature: "Hot",
        },
        {
          name: "XO",
          quantity: 1,
          price: 5.99,
          milkOption: "Oat Milk",
          temperature: "Cold",
        },
      ],
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      notes: "Extra hot, please!",
    },
    {
      id: 2,
      customerName: "Bob Smith",
      items: [
        {
          name: "Heritage",
          quantity: 1,
          price: 5.99,
          milkOption: "Whole Milk",
          temperature: "Hot",
        },
        {
          name: "Posh",
          quantity: 1,
          price: 5.99,
          milkOption: "Oat Milk",
          temperature: "Cold",
        },
      ],
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      notes: "No sugar in the Heritage",
    },
    {
      id: 3,
      customerName: "Charlie Brown",
      items: [
        {
          name: "Flower Power",
          quantity: 3,
          price: 5.99,
          milkOption: "Whole Milk",
          temperature: "Cold",
        },
        {
          name: "Mocha Bird",
          quantity: 2,
          price: 5.99,
          milkOption: "Oat Milk",
          temperature: "Hot",
        },
      ],
      status: "complete",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      completedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      notes: "Birthday order",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState(null);
  const [newOrder, setNewOrder] = React.useState({
    customerName: "",
    items: [],
    notes: "",
  });
  const [showCompletedOrders, setShowCompletedOrders] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [orderToDelete, setOrderToDelete] = React.useState(null);

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter((order) => order.status === "complete");

  const handleAddOrder = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewOrder = () => {
    if (newOrder.customerName && newOrder.items.length > 0) {
      const newId = Math.max(...orders.map((o) => o.id), 0) + 1;
      setOrders([
        ...orders,
        { ...newOrder, id: newId, status: "pending", createdAt: new Date() },
      ]);
      setIsAddModalOpen(false);
      setNewOrder({ customerName: "", items: [], notes: "" });
    }
  };

  const handleAddNewOrderItem = (itemName, isBakeryItem = false) => {
    const milkLabel = document.getElementById(`${itemName}-milk-label`);
    const tempLabel = document.getElementById(`${itemName}-temp-label`);
    const milkOption = isBakeryItem
      ? "N/A"
      : milkLabel
      ? milkLabel.textContent === "Oat"
        ? "Oat Milk"
        : "Whole Milk"
      : "Whole Milk";
    const temperature = isBakeryItem
      ? "N/A"
      : tempLabel
      ? tempLabel.textContent
      : "Hot";
    const price = 5.99;
    const existingItemIndex = newOrder.items.findIndex(
      (item) =>
        item.name === itemName &&
        item.milkOption === milkOption &&
        item.temperature === temperature
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...newOrder.items];
      updatedItems[existingItemIndex].quantity += 1;
      setNewOrder({ ...newOrder, items: updatedItems });
    } else {
      setNewOrder({
        ...newOrder,
        items: [
          ...newOrder.items,
          { name: itemName, quantity: 1, price, milkOption, temperature },
        ],
      });
    }
  };

  const handleUpdateNewOrderItem = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleRemoveNewOrderItem = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleToggleCompletedOrders = () => {
    setShowCompletedOrders(!showCompletedOrders);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleSaveOrder = () => {
    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? editingOrder : order
        )
      );
      setIsEditModalOpen(false);
      setEditingOrder(null);
    }
  };

  const handleUpdateOrderItem = (index, field, value) => {
    if (editingOrder) {
      const updatedItems = [...editingOrder.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      setEditingOrder({ ...editingOrder, items: updatedItems });
    }
  };

  const handleAddItem = (itemName, isBakeryItem = false) => {
    if (editingOrder) {
      const milkLabel = document.getElementById(`${itemName}-milk-label`);
      const tempLabel = document.getElementById(`${itemName}-temp-label`);
      const milkOption = isBakeryItem
        ? "N/A"
        : milkLabel
        ? milkLabel.textContent === "Oat"
          ? "Oat Milk"
          : "Whole Milk"
        : "Whole Milk";
      const temperature = isBakeryItem
        ? "N/A"
        : tempLabel
        ? tempLabel.textContent
        : "Hot";
      const existingItemIndex = editingOrder.items.findIndex(
        (item) =>
          item.name === itemName &&
          item.milkOption === milkOption &&
          item.temperature === temperature
      );
      if (existingItemIndex !== -1) {
        const updatedItems = [...editingOrder.items];
        updatedItems[existingItemIndex].quantity += 1;
        setEditingOrder({ ...editingOrder, items: updatedItems });
      } else {
        setEditingOrder({
          ...editingOrder,
          items: [
            ...editingOrder.items,
            {
              name: itemName,
              quantity: 1,
              price: 5.99,
              milkOption,
              temperature,
            },
          ],
        });
      }
    }
  };

  const handleRemoveItem = (index) => {
    if (editingOrder) {
      const updatedItems = editingOrder.items.filter((_, i) => i !== index);
      setEditingOrder({ ...editingOrder, items: updatedItems });
    }
  };

  const handleMarkCompleted = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "complete", completedAt: new Date() }
          : order
      )
    );
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      setIsDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start, end) => {
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const OrderQueue = ({ orders, title }) => (
    <section>
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 p-4">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {order.customerName}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === "complete"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </CardTitle>
              <div className="text-xs text-gray-500">
                Created: {formatDate(order.createdAt)}
                {order.status === "complete" && order.completedAt && (
                  <div>
                    Completed: {formatDate(order.completedAt)}
                    <br />
                    Duration:{" "}
                    {formatDuration(order.createdAt, order.completedAt)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2 flex items-center text-sm">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Order Items:
                {order.status === "pending" && (
                  <span className="ml-2 text-xs font-normal text-gray-500 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    Processing: {formatDuration(order.createdAt, new Date())}
                  </span>
                )}
              </h3>
              <ul className="space-y-1 text-sm">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-xs">
                      {item.name}{" "}
                      {item.milkOption !== "N/A" &&
                        `(${item.milkOption}, ${item.temperature})`}
                    </span>
                    <span className="font-medium text-xs">
                      x{item.quantity} ($
                      {(item.price * item.quantity).toFixed(2)})
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right font-semibold text-sm">
                Total: $
                {order.items
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </div>
              {order.notes && (
                <div className="mt-2 text-xs text-gray-600">
                  <StickyNote className="inline-block mr-1 h-3 w-3" />
                  Notes: {order.notes}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-2">
              <Button
                className="flex-1 text-xs h-9"
                variant="outline"
                onClick={() => handleEditOrder(order)}
              >
                Edit
              </Button>
              {order.status === "pending" && (
                <Button
                  className="flex-1 text-xs h-9"
                  variant="secondary"
                  onClick={() => handleMarkCompleted(order.id)}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Complete
                </Button>
              )}
              <Button
                className="flex-1 text-xs h-9"
                variant="destructive"
                onClick={() => handleDeleteOrder(order)}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );

  const MenuSection = ({
    title,
    items,
    onAddItem,
    showOptions = true,
    icon,
  }) => {
    const renderItems = (itemList, isBakeryItem = false) => (
      <div className="grid gap-4 sm:grid-cols-2">
        {itemList.map((item) => {
          const category = getItemCategory(item);
          const bgColor = getCategoryColor(category);
          return (
            <div
              key={item}
              className={`flex flex-col justify-between ${bgColor} p-3 rounded-lg`}
            >
              <span className="font-medium mb-2">{item}</span>
              <div className="flex flex-col space-y-2">
                {showOptions && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${item}-milk-toggle`}
                        onCheckedChange={(checked) => {
                          const label = document.getElementById(
                            `${item}-milk-label`
                          );
                          if (label)
                            label.textContent = checked ? "Oat" : "Whole";
                        }}
                      />
                      <Label
                        id={`${item}-milk-label`}
                        htmlFor={`${item}-milk-toggle`}
                        className="text-sm"
                      >
                        Whole
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${item}-temp-toggle`}
                        onCheckedChange={(checked) => {
                          const label = document.getElementById(
                            `${item}-temp-label`
                          );
                          if (label)
                            label.textContent = checked ? "Cold" : "Hot";
                        }}
                      />
                      <Label
                        id={`${item}-temp-label`}
                        htmlFor={`${item}-temp-toggle`}
                        className="text-sm"
                      >
                        Hot
                      </Label>
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => onAddItem(item, isBakeryItem)}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to Order
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );

    const renderBakeryItems = (items) => (
      <div className="space-y-8">
        {Object.entries(items).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryItems.map((item) => (
                <div
                  key={item}
                  className="flex flex-col justify-between bg-green-50 p-3 rounded-lg"
                >
                  <span className="font-medium mb-2">{item}</span>
                  <Button
                    variant="outline"
                    onClick={() => onAddItem(item, true)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add to Order
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h2>
        {Array.isArray(items) ? renderItems(items) : renderBakeryItems(items)}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 container mx-auto max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Order Management</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={handleAddOrder}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Order
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={handleToggleCompletedOrders}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            {showCompletedOrders ? "Current Orders" : "Completed Orders"}
          </Button>
        </div>
      </header>
      <main>
        {showCompletedOrders ? (
          <OrderQueue orders={completedOrders} title="Completed Order Queue" />
        ) : (
          <OrderQueue orders={pendingOrders} title="Current Order Queue" />
        )}
      </main>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] flex flex-col p-0 mx-auto">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <ScrollArea className="flex-grow px-6 py-4">
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="customerName" className="w-24">
                    Customer
                  </Label>
                  <Input
                    id="customerName"
                    value={editingOrder.customerName}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        customerName: e.target.value,
                      })
                    }
                    className="flex-grow"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={editingOrder.status}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        status: e.target.value,
                      })
                    }
                    className="col-span-3 p-2 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right mt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={editingOrder.notes}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        notes: e.target.value,
                      })
                    }
                    className="col-span-3 h-24"
                    placeholder="Add any special instructions or notes here..."
                  />
                </div>
                <Separator />
                <div className="space-y-6">
                  <MenuSection
                    title="Signature Lattes"
                    items={SIGNATURE_LATTES}
                    onAddItem={handleAddItem}
                    icon={<Coffee className="h-6 w-6" />}
                  />
                  <MenuSection
                    title="Classics"
                    items={CLASSICS}
                    onAddItem={handleAddItem}
                    icon={<Coffee className="h-6 w-6" />}
                  />
                  <MenuSection
                    title="Bakery"
                    items={BAKERY_ITEMS}
                    onAddItem={handleAddItem}
                    showOptions={false}
                    icon={<CakeSlice className="h-6 w-6" />}
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Current Order Items</h3>
                  {editingOrder.items.map((item, index) => {
                    const category = getItemCategory(item.name);
                    const bgColor = getCategoryColor(category);
                    return (
                      <Card key={index} className={`p-4 ${bgColor}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-grow grid gap-2">
                            <div className="font-medium">{item.name}</div>
                            <div className="flex items-center space-x-4">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateOrderItem(
                                    index,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20"
                              />
                              {item.milkOption !== "N/A" && (
                                <select
                                  value={item.milkOption}
                                  onChange={(e) =>
                                    handleUpdateOrderItem(
                                      index,
                                      "milkOption",
                                      e.target.value
                                    )
                                  }
                                  className="p-2 border rounded bg-white"
                                >
                                  <option value="Whole Milk">Whole Milk</option>
                                  <option value="Oat Milk">Oat Milk</option>
                                </select>
                              )}
                              {item.temperature !== "N/A" && (
                                <select
                                  value={item.temperature}
                                  onChange={(e) =>
                                    handleUpdateOrderItem(
                                      index,
                                      "temperature",
                                      e.target.value
                                    )
                                  }
                                  className="p-2 border rounded bg-white"
                                >
                                  <option value="Hot">Hot</option>
                                  <option value="Cold">Cold</option>
                                </select>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="px-6 py-4">
            <Button className="w-full sm:w-auto" onClick={handleSaveOrder}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[90vw] w-[95vw] h-[90vh] flex flex-col p-0 mx-auto">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            <div className="flex-grow md:w-2/3 p-6 overflow-y-auto">
              <div className="grid gap-6">
                <div className="flex items-center gap-4">
                  <Label htmlFor="newCustomerName" className="w-24">
                    Customer
                  </Label>
                  <Input
                    id="newCustomerName"
                    value={newOrder.customerName}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customerName: e.target.value })
                    }
                    className="flex-grow"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="newNotes" className="text-right mt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="newNotes"
                    value={newOrder.notes}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, notes: e.target.value })
                    }
                    className="col-span-3 h-24"
                    placeholder="Add any special instructions or notes here..."
                  />
                </div>
                <Separator />
                <div className="space-y-6">
                  <MenuSection
                    title="Signature Lattes"
                    items={SIGNATURE_LATTES}
                    onAddItem={handleAddNewOrderItem}
                    icon={<Coffee className="h-6 w-6" />}
                  />
                  <MenuSection
                    title="Classics"
                    items={CLASSICS}
                    onAddItem={handleAddNewOrderItem}
                    icon={<Coffee className="h-6 w-6" />}
                  />
                  <MenuSection
                    title="Bakery"
                    items={BAKERY_ITEMS}
                    onAddItem={handleAddNewOrderItem}
                    showOptions={false}
                    icon={<CakeSlice className="h-6 w-6" />}
                  />
                </div>
              </div>
            </div>
            <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-lg">Current Order</h3>
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                <div className="space-y-4">
                  {newOrder.items.map((item, index) => {
                    const category = getItemCategory(item.name);
                    const bgColor = getCategoryColor(category);
                    return (
                      <Card key={index} className={`p-4 ${bgColor}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            {item.milkOption !== "N/A" && (
                              <span className="text-sm text-gray-600 ml-2">
                                ({item.milkOption}, {item.temperature})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">
                              x{item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveNewOrderItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
              {newOrder.items.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-right font-semibold">
                    Total: $
                    {newOrder.items
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
              )}
              <DialogFooter className="px-6 py-4 border-t border-gray-200">
                <Button
                  className="w-full"
                  onClick={handleSaveNewOrder}
                  disabled={
                    newOrder.items.length === 0 || !newOrder.customerName
                  }
                >
                  Create Order
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this order?</p>
            {orderToDelete && (
              <p className="font-semibold mt-2">
                Order for: {orderToDelete.customerName}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
