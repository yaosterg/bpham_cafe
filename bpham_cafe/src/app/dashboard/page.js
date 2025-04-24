"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  PieChart,
  Package,
  Tag,
  MenuIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Settings,
  LogOut,
  Timer,
} from "lucide-react";
import { Quicksand } from "next/font/google";
import CoffeeDashboard from "./components/Dashboard";
import CategoriesManager from "./components/Categories";
import Ingredients from "./components/Ingredients";

// Initialize Quicksand font
const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

export default function BrianCoffeeDashboard() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard");
  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Sidebar items
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Coffee },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "ingredients", label: "Ingredient List", icon: Package },
    { id: "menu", label: "Menu Items", icon: MenuIcon },
    { id: "profits", label: "Profits", icon: PieChart },
    { id: "queue", label: "Queue", icon: Timer },
  ];

  return (
    <div
      className={`min-h-screen bg-[#FAF3E8] ${quicksand.variable}`}
      style={{ fontFamily: "var(--font-quicksand, sans-serif)" }}
    >
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <motion.aside
          className={`bg-white shadow-md min-h-screen ${
            sidebarCollapsed ? "w-20" : "w-64"
          } transition-all duration-300 ease-in-out relative`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md z-10"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#A67C52]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#A67C52]" />
            )}
          </button>

          {/* Logo and brand */}
          <div
            className={`flex items-center gap-2 p-6 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Coffee className="h-8 w-8 text-[#A67C52]" />
            {!sidebarCollapsed && (
              <span className="text-lg text-[#A67C52] tracking-tight font-medium">
                Brian Coffee
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div
              className={`mb-4 px-6 ${sidebarCollapsed ? "text-center" : ""}`}
            >
              <h3 className="text-[#7D6E63] text-xs uppercase tracking-wider">
                {!sidebarCollapsed && "Management"}
              </h3>
            </div>

            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                className={`flex items-center gap-3 w-full px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-[#E9DCC9] text-[#A67C52]"
                    : "text-[#7D6E63] hover:bg-[#FAF3E8]"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                onClick={() => handleTabChange(item.id)}
                whileHover={{ x: sidebarCollapsed ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5" />
                {!sidebarCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </motion.button>
            ))}

            {/* Logout at bottom */}
            <div className="absolute bottom-8 w-full">
              <motion.button
                className={`flex items-center gap-3 w-full px-6 py-3 text-left text-[#7D6E63] hover:bg-[#FAF3E8] transition-colors ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm">Logout</span>}
              </motion.button>
            </div>
          </nav>
        </motion.aside>

        {/* Main content - Empty placeholder */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              {activeTab === "dashboard" ? (
                <CoffeeDashboard />
              ) : activeTab === "categories" ? (
                <CategoriesManager />
              ) : activeTab === "ingredients" ? (
                <Ingredients />
              ) : (
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
                  <div className="bg-[#E9DCC9] p-4 rounded-full inline-block mb-4">
                    {(() => {
                      const Icon =
                        sidebarItems.find((item) => item.id === activeTab)
                          ?.icon || Coffee;
                      return <Icon className="h-8 w-8 text-[#A67C52]" />;
                    })()}
                  </div>
                  <h2 className="text-xl font-medium text-[#5C4738] mb-2">
                    {sidebarItems.find((item) => item.id === activeTab)
                      ?.label || "Dashboard"}
                  </h2>
                  <p className="text-[#7D6E63]">
                    This is a placeholder for the{" "}
                    {sidebarItems
                      .find((item) => item.id === activeTab)
                      ?.label.toLowerCase() || "dashboard"}{" "}
                    content.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
