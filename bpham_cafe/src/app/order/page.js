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

export default function Order() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("espresso-drinks");
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkoutState, setCheckoutState] = useState("browsing"); // browsing, processing, success
  const [customerName, setCustomerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);
  const categories = useSelector(selectAllCategories);

  // Simulate loading
  useEffect(() => {
    const findCategories = async () => {
      await dispatch(findAllCategories());
    };
    findCategories();
    setLoading(false);
  }, []);

  // Process checkout
  const processCheckout = () => {
    setCheckoutState("processing");

    // Simulate processing time
    setTimeout(() => {
      setCheckoutState("success");
      // Clear cart after successful checkout
      setCart([]);
    }, 2000);
  };

  // Handle name submission
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (customerName.trim().length > 0) {
      setNameEntered(true);
    }
  };

  const coffeeItems = [
    {
      id: 1,
      name: "Espresso",
      description: "Strong, concentrated coffee served in a small cup",
      price: 3.5,
      image: "/rich-espresso-pour.png",
      category: "espresso-drinks",
      options: {
        size: [
          { id: "single", name: "Single", price: 0 },
          { id: "double", name: "Double", price: 1.5 },
          { id: "triple", name: "Triple", price: 2.5 },
        ],
        extras: [
          { id: "extra-hot", name: "Extra Hot", price: 0 },
          { id: "ristretto", name: "Ristretto Style", price: 0 },
        ],
      },
    },
    {
      id: 2,
      name: "Cappuccino",
      description: "Equal parts espresso, steamed milk, and milk foam",
      price: 4.5,
      image: "/frothy-cappuccino.png",
      category: "espresso-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "whole", name: "Whole Milk", price: 0 },
          { id: "skim", name: "Skim Milk", price: 0 },
          { id: "almond", name: "Almond Milk", price: 0.75 },
          { id: "oat", name: "Oat Milk", price: 0.75 },
        ],
        extras: [
          { id: "extra-shot", name: "Extra Shot", price: 1 },
          { id: "extra-foam", name: "Extra Foam", price: 0 },
        ],
      },
    },
    {
      id: 3,
      name: "Latte",
      description: "Espresso with steamed milk and a light layer of foam",
      price: 4.75,
      image: "/latte-art-heart.png",
      category: "espresso-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "whole", name: "Whole Milk", price: 0 },
          { id: "skim", name: "Skim Milk", price: 0 },
          { id: "almond", name: "Almond Milk", price: 0.75 },
          { id: "oat", name: "Oat Milk", price: 0.75 },
        ],
        flavor: [
          { id: "none", name: "None", price: 0 },
          { id: "vanilla", name: "Vanilla", price: 0.5 },
          { id: "caramel", name: "Caramel", price: 0.5 },
          { id: "hazelnut", name: "Hazelnut", price: 0.5 },
        ],
        extras: [{ id: "extra-shot", name: "Extra Shot", price: 1 }],
      },
    },
    {
      id: 4,
      name: "Mocha",
      description: "Espresso with chocolate, steamed milk, and whipped cream",
      price: 5.25,
      image: "/rich-coffee-mocha.png",
      category: "espresso-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "whole", name: "Whole Milk", price: 0 },
          { id: "skim", name: "Skim Milk", price: 0 },
          { id: "almond", name: "Almond Milk", price: 0.75 },
          { id: "oat", name: "Oat Milk", price: 0.75 },
        ],
        extras: [
          { id: "extra-shot", name: "Extra Shot", price: 1 },
          { id: "extra-chocolate", name: "Extra Chocolate", price: 0.5 },
          { id: "no-whip", name: "No Whipped Cream", price: 0 },
        ],
      },
    },
    {
      id: 5,
      name: "Cold Brew",
      description: "Coffee brewed with cold water for 12+ hours",
      price: 4.95,
      image: "/iced-coffee-refreshment.png",
      category: "cold-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "none", name: "None", price: 0 },
          { id: "whole", name: "Splash of Whole Milk", price: 0 },
          { id: "almond", name: "Splash of Almond Milk", price: 0.5 },
          { id: "oat", name: "Splash of Oat Milk", price: 0.5 },
        ],
        flavor: [
          { id: "none", name: "None", price: 0 },
          { id: "vanilla", name: "Vanilla", price: 0.5 },
          { id: "caramel", name: "Caramel", price: 0.5 },
        ],
      },
    },
    {
      id: 6,
      name: "Americano",
      description: "Espresso diluted with hot water",
      price: 3.75,
      image: "/classic-americano.png",
      category: "espresso-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        extras: [
          { id: "extra-shot", name: "Extra Shot", price: 1 },
          { id: "extra-hot", name: "Extra Hot", price: 0 },
        ],
      },
    },
    {
      id: 7,
      name: "Drip Coffee",
      description: "Traditional brewed coffee, fresh all day",
      price: 2.95,
      image: "/drip-coffee.png",
      category: "brewed-coffee",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        roast: [
          { id: "light", name: "Light Roast", price: 0 },
          { id: "medium", name: "Medium Roast", price: 0 },
          { id: "dark", name: "Dark Roast", price: 0 },
        ],
      },
    },
    {
      id: 8,
      name: "Pour Over",
      description: "Hand-poured coffee for maximum flavor extraction",
      price: 4.5,
      image: "/pour-over.png",
      category: "brewed-coffee",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        bean: [
          { id: "ethiopia", name: "Ethiopia", price: 0 },
          { id: "colombia", name: "Colombia", price: 0 },
          { id: "guatemala", name: "Guatemala", price: 0 },
        ],
      },
    },
    {
      id: 9,
      name: "Iced Latte",
      description: "Chilled espresso with cold milk over ice",
      price: 5.25,
      image: "/iced-latte.png",
      category: "cold-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "whole", name: "Whole Milk", price: 0 },
          { id: "skim", name: "Skim Milk", price: 0 },
          { id: "almond", name: "Almond Milk", price: 0.75 },
          { id: "oat", name: "Oat Milk", price: 0.75 },
        ],
        flavor: [
          { id: "none", name: "None", price: 0 },
          { id: "vanilla", name: "Vanilla", price: 0.5 },
          { id: "caramel", name: "Caramel", price: 0.5 },
          { id: "hazelnut", name: "Hazelnut", price: 0.5 },
        ],
      },
    },
    {
      id: 10,
      name: "Chai Latte",
      description: "Spiced tea concentrate with steamed milk",
      price: 4.95,
      image: "/chai-latte.png",
      category: "specialty",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "whole", name: "Whole Milk", price: 0 },
          { id: "skim", name: "Skim Milk", price: 0 },
          { id: "almond", name: "Almond Milk", price: 0.75 },
          { id: "oat", name: "Oat Milk", price: 0.75 },
        ],
        extras: [{ id: "extra-spicy", name: "Extra Spicy", price: 0.5 }],
      },
    },
    {
      id: 11,
      name: "Hot Chocolate",
      description: "Rich chocolate with steamed milk and whipped cream",
      price: 4.25,
      image: "/hot-chocolate.png",
      category: "specialty",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        milk: [
          { id: "whole", name: "Whole Milk", price: 0 },
          { id: "skim", name: "Skim Milk", price: 0 },
          { id: "almond", name: "Almond Milk", price: 0.75 },
          { id: "oat", name: "Oat Milk", price: 0.75 },
        ],
        extras: [
          { id: "extra-chocolate", name: "Extra Chocolate", price: 0.5 },
          { id: "no-whip", name: "No Whipped Cream", price: 0 },
        ],
      },
    },
    {
      id: 12,
      name: "Iced Tea",
      description: "Fresh brewed tea over ice",
      price: 3.5,
      image: "/iced-tea.png",
      category: "cold-drinks",
      options: {
        size: [
          { id: "small", name: "Small", price: 0 },
          { id: "medium", name: "Medium", price: 0.75 },
          { id: "large", name: "Large", price: 1.5 },
        ],
        type: [
          { id: "black", name: "Black Tea", price: 0 },
          { id: "green", name: "Green Tea", price: 0 },
          { id: "herbal", name: "Herbal Tea", price: 0 },
        ],
        sweetener: [
          { id: "none", name: "Unsweetened", price: 0 },
          { id: "simple", name: "Simple Syrup", price: 0.25 },
          { id: "honey", name: "Honey", price: 0.5 },
        ],
      },
    },
  ];

  // Initialize selected options for an item
  const initializeSelectedOptions = (item) => {
    const selectedOptions = {};

    for (const [category, options] of Object.entries(item.options)) {
      if (options.length > 0) {
        selectedOptions[category] = options[0].id;
      }
    }

    // For checkboxes (extras)
    if (item.options.extras) {
      selectedOptions.extras = [];
    }

    return selectedOptions;
  };

  // Open customization modal
  const openCustomization = (item) => {
    setSelectedItem({
      ...item,
      selectedOptions: initializeSelectedOptions(item),
    });
  };

  // Calculate additional price from options
  const calculateOptionsPrice = (item, selectedOptions) => {
    let additionalPrice = 0;

    for (const [category, optionId] of Object.entries(selectedOptions)) {
      if (category === "extras" || category === "notes") continue; // Handle extras separately

      const option = item.options[category]?.find((opt) => opt.id === optionId);
      if (option) {
        additionalPrice += option.price;
      }
    }

    // Add extras prices
    if (selectedOptions.extras && Array.isArray(selectedOptions.extras)) {
      for (const extraId of selectedOptions.extras) {
        const extra = item.options.extras?.find((opt) => opt.id === extraId);
        if (extra) {
          additionalPrice += extra.price;
        }
      }
    }

    return additionalPrice;
  };

  // Get option name by ID
  const getOptionNameById = (item, category, optionId) => {
    if (!item.options[category]) return "";
    const option = item.options[category].find((opt) => opt.id === optionId);
    return option ? option.name : "";
  };

  // Add item to cart with selected options
  const addToCart = (item, selectedOptions) => {
    const additionalPrice = calculateOptionsPrice(item, selectedOptions);
    const totalPrice = item.price + additionalPrice;

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
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: item.id,
            uniqueId,
            name: item.name,
            basePrice: item.price,
            totalPrice,
            quantity: 1,
            selectedOptions,
            image: item.image,
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
        updatedCart[existingItemIndex].quantity -= 1;
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

    // Add extras
    if (
      item.selectedOptions.extras &&
      Array.isArray(item.selectedOptions.extras) &&
      item.selectedOptions.extras.length > 0
    ) {
      const extrasNames = item.selectedOptions.extras
        .map((extraId) => {
          const extra = coffeeItem.options.extras?.find(
            (opt) => opt.id === extraId
          );
          return extra ? extra.name : "";
        })
        .filter((name) => name);

      if (extrasNames.length > 0) {
        formattedOptions.push(`extras: ${extrasNames.join(", ")}`);
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

  // Toggle extra option
  const toggleExtraOption = (extraId) => {
    if (!selectedItem) return;

    setSelectedItem((prev) => {
      const updatedOptions = { ...prev.selectedOptions };

      if (!updatedOptions.extras) {
        updatedOptions.extras = [];
      }

      if (updatedOptions.extras.includes(extraId)) {
        updatedOptions.extras = updatedOptions.extras.filter(
          (id) => id !== extraId
        );
      } else {
        updatedOptions.extras = [...updatedOptions.extras, extraId];
      }

      return {
        ...prev,
        selectedOptions: updatedOptions,
      };
    });
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
            <h1 className="text-2xl font-bold text-amber-900 text-center">
              Welcome to Brian Coffee
            </h1>
            <p className="text-amber-700 mt-2 text-center">
              Please enter your name to continue
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
                  placeholder="Enter your name"
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
            Thank You, {customerName}!
          </h1>
          <p className="text-amber-700 mb-6">
            Your order has been successfully placed. We're preparing your drinks
            and they'll be ready soon!
          </p>
          <p className="text-amber-600 mb-8">
            Order #:{" "}
            {Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}
          </p>
          <p className="text-amber-500 text-sm">
            Please refresh the page to place another order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-amber-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-full">
              <Coffee className="h-6 w-6 text-amber-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Brian Coffee</h1>
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
                      const coffeeItem = coffeeItems.find(
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
                          <div className="h-16 w-16 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-amber-200">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-amber-900">
                              {item.name}
                            </h3>
                            {formattedOptions.map((option, idx) => (
                              <p key={idx} className="text-xs text-amber-700">
                                {option}
                              </p>
                            ))}
                            <p className="text-sm text-amber-800 mt-1 font-medium">
                              ${item.totalPrice.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                              onClick={() => removeFromCart(item.uniqueId)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium text-amber-900">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
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
      <main className="container mx-auto px-4 py-4">
        {/* Category Tabs */}
        <Tabs
          defaultValue={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-4"
        >
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-amber-100 rounded-lg">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-2 py-2 data-[state=active]:bg-white data-[state=active]:text-amber-800 rounded-md flex items-center justify-center gap-1.5 text-sm"
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
                <span className="truncate">{category.category}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coffeeItems
                  .filter((item) => item.category === category.id)
                  .map((item) => {
                    const itemQuantity = getItemQuantityInCart(item.id);

                    return (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-lg border-amber-200 hover:border-amber-300 group"
                      >
                        <div className="aspect-video bg-amber-100 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {itemQuantity > 0 && (
                            <div className="absolute top-2 right-2 bg-white text-amber-700 rounded-full h-8 w-8 flex items-center justify-center font-bold shadow-md border border-amber-200">
                              {itemQuantity}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-amber-900">
                              {item.name}
                            </h3>
                            <span className="font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-full text-sm">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-amber-700 text-sm mb-4">
                            {item.description}
                          </p>
                          <Button
                            onClick={() => openCustomization(item)}
                            className="w-full bg-amber-800 hover:bg-amber-900 rounded-md py-2 group-hover:shadow-md transition-all"
                          >
                            Customize
                            {itemQuantity > 0 && (
                              <Badge className="ml-2 bg-amber-600 text-white border-0">
                                {itemQuantity}
                              </Badge>
                            )}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
                    const coffeeItem = coffeeItems.find(
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
                        <div className="h-16 w-16 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-amber-200">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-amber-900">
                            {item.name}
                          </h3>
                          {formattedOptions.map((option, idx) => (
                            <p key={idx} className="text-xs text-amber-700">
                              {option}
                            </p>
                          ))}
                          <p className="text-sm text-amber-800 mt-1 font-medium">
                            ${item.totalPrice.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                            onClick={() => removeFromCart(item.uniqueId)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-amber-900">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
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

      {/* Customization Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto shadow-xl border border-amber-200">
            <div className="sticky top-0 z-10 bg-white p-4 border-b border-amber-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900">
                    {selectedItem.name}
                  </h3>
                  <p className="text-sm text-amber-600">
                    ${selectedItem.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedItem(null)}
                className="rounded-full hover:bg-amber-100 text-amber-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {/* Size Options */}
                {selectedItem.options.size && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-amber-900">
                      Choose Size
                    </h4>
                    <RadioGroup
                      value={selectedItem.selectedOptions.size}
                      onValueChange={(value) => {
                        setSelectedItem({
                          ...selectedItem,
                          selectedOptions: {
                            ...selectedItem.selectedOptions,
                            size: value,
                          },
                        });
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedItem.options.size.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.id}
                                id={`size-${option.id}`}
                                className="text-amber-700"
                              />
                              <Label
                                htmlFor={`size-${option.id}`}
                                className="text-amber-900 font-medium cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-amber-700 text-sm font-medium">
                                +${option.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Milk Options */}
                {selectedItem.options.milk && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-amber-900">
                      Choose Milk
                    </h4>
                    <RadioGroup
                      value={selectedItem.selectedOptions.milk}
                      onValueChange={(value) => {
                        setSelectedItem({
                          ...selectedItem,
                          selectedOptions: {
                            ...selectedItem.selectedOptions,
                            milk: value,
                          },
                        });
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedItem.options.milk.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.id}
                                id={`milk-${option.id}`}
                                className="text-amber-700"
                              />
                              <Label
                                htmlFor={`milk-${option.id}`}
                                className="text-amber-900 font-medium cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-amber-700 text-sm font-medium">
                                +${option.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Flavor Options */}
                {selectedItem.options.flavor && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-amber-900">
                      Choose Flavor
                    </h4>
                    <RadioGroup
                      value={selectedItem.selectedOptions.flavor}
                      onValueChange={(value) => {
                        setSelectedItem({
                          ...selectedItem,
                          selectedOptions: {
                            ...selectedItem.selectedOptions,
                            flavor: value,
                          },
                        });
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedItem.options.flavor.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.id}
                                id={`flavor-${option.id}`}
                                className="text-amber-700"
                              />
                              <Label
                                htmlFor={`flavor-${option.id}`}
                                className="text-amber-900 font-medium cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-amber-700 text-sm font-medium">
                                +${option.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Roast Options */}
                {selectedItem.options.roast && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-amber-900">
                      Choose Roast
                    </h4>
                    <RadioGroup
                      value={selectedItem.selectedOptions.roast}
                      onValueChange={(value) => {
                        setSelectedItem({
                          ...selectedItem,
                          selectedOptions: {
                            ...selectedItem.selectedOptions,
                            roast: value,
                          },
                        });
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedItem.options.roast.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.id}
                                id={`roast-${option.id}`}
                                className="text-amber-700"
                              />
                              <Label
                                htmlFor={`roast-${option.id}`}
                                className="text-amber-900 font-medium cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-amber-700 text-sm font-medium">
                                +${option.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Bean Options */}
                {selectedItem.options.bean && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-amber-900">
                      Choose Bean
                    </h4>
                    <RadioGroup
                      value={selectedItem.selectedOptions.bean}
                      onValueChange={(value) => {
                        setSelectedItem({
                          ...selectedItem,
                          selectedOptions: {
                            ...selectedItem.selectedOptions,
                            bean: value,
                          },
                        });
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedItem.options.bean.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={option.id}
                                id={`bean-${option.id}`}
                                className="text-amber-700"
                              />
                              <Label
                                htmlFor={`bean-${option.id}`}
                                className="text-amber-900 font-medium cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-amber-700 text-sm font-medium">
                                +${option.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Extras Options (Checkboxes) */}
                {selectedItem.options.extras && (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-amber-900">Extras</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedItem.options.extras.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`extra-${option.id}`}
                              checked={
                                selectedItem.selectedOptions.extras?.includes(
                                  option.id
                                ) || false
                              }
                              onCheckedChange={() =>
                                toggleExtraOption(option.id)
                              }
                              className="text-amber-700 border-amber-300"
                            />
                            <Label
                              htmlFor={`extra-${option.id}`}
                              className="text-amber-900 font-medium cursor-pointer"
                            >
                              {option.name}
                            </Label>
                          </div>
                          {option.price > 0 && (
                            <span className="text-amber-700 text-sm font-medium">
                              +${option.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes for Barista */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 text-amber-900">
                    Special Instructions
                  </h4>
                  <textarea
                    className="w-full p-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Any special requests for the barista? (e.g., extra hot, light ice, etc.)"
                    rows={3}
                    value={selectedItem.selectedOptions.notes || ""}
                    onChange={(e) => {
                      setSelectedItem({
                        ...selectedItem,
                        selectedOptions: {
                          ...selectedItem.selectedOptions,
                          notes: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t border-amber-100">
                <div className="flex justify-between items-center bg-amber-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-amber-700">Total price</p>
                    <p className="text-xl font-bold text-amber-900">
                      $
                      {(
                        selectedItem.price +
                        calculateOptionsPrice(
                          selectedItem,
                          selectedItem.selectedOptions
                        )
                      ).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      addToCart(selectedItem, selectedItem.selectedOptions)
                    }
                    className="bg-amber-800 hover:bg-amber-900 rounded-md px-6 py-6"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
