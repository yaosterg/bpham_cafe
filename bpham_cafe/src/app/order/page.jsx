"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Coffee,
  ShoppingCart,
  Plus,
  Minus,
  X,
  CupSoda,
  Check,
  User,
  ConciergeBell,
  Feather,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  findAllCategories,
  selectAllCategories,
} from "@/store/reducers/categorySlice";
import { selectAllMenuItems, findAllItems } from "@/store/reducers/itemSlice";
import Image from "next/image";
import {
  completeOrder,
  createOrder,
  selectCreatedOrder,
} from "@/store/reducers/orderSlice";
import Link from "next/link";

const customStyles = `
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

export default function Order() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [checkoutState, setCheckoutState] = useState("browsing"); // browsing, processing, success
  const [customerName, setCustomerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);

  const createdOrder = useSelector(selectCreatedOrder);
  const categories = useSelector(selectAllCategories);
  const menuItems = useSelector(selectAllMenuItems);

  // Simulate loading and set default category
  useEffect(() => {
    const findCategories = async () => {
      await dispatch(findAllCategories());
      await dispatch(findAllItems());
    };
    findCategories();
    setLoading(false);
  }, []);

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Process checkout
  const processCheckout = async () => {
    setCheckoutState("processing");
    const orderDetails = {
      name: customerName,
      items: cart,
    };
    const result = await dispatch(createOrder(orderDetails));
    if (createOrder.fulfilled.match(result)) {
      setCheckoutState("success");
      setCart([]);
    } else {
      setCheckoutState("error");
    }
  };

  // Handle name submission
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim().length > 0) {
      setNameEntered(true);
    }
  };

  const initializeSelectedOptions = (item) => {
    const selectedOptions = {};
    return selectedOptions;
  };

  // Open customization modal
  const openCustomization = (item) => {
    setSelectedItem({
      ...item,
      notes: "",
      selectedOptions: initializeSelectedOptions(item),
    });
  };

  // Get option name by ID
  const getOptionNameById = (item, category, optionId) => {
    if (!item.options[category]) return "";
    const option = item.options[category].find((opt) => opt.id === optionId);
    return option ? option.name : "";
  };

  // Add item to cart with selected options
  const addToCart = (item, selectedOptions) => {
    const totalPrice = Number(item.price);
    // Create a unique ID based on the item and its options
    const optionsString = JSON.stringify(selectedOptions);
    const uniqueId = `${item.id}-${optionsString}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.uniqueId === uniqueId
      );

      if (existingItemIndex >= 0) {
        // Item with same options exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: item.id,
            uniqueId,
            name: item.name,
            price: item.price,
            quantity: 1,
            totalPrice,
            selectedOptions,
            imageURL: item.imageURL,
            notes: item.notes,
            categoryId: item.categoryId,
          },
        ];
      }
    });
    // Close the customization modal
    setSelectedItem(null);
  };

  // Remove item from cart
  const removeFromCart = (uniqueId) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.uniqueId === uniqueId
      );

      if (existingItemIndex >= 0 && prevCart[existingItemIndex].quantity > 1) {
        // Decrease quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity - 1,
        };
        return updatedCart;
      } else {
        // Remove item
        return prevCart.filter((item) => item.uniqueId !== uniqueId);
      }
    });
  };

  // Delete item from cart
  const deleteFromCart = (uniqueId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.uniqueId !== uniqueId)
    );
  };

  // Get item quantity in cart
  const getItemQuantityInCart = (itemId) => {
    return cart.reduce((total, cartItem) => {
      if (cartItem.id === itemId) {
        return total + cartItem.quantity;
      }
      return total;
    }, 0);
  };

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0
  );

  // Format options for display
  const formatSelectedOptions = (item, coffeeItem) => {
    if (!coffeeItem) return [];
    const formattedOptions = [];

    for (const [category, optionId] of Object.entries(item.selectedOptions)) {
      if (category === "extras" || category === "notes") continue; // Handle extras and notes separately
      const option = coffeeItem.options[category]?.find(
        (opt) => opt.id === optionId
      );
      if (option) {
        formattedOptions.push(`${category}: ${option.name}`);
      }
    }

    // Add notes if present
    if (
      item.selectedOptions.notes &&
      item.selectedOptions.notes.trim() !== ""
    ) {
      formattedOptions.push(`note: ${item.selectedOptions.notes}`);
    }

    return formattedOptions;
  };

  // Name input screen
  if (!loading && !nameEntered) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-amber-200">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <Coffee className="h-12 w-12 text-amber-800" />
            </div>
            <h1 className="font-bold text-3xl text-amber-900 text-center">
              Welcome to BP.HAM Popup#2
            </h1>
            <p className="text-amber-700 mt-5 text-center">
              Please remember to fill out your surveries.
            </p>
          </div>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-800">
                Your Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-amber-500" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name to proceed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-900 text-white py-6"
              disabled={customerName.trim().length === 0}
            >
              Continue to Menu
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Initial loading screen
  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-50">
        <div className="animate-pulse flex flex-col items-center">
          <Coffee className="h-24 w-24 text-amber-800 mb-4" />
          <div className="relative w-48 h-48">
            <div
              className="absolute inset-0 border-8 border-amber-800 rounded-full animate-[spin_3s_linear_infinite]"
              style={{ borderTopColor: "transparent" }}
            ></div>
            <div
              className="absolute inset-4 border-8 border-amber-600 rounded-full animate-[spin_2s_linear_infinite]"
              style={{ borderTopColor: "transparent" }}
            ></div>
            <div
              className="absolute inset-8 border-8 border-amber-400 rounded-full animate-[spin_1s_linear_infinite]"
              style={{ borderTopColor: "transparent" }}
            ></div>
          </div>
          <h1 className="text-3xl font-bold text-amber-800 mt-8">
            Brian Coffee
          </h1>
          <p className="text-amber-600 mt-2">Brewing your experience...</p>
          <div className="mt-6 flex space-x-2">
            <span className="animate-bounce delay-100 inline-block w-3 h-3 bg-amber-300 rounded-full"></span>
            <span className="animate-bounce delay-200 inline-block w-3 h-3 bg-amber-400 rounded-full"></span>
            <span className="animate-bounce delay-300 inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
          </div>
        </div>
      </div>
    );
  }

  // Checkout processing screen
  if (checkoutState === "processing") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-50">
        <div className="animate-pulse flex flex-col items-center">
          <Coffee className="h-24 w-24 text-amber-800 mb-4" />
          <div className="relative w-48 h-48">
            <div
              className="absolute inset-0 border-8 border-amber-800 rounded-full animate-[spin_3s_linear_infinite]"
              style={{ borderTopColor: "transparent" }}
            ></div>
            <div
              className="absolute inset-4 border-8 border-amber-600 rounded-full animate-[spin_2s_linear_infinite]"
              style={{ borderTopColor: "transparent" }}
            ></div>
            <div
              className="absolute inset-8 border-8 border-amber-400 rounded-full animate-[spin_1s_linear_infinite]"
              style={{ borderTopColor: "transparent" }}
            ></div>
          </div>
          <h1 className="text-3xl font-bold text-amber-800 mt-8">
            Processing Order
          </h1>
          <p className="text-amber-600 mt-2">
            Please wait while we process your order...
          </p>
          <div className="mt-6 flex space-x-2">
            <span className="animate-bounce delay-100 inline-block w-3 h-3 bg-amber-300 rounded-full"></span>
            <span className="animate-bounce delay-200 inline-block w-3 h-3 bg-amber-400 rounded-full"></span>
            <span className="animate-bounce delay-300 inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
          </div>
        </div>
      </div>
    );
  }

  // Thank you page
  if (checkoutState === "success") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center max-w-md text-center px-4">
          <div className="bg-amber-100 p-4 rounded-full mb-6">
            <Check className="h-16 w-16 text-amber-800" />
          </div>
          <h1 className="text-3xl font-bold text-amber-800 mb-4">
            Thank You, {createdOrder.name}!
          </h1>
          <p className="text-amber-700 mb-6">
            Your order has been successfully placed. We're preparing your drinks
            and will bring them to you as soon as they're ready!
          </p>
          <p className="text-amber-600 mb-8">
            Order #:{createdOrder.id + 1000}
          </p>
          <p className="text-amber-500 text-sm">
            Please refresh the page to place another order. Please remember to
            fill out your surveys!
          </p>
        </div>
      </div>
    );
  }

  if (checkoutState === "error") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center max-w-md text-center px-4">
          <div className="bg-amber-100 p-4 rounded-full mb-6">
            <Check className="h-16 w-16 text-amber-800" />
          </div>
          <h1 className="text-3xl font-bold text-amber-800 mb-4">
            I am so sorry, {customerName}!
          </h1>
          <p className="text-amber-700 mb-6">
            Your order has been errorly placed. This janky software ran into an
            issue while processing your order. Please try again or order with
            Yao directly!
          </p>
          <p className="text-amber-500 text-sm">
            Please refresh the page to place another order. Please remember to
            fill out your surveys!
          </p>
        </div>
      </div>
    );
  }

  const allOptionsSelected =
    selectedItem &&
    selectedItem.options &&
    Object.keys(selectedItem.options).every((optionType) => {
      if (
        optionType === "Foam" &&
        (!selectedItem.selectedOptions?.Temperature ||
          !selectedItem.selectedOptions?.Milk ||
          selectedItem.selectedOptions?.Temperature !== "cold" ||
          selectedItem.selectedOptions?.Milk !== "regular")
      ) {
        // Foam is not relevant, so skip requiring it
        return true;
      }

      return (
        selectedItem.selectedOptions &&
        selectedItem.selectedOptions[optionType] !== undefined &&
        selectedItem.selectedOptions[optionType] !== ""
      );
    });

  return (
    <div className="min-h-screen bg-amber-50 pb-20 font-sans">
      <style jsx>{customStyles}</style>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-amber-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full">
              <Link href="https://www.instagram.com/bp.hamlife/">
                <div className="relative group inline-block">
                  <Coffee className="text-foreground" />
                  <span className="absolute top-full left-1/2 mt-2 w-max -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Exposing Brian, Click me!
                  </span>
                </div>
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-bold">BP.HAM Popup</h1>
              <p className="text-xs text-amber-200">Welcome, {customerName}</p>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-2 hover:bg-amber-700"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-amber-50 border-l border-amber-200">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-amber-800 text-xl">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order
                </SheetTitle>
              </SheetHeader>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[70vh]">
                  <div className="bg-amber-100 p-8 rounded-full mb-4">
                    <ShoppingCart className="h-16 w-16 text-amber-300" />
                  </div>
                  <p className="text-amber-700 font-medium">
                    Your cart is empty
                  </p>
                  <p className="text-amber-500 text-sm mt-2">
                    Add some delicious drinks!
                  </p>
                </div>
              ) : (
                <div className="mt-8 flex flex-col h-[calc(100vh-12rem)]">
                  <div className="flex-1 overflow-auto">
                    {cart.map((item) => {
                      const coffeeItem = menuItems.find(
                        (coffee) => coffee.id === item.id
                      );
                      const formattedOptions = formatSelectedOptions(
                        item,
                        coffeeItem
                      );

                      return (
                        <div
                          key={item.uniqueId}
                          className="flex py-4 border-b border-amber-200 hover:bg-amber-100/50 rounded-lg px-2 transition-colors"
                        >
                          <div className="h-12 w-12 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-amber-200">
                            <img
                              src={
                                item.imageURL ||
                                "/placeholder.svg?height=48&width=48" ||
                                "/placeholder.svg"
                              }
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-amber-900 text-sm">
                              {item.name}
                            </h3>
                            {formattedOptions.map((option, idx) => (
                              <p key={idx} className="text-xs text-amber-700">
                                {option[0].toUpperCase() + option.slice(1)}
                              </p>
                            ))}
                            <p className="text-sm text-amber-800 mt-1 font-medium">
                              ${Number(item.price).toFixed(2)}
                            </p>
                            {item.notes && item.notes.length > 0 && (
                              <p className="text-xs text-amber-700 mt-1">
                                Notes: {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900 bg-transparent"
                              onClick={() => removeFromCart(item.uniqueId)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-amber-900 text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900 bg-transparent"
                              onClick={() =>
                                addToCart(coffeeItem, item.selectedOptions)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                              onClick={() => deleteFromCart(item.uniqueId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-amber-200 pt-4 mt-auto bg-amber-50/80 backdrop-blur-sm">
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-amber-800">
                        Subtotal
                      </span>
                      <span className="text-amber-900">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-amber-800">Tax</span>
                      <span className="text-amber-900">
                        ${(totalPrice * 0.08).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span className="text-amber-900">Total</span>
                      <span className="text-amber-900">
                        ${(totalPrice * 1.08).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className="w-full mt-4 bg-amber-800 hover:bg-amber-900 font-medium text-white py-6"
                      onClick={processCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-2 pb-4">
        {/* Category Tabs - Responsive and scrollable */}
        <div className="mb-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="sticky top-[72px] bg-amber-50 pb-3 pt-2 z-40 -mx-4 px-4">
              {/* Dynamic tab layout based on category count */}
              {categories.length <= 4 ? (
                // Grid layout for 4 or fewer categories
                <TabsList
                  className={`w-full bg-amber-100 p-1 gap-1 h-auto ${
                    categories.length === 1
                      ? "grid grid-cols-1"
                      : categories.length === 2
                      ? "grid grid-cols-2"
                      : categories.length === 3
                      ? "grid grid-cols-3"
                      : "grid grid-cols-4"
                  }`}
                >
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-white data-[state=active]:text-amber-800 rounded-md min-h-[60px] justify-center"
                    >
                      {category.category === "Bakery" ? (
                        <ConciergeBell className="h-4 w-4" />
                      ) : category.category === "Signature Latte" ? (
                        <CupSoda className="h-4 w-4" />
                      ) : category.category === "Classic Latte" ? (
                        <Coffee className="h-4 w-4" />
                      ) : (
                        <Feather className="h-4 w-4" />
                      )}
                      <span className="leading-tight text-center">
                        {category.category}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              ) : (
                // Horizontal scrollable layout for more than 4 categories
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide">
                    <TabsList className="inline-flex bg-amber-100 p-1 gap-2 h-auto min-w-full">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-white data-[state=active]:text-amber-800 rounded-md min-w-[80px] min-h-[60px] justify-center whitespace-nowrap flex-shrink-0"
                        >
                          {category.category === "Bakery" ? (
                            <ConciergeBell className="h-4 w-4" />
                          ) : category.category === "Signature Latte" ? (
                            <CupSoda className="h-4 w-4" />
                          ) : category.category === "Classic Latte" ? (
                            <Coffee className="h-4 w-4" />
                          ) : (
                            <Feather className="h-4 w-4" />
                          )}
                          <span className="leading-tight text-center">
                            {category.category}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  {/* Scroll indicators */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-50 to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-50 to-transparent pointer-events-none" />
                </div>
              )}
            </div>

            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => {
                      const itemQuantity = getItemQuantityInCart(item.id);
                      if (!item.menuStatus) return null;

                      return (
                        <Card
                          key={item.id}
                          className="overflow-hidden hover:shadow-xl transition-all duration-500 rounded-2xl border-0 bg-white shadow-lg hover:scale-[1.02] group relative"
                        >
                          {/* Image Container - Even taller for better portrait display */}
                          <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                            <img
                              src={
                                item.imageURL ||
                                "/placeholder.svg?height=384&width=400" ||
                                "/placeholder.svg"
                              }
                              alt={item.name}
                              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Quantity badge */}
                            {itemQuantity > 0 && (
                              <div className="absolute top-3 right-3 bg-amber-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
                                {itemQuantity}
                              </div>
                            )}

                            {/* Price badge */}
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-amber-800 px-3 py-1 rounded-full font-bold text-sm shadow-md border border-amber-200">
                              ${Number(item.price).toFixed(2)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="mb-3">
                              <h3 className="text-xl font-bold text-amber-900 mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-amber-600 text-sm leading-relaxed line-clamp-2 h-10">
                                {item.description}
                              </p>
                            </div>

                            {/* Action button */}
                            <Button
                              onClick={() => openCustomization(item)}
                              className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group/btn"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                Customize
                                {itemQuantity > 0 && (
                                  <Badge className="bg-amber-500 text-white border-0 px-2 py-0.5 text-xs">
                                    {itemQuantity} in cart
                                  </Badge>
                                )}
                              </span>
                              {/* Button shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            </Button>
                          </div>

                          {/* Card shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-16 w-16 rounded-full bg-amber-800 hover:bg-amber-900 shadow-lg flex items-center justify-center">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white">
                    {totalItems}
                  </Badge>
                )}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[80vh] bg-amber-50 rounded-t-xl"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-amber-800 text-xl">
                <ShoppingCart className="h-5 w-5" />
                Your Order
              </SheetTitle>
            </SheetHeader>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="bg-amber-100 p-8 rounded-full mb-4">
                  <ShoppingCart className="h-16 w-16 text-amber-300" />
                </div>
                <p className="text-amber-700 font-medium">Your cart is empty</p>
                <p className="text-amber-500 text-sm mt-2">
                  Add some delicious drinks!
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-col h-[calc(80vh-8rem)]">
                <div className="flex-1 overflow-auto">
                  {cart.map((item) => {
                    const coffeeItem = menuItems.find(
                      (coffee) => coffee.id === item.id
                    );
                    const formattedOptions = formatSelectedOptions(
                      item,
                      coffeeItem
                    );

                    return (
                      <div
                        key={item.uniqueId}
                        className="flex py-4 border-b border-amber-200 hover:bg-amber-100/50 rounded-lg px-2 transition-colors"
                      >
                        <div className="h-12 w-12 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-amber-200">
                          <img
                            src={
                              item.imageURL ||
                              "/placeholder.svg?height=48&width=48" ||
                              "/placeholder.svg"
                            }
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-amber-900 text-sm">
                            {item.name}
                          </h3>
                          {formattedOptions.map((option, idx) => (
                            <p key={idx} className="text-xs text-amber-700">
                              {option}
                            </p>
                          ))}
                          <p className="text-sm text-amber-800 mt-1 font-medium">
                            ${Number(item.price).toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900 bg-transparent"
                            onClick={() => removeFromCart(item.uniqueId)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-amber-900 text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900 bg-transparent"
                            onClick={() =>
                              addToCart(coffeeItem, item.selectedOptions)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                            onClick={() => deleteFromCart(item.uniqueId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-amber-200 pt-4 mt-auto bg-amber-50/80 backdrop-blur-sm">
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-amber-800">Subtotal</span>
                    <span className="text-amber-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-amber-800">Tax</span>
                    <span className="text-amber-900">
                      ${(totalPrice * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span className="text-amber-900">Total</span>
                    <span className="text-amber-900">
                      ${(totalPrice * 1.08).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-4 bg-amber-800 hover:bg-amber-900 font-medium text-white py-6"
                    onClick={processCheckout}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Customization Modal - Completely redesigned to fit all screen sizes */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white w-full max-w-lg max-h-[96vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col">
            {/* Header with Image - Responsive sizing */}
            <div className="relative flex-shrink-0">
              <div className="h-32 sm:h-40 w-full overflow-hidden bg-gradient-to-br from-amber-100 via-amber-200 to-orange-200">
                <img
                  src={
                    selectedItem.imageURL ||
                    "/placeholder.svg?height=160&width=400" ||
                    "/placeholder.svg"
                  }
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Close button - Large and easy to tap */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 shadow-lg border-0 flex items-center justify-center transition-all duration-200 active:scale-95"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Product info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                <h2 className="text-lg sm:text-xl font-bold mb-1 drop-shadow-lg">
                  {selectedItem.name}
                </h2>
                <p className="text-white/90 text-sm drop-shadow-md line-clamp-2">
                  {selectedItem.description}
                </p>
              </div>
            </div>

            {/* Scrollable Content - Optimized for small screens */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="space-y-4 sm:space-y-6">
                {/* Options */}
                {selectedItem.options &&
                Object.keys(selectedItem.options).length > 0 ? (
                  Object.entries(selectedItem.options).map(
                    ([optionType, optionValues]) => {
                      if (!optionValues || optionValues.length === 0)
                        return null;

                      if (
                        optionType === "Foam" &&
                        (!selectedItem.selectedOptions?.Temperature || // no temperature chosen
                          !selectedItem.selectedOptions?.Milk || // no milk chosen
                          selectedItem.selectedOptions?.Temperature !==
                            "cold" || // not Cold
                          selectedItem.selectedOptions?.Milk !== "regular") // not Dairy
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={optionType}
                          className="space-y-2 sm:space-y-3"
                        >
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
                            Choose{" "}
                            {optionType.charAt(0).toUpperCase() +
                              optionType.slice(1)}
                          </h3>

                          <RadioGroup
                            value={
                              selectedItem.selectedOptions?.[optionType] || ""
                            }
                            onValueChange={(value) => {
                              console.log(selectedItem.selectedOptions);
                              if (!selectedItem.selectedOptions) return;
                              setSelectedItem({
                                ...selectedItem,
                                selectedOptions: {
                                  ...selectedItem.selectedOptions,
                                  [optionType]: value,
                                },
                              });
                            }}
                            className="space-y-2"
                          >
                            {optionValues.map((option) => (
                              <label
                                key={option.id}
                                htmlFor={`${optionType}-${option.id}`}
                                className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all duration-200 cursor-pointer group active:scale-[0.98] min-h-[56px]"
                              >
                                <RadioGroupItem
                                  value={option.id}
                                  id={`${optionType}-${option.id}`}
                                  className="text-amber-600 border-2 border-gray-300 data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600 h-5 w-5"
                                />
                                <div className="flex-1 flex justify-between items-center min-w-0">
                                  <span className="text-gray-800 font-medium cursor-pointer group-hover:text-amber-700 transition-colors text-sm sm:text-base">
                                    {option.name}
                                  </span>
                                  {option.price > 0 && (
                                    <span className="text-amber-600 font-semibold text-xs sm:text-sm bg-amber-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                      +${option.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </RadioGroup>
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                    </div>
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      Ready to order as-is!
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      No customization needed for this item.
                    </p>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
                    Special Instructions
                  </h3>
                  <div className="relative">
                    <textarea
                      className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-gray-100 focus:border-amber-300 focus:ring-0 focus:outline-none resize-none transition-colors bg-gray-50/50 hover:bg-white hover:border-gray-200 text-sm sm:text-base"
                      placeholder="Any special requests? (e.g., extra hot, light foam, etc.)"
                      rows={3}
                      value={selectedItem.notes || ""}
                      onChange={(e) => {
                        setSelectedItem({
                          ...selectedItem,
                          notes: e.target.value,
                        });
                      }}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {(selectedItem.notes || "").length}/150
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer - Always visible and properly sized */}
            <div className="flex-shrink-0 p-3 sm:p-4 bg-gray-50/50 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Total Price
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${Number(selectedItem.price).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Tax included</p>
                  <p className="text-xs sm:text-sm text-amber-600 font-medium">
                    Ready in 5-10 min
                  </p>
                </div>
              </div>

              <Button
                onClick={() =>
                  addToCart(selectedItem, selectedItem.selectedOptions)
                }
                disabled={!allOptionsSelected}
                className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                  allOptionsSelected
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-[0.98]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {allOptionsSelected ? (
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    Add to Cart
                  </span>
                ) : (
                  "Please select all options"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
