"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  PieChart,
  Package,
  Tag,
  MenuIcon,
  Search,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import { Quicksand } from "next/font/google";

// Initialize Quicksand font
const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
});

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Sample data
const initialCategories = [
  { id: 1, name: "Hot Coffee", description: "Warm coffee beverages" },
  { id: 2, name: "Cold Coffee", description: "Iced and cold brew coffee" },
  { id: 3, name: "Tea", description: "Various tea options" },
  { id: 4, name: "Pastries", description: "Fresh baked goods" },
  { id: 5, name: "Sandwiches", description: "Breakfast and lunch options" },
];

const initialIngredients = [
  {
    id: 1,
    name: "Coffee Beans (Arabica)",
    category: "Coffee",
    stock: 25,
    unit: "kg",
  },
  { id: 2, name: "Milk", category: "Dairy", stock: 40, unit: "L" },
  { id: 3, name: "Sugar", category: "Sweeteners", stock: 15, unit: "kg" },
  {
    id: 4,
    name: "Vanilla Syrup",
    category: "Syrups",
    stock: 8,
    unit: "bottles",
  },
  {
    id: 5,
    name: "Caramel Syrup",
    category: "Syrups",
    stock: 7,
    unit: "bottles",
  },
  {
    id: 6,
    name: "Chocolate Powder",
    category: "Powders",
    stock: 5,
    unit: "kg",
  },
  { id: 7, name: "Flour", category: "Baking", stock: 20, unit: "kg" },
  { id: 8, name: "Butter", category: "Dairy", stock: 10, unit: "kg" },
];

const initialMenuItems = [
  {
    id: 1,
    name: "Caramel Macchiato",
    category: "Hot Coffee",
    price: 4.5,
    cost: 1.25,
    description: "Espresso with caramel and steamed milk",
    ingredients: ["Coffee Beans (Arabica)", "Milk", "Caramel Syrup"],
  },
  {
    id: 2,
    name: "Iced Americano",
    category: "Cold Coffee",
    price: 3.75,
    cost: 0.85,
    description: "Espresso with cold water and ice",
    ingredients: ["Coffee Beans (Arabica)"],
  },
  {
    id: 3,
    name: "Matcha Latte",
    category: "Tea",
    price: 5.25,
    cost: 1.75,
    description: "Matcha green tea with steamed milk",
    ingredients: ["Matcha Powder", "Milk", "Sugar"],
  },
  {
    id: 4,
    name: "Croissant",
    category: "Pastries",
    price: 3.5,
    cost: 1.1,
    description: "Buttery, flaky pastry",
    ingredients: ["Flour", "Butter", "Sugar"],
  },
  {
    id: 5,
    name: "Avocado Toast",
    category: "Sandwiches",
    price: 7.95,
    cost: 2.85,
    description: "Sourdough toast with avocado, salt, and pepper",
    ingredients: ["Sourdough Bread", "Avocado", "Salt", "Pepper"],
  },
];

// Monthly sales data for charts
const monthlyData = [
  { month: "Jan", revenue: 12500, expenses: 8200, profit: 4300 },
  { month: "Feb", revenue: 13200, expenses: 8400, profit: 4800 },
  { month: "Mar", revenue: 14100, expenses: 8600, profit: 5500 },
  { month: "Apr", revenue: 15300, expenses: 9100, profit: 6200 },
  { month: "May", revenue: 16200, expenses: 9300, profit: 6900 },
  { month: "Jun", revenue: 17500, expenses: 9800, profit: 7700 },
];

// Category profit data
const categoryProfits = [
  { category: "Hot Coffee", profit: 3200 },
  { category: "Cold Coffee", profit: 2800 },
  { category: "Tea", profit: 1500 },
  { category: "Pastries", profit: 1900 },
  { category: "Sandwiches", profit: 2300 },
];

export default function Dashboard() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("categories");

  // State for form data
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [ingredientForm, setIngredientForm] = useState({
    name: "",
    category: "",
    stock: "",
    unit: "",
  });
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    description: "",
    ingredients: [],
  });

  // State for data
  const [categories, setCategories] = useState(initialCategories);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  // State for search
  const [categorySearch, setCategorySearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [menuItemSearch, setMenuItemSearch] = useState("");

  // State for edit mode
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  const [editingMenuItemId, setEditingMenuItemId] = useState(null);

  // State for ingredient selection in menu item form
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);

  // Refs for scrolling
  const categoryFormRef = useRef(null);
  const ingredientFormRef = useRef(null);
  const menuItemFormRef = useRef(null);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset edit modes when changing tabs
    setEditingCategoryId(null);
    setEditingIngredientId(null);
    setEditingMenuItemId(null);
  };

  // Filter functions
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      cat.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredIngredients = ingredients.filter(
    (ing) =>
      ing.name.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
      ing.category.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(menuItemSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuItemSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuItemSearch.toLowerCase())
  );

  // Form handlers
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategoryId) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategoryId ? { ...cat, ...categoryForm } : cat
        )
      );
      setEditingCategoryId(null);
    } else {
      // Add new category
      setCategories([
        ...categories,
        {
          id: categories.length
            ? Math.max(...categories.map((c) => c.id)) + 1
            : 1,
          ...categoryForm,
        },
      ]);
    }
    setCategoryForm({ name: "", description: "" });
  };

  const handleIngredientSubmit = (e) => {
    e.preventDefault();
    if (editingIngredientId) {
      // Update existing ingredient
      setIngredients(
        ingredients.map((ing) =>
          ing.id === editingIngredientId
            ? {
                ...ing,
                ...ingredientForm,
                stock: Number.parseFloat(ingredientForm.stock),
              }
            : ing
        )
      );
      setEditingIngredientId(null);
    } else {
      // Add new ingredient
      setIngredients([
        ...ingredients,
        {
          id: ingredients.length
            ? Math.max(...ingredients.map((i) => i.id)) + 1
            : 1,
          ...ingredientForm,
          stock: Number.parseFloat(ingredientForm.stock),
        },
      ]);
    }
    setIngredientForm({ name: "", category: "", stock: "", unit: "" });
  };

  const handleMenuItemSubmit = (e) => {
    e.preventDefault();
    const formattedItem = {
      ...menuItemForm,
      price: Number.parseFloat(menuItemForm.price),
      cost: Number.parseFloat(menuItemForm.cost),
    };

    if (editingMenuItemId) {
      // Update existing menu item
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingMenuItemId ? formattedItem : item
        )
      );
      setEditingMenuItemId(null);
    } else {
      // Add new menu item
      setMenuItems([
        ...menuItems,
        {
          id: menuItems.length
            ? Math.max(...menuItems.map((i) => i.id)) + 1
            : 1,
          ...formattedItem,
        },
      ]);
    }
    setMenuItemForm({
      name: "",
      category: "",
      price: "",
      cost: "",
      description: "",
      ingredients: [],
    });
  };

  // Delete handlers
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleDeleteIngredient = (id) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleDeleteMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  // Edit handlers
  const handleEditCategory = (category) => {
    setCategoryForm({ name: category.name, description: category.description });
    setEditingCategoryId(category.id);
    // Scroll to form
    if (categoryFormRef.current) {
      categoryFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEditIngredient = (ingredient) => {
    setIngredientForm({
      name: ingredient.name,
      category: ingredient.category,
      stock: ingredient.stock.toString(),
      unit: ingredient.unit,
    });
    setEditingIngredientId(ingredient.id);
    // Scroll to form
    if (ingredientFormRef.current) {
      ingredientFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEditMenuItem = (item) => {
    setMenuItemForm({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      cost: item.cost.toString(),
      description: item.description,
      ingredients: item.ingredients,
    });
    setEditingMenuItemId(item.id);
    // Scroll to form
    if (menuItemFormRef.current) {
      menuItemFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Ingredient selection handlers
  const toggleIngredientSelection = (ingredient) => {
    const ingredients = [...menuItemForm.ingredients];
    const index = ingredients.indexOf(ingredient);

    if (index === -1) {
      ingredients.push(ingredient);
    } else {
      ingredients.splice(index, 1);
    }

    setMenuItemForm({ ...menuItemForm, ingredients });
  };

  const removeIngredient = (ingredient) => {
    const ingredients = menuItemForm.ingredients.filter(
      (ing) => ing !== ingredient
    );
    setMenuItemForm({ ...menuItemForm, ingredients });
  };

  // Calculate financial metrics
  const totalRevenue = monthlyData.reduce(
    (sum, month) => sum + month.revenue,
    0
  );
  const totalExpenses = monthlyData.reduce(
    (sum, month) => sum + month.expenses,
    0
  );
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  // Calculate most profitable items
  const profitableItems = [...menuItems]
    .map((item) => ({
      ...item,
      profit: item.price - item.cost,
      margin: ((item.price - item.cost) / item.price) * 100,
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  // Simple bar chart component
  const BarChart = ({
    data,
    valueKey,
    labelKey,
    height = 200,
    barColor = "#A67C52",
  }) => {
    const maxValue = Math.max(...data.map((item) => item[valueKey]));

    return (
      <div className="w-full mt-4">
        <div className="flex h-[200px] items-end space-x-2">
          {data.map((item, index) => {
            const barHeight = (item[valueKey] / maxValue) * height;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full group">
                  <motion.div
                    className="w-full bg-[#E9DCC9] rounded-lg relative"
                    initial={{ height: 0 }}
                    animate={{ height: barHeight }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-[#A67C52] rounded-lg opacity-80"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#5C4738] text-white px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${item[valueKey].toLocaleString()}
                    </div>
                  </motion.div>
                </div>
                <div
                  className="text-xs text-[#7D6E63] mt-2 truncate max-w-full"
                  title={item[labelKey]}
                >
                  {item[labelKey]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Line chart component
  const LineChart = ({ data }) => {
    const maxValue = Math.max(
      ...data.map((item) => Math.max(item.revenue, item.expenses, item.profit))
    );
    const chartHeight = 200;

    // Calculate point positions
    const getPoints = (dataKey) => {
      return data
        .map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item[dataKey] / maxValue) * 100;
          return `${x},${y}`;
        })
        .join(" ");
    };

    const revenuePoints = getPoints("revenue");
    const expensesPoints = getPoints("expenses");
    const profitPoints = getPoints("profit");

    return (
      <div className="w-full h-[250px] mt-4">
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Y-axis */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={chartHeight}
            stroke="#E9DCC9"
            strokeWidth="1"
          />

          {/* X-axis */}
          <line
            x1="0"
            y1={chartHeight}
            x2="100%"
            y2={chartHeight}
            stroke="#E9DCC9"
            strokeWidth="1"
          />

          {/* Revenue line */}
          <motion.polyline
            points={revenuePoints}
            fill="none"
            stroke="#A67C52"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Expenses line */}
          <motion.polyline
            points={expensesPoints}
            fill="none"
            stroke="#E9DCC9"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Profit line */}
          <motion.polyline
            points={profitPoints}
            fill="none"
            stroke="#5C4738"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points - Revenue */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100 + "%";
            const y = 100 - (item.revenue / maxValue) * 100 + "%";

            return (
              <motion.circle
                key={`revenue-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#A67C52"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
              />
            );
          })}

          {/* Data points - Expenses */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100 + "%";
            const y = 100 - (item.expenses / maxValue) * 100 + "%";

            return (
              <motion.circle
                key={`expenses-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#E9DCC9"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
              />
            );
          })}

          {/* Data points - Profit */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100 + "%";
            const y = 100 - (item.profit / maxValue) * 100 + "%";

            return (
              <motion.circle
                key={`profit-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#5C4738"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.6 + index * 0.1 }}
              />
            );
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100 + "%";

            return (
              <text
                key={`label-${index}`}
                x={x}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#7D6E63"
              >
                {item.month}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center mt-6 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#A67C52] mr-2"></div>
            <span className="text-xs text-[#7D6E63]">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#E9DCC9] mr-2"></div>
            <span className="text-xs text-[#7D6E63]">Expenses</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#5C4738] mr-2"></div>
            <span className="text-xs text-[#7D6E63]">Profit</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#FAF3E8] ${quicksand.variable}`}
      style={{ fontFamily: "var(--font-quicksand, sans-serif)" }}
    >
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <motion.aside
          className="w-full md:w-64 bg-white shadow-md md:min-h-screen p-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Coffee className="h-5 w-5 text-[#A67C52]" />
            <span className="text-lg text-[#A67C52] tracking-tight font-medium">
              Brian Coffee
            </span>
          </div>

          <nav className="space-y-2">
            <h3 className="text-[#7D6E63] text-xs uppercase tracking-wider mb-4">
              Management
            </h3>

            {[
              { id: "categories", label: "Categories", icon: Tag },
              { id: "ingredients", label: "Ingredient List", icon: Package },
              { id: "menuItems", label: "Menu Items", icon: MenuIcon },
              { id: "profits", label: "Profits", icon: PieChart },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#E9DCC9] text-[#A67C52]"
                    : "text-[#7D6E63] hover:bg-[#FAF3E8]"
                }`}
                onClick={() => handleTabChange(tab.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {/* Categories Tab */}
            {activeTab === "categories" && (
              <motion.div
                key="categories"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-medium text-[#5C4738]">
                    Categories
                  </h1>
                </div>

                {/* Add/Edit Category Form */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                  ref={categoryFormRef}
                >
                  <h2 className="text-lg font-medium text-[#5C4738] mb-4">
                    {editingCategoryId ? "Edit Category" : "Add New Category"}
                  </h2>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="categoryName"
                        className="block text-sm text-[#7D6E63] mb-1"
                      >
                        Category Name
                      </label>
                      <input
                        id="categoryName"
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="categoryDescription"
                        className="block text-sm text-[#7D6E63] mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id="categoryDescription"
                        value={categoryForm.description}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        rows="3"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#A67C52] text-white rounded-xl hover:bg-[#8A6642] transition-colors"
                      >
                        {editingCategoryId ? "Update Category" : "Add Category"}
                      </button>
                      {editingCategoryId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(null);
                            setCategoryForm({ name: "", description: "" });
                          }}
                          className="px-4 py-2 bg-[#E9DCC9] text-[#7D6E63] rounded-xl hover:bg-[#d8cbb8] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>

                {/* Categories List */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-[#5C4738]">
                      All Categories
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7D6E63]" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52] text-sm"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E9DCC9]">
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Description
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <motion.tr
                              key={category.id}
                              className="border-b border-[#E9DCC9] hover:bg-[#FAF3E8]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ backgroundColor: "#FAF3E8" }}
                            >
                              <td className="py-3 px-4 text-[#5C4738]">
                                {category.name}
                              </td>
                              <td className="py-3 px-4 text-[#7D6E63]">
                                {category.description}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleEditCategory(category)}
                                    className="p-1 text-[#A67C52] hover:text-[#8A6642]"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteCategory(category.id)
                                    }
                                    className="p-1 text-[#E9DCC9] hover:text-[#d8cbb8] bg-[#A67C52] rounded-full"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-4 text-center text-[#7D6E63]"
                            >
                              No categories found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Ingredients Tab */}
            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-medium text-[#5C4738]">
                    Ingredient List
                  </h1>
                </div>

                {/* Add/Edit Ingredient Form */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                  ref={ingredientFormRef}
                >
                  <h2 className="text-lg font-medium text-[#5C4738] mb-4">
                    {editingIngredientId
                      ? "Edit Ingredient"
                      : "Add New Ingredient"}
                  </h2>
                  <form onSubmit={handleIngredientSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="ingredientName"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Ingredient Name
                        </label>
                        <input
                          id="ingredientName"
                          type="text"
                          value={ingredientForm.name}
                          onChange={(e) =>
                            setIngredientForm({
                              ...ingredientForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ingredientCategory"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Category
                        </label>
                        <input
                          id="ingredientCategory"
                          type="text"
                          value={ingredientForm.category}
                          onChange={(e) =>
                            setIngredientForm({
                              ...ingredientForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ingredientStock"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Stock Amount
                        </label>
                        <input
                          id="ingredientStock"
                          type="number"
                          min="0"
                          step="0.01"
                          value={ingredientForm.stock}
                          onChange={(e) =>
                            setIngredientForm({
                              ...ingredientForm,
                              stock: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ingredientUnit"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Unit
                        </label>
                        <input
                          id="ingredientUnit"
                          type="text"
                          value={ingredientForm.unit}
                          onChange={(e) =>
                            setIngredientForm({
                              ...ingredientForm,
                              unit: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#A67C52] text-white rounded-xl hover:bg-[#8A6642] transition-colors"
                      >
                        {editingIngredientId
                          ? "Update Ingredient"
                          : "Add Ingredient"}
                      </button>
                      {editingIngredientId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIngredientId(null);
                            setIngredientForm({
                              name: "",
                              category: "",
                              stock: "",
                              unit: "",
                            });
                          }}
                          className="px-4 py-2 bg-[#E9DCC9] text-[#7D6E63] rounded-xl hover:bg-[#d8cbb8] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>

                {/* Ingredients List */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-[#5C4738]">
                      All Ingredients
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7D6E63]" />
                      <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52] text-sm"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E9DCC9]">
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Category
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Stock
                          </th>
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Unit
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIngredients.length > 0 ? (
                          filteredIngredients.map((ingredient) => (
                            <motion.tr
                              key={ingredient.id}
                              className="border-b border-[#E9DCC9] hover:bg-[#FAF3E8]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ backgroundColor: "#FAF3E8" }}
                            >
                              <td className="py-3 px-4 text-[#5C4738]">
                                {ingredient.name}
                              </td>
                              <td className="py-3 px-4 text-[#7D6E63]">
                                {ingredient.category}
                              </td>
                              <td className="py-3 px-4 text-right text-[#5C4738]">
                                {ingredient.stock}
                              </td>
                              <td className="py-3 px-4 text-[#7D6E63]">
                                {ingredient.unit}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      handleEditIngredient(ingredient)
                                    }
                                    className="p-1 text-[#A67C52] hover:text-[#8A6642]"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteIngredient(ingredient.id)
                                    }
                                    className="p-1 text-[#E9DCC9] hover:text-[#d8cbb8] bg-[#A67C52] rounded-full"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="py-4 text-center text-[#7D6E63]"
                            >
                              No ingredients found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Menu Items Tab */}
            {activeTab === "menuItems" && (
              <motion.div
                key="menuItems"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-medium text-[#5C4738]">
                    Menu Items
                  </h1>
                </div>

                {/* Add/Edit Menu Item Form */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                  ref={menuItemFormRef}
                >
                  <h2 className="text-lg font-medium text-[#5C4738] mb-4">
                    {editingMenuItemId ? "Edit Menu Item" : "Add New Menu Item"}
                  </h2>
                  <form onSubmit={handleMenuItemSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="menuItemName"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Item Name
                        </label>
                        <input
                          id="menuItemName"
                          type="text"
                          value={menuItemForm.name}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="menuItemCategory"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Category
                        </label>
                        <select
                          id="menuItemCategory"
                          value={menuItemForm.category}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="menuItemPrice"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Price ($)
                        </label>
                        <input
                          id="menuItemPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={menuItemForm.price}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              price: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="menuItemCost"
                          className="block text-sm text-[#7D6E63] mb-1"
                        >
                          Cost ($)
                        </label>
                        <input
                          id="menuItemCost"
                          type="number"
                          min="0"
                          step="0.01"
                          value={menuItemForm.cost}
                          onChange={(e) =>
                            setMenuItemForm({
                              ...menuItemForm,
                              cost: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="menuItemDescription"
                        className="block text-sm text-[#7D6E63] mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id="menuItemDescription"
                        value={menuItemForm.description}
                        onChange={(e) =>
                          setMenuItemForm({
                            ...menuItemForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52]"
                        rows="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#7D6E63] mb-1">
                        Ingredients
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setShowIngredientDropdown(!showIngredientDropdown)
                          }
                          className="w-full px-3 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52] text-left flex justify-between items-center"
                        >
                          <span className="text-[#7D6E63]">
                            {menuItemForm.ingredients.length > 0
                              ? `${menuItemForm.ingredients.length} ingredients selected`
                              : "Select ingredients"}
                          </span>
                          {showIngredientDropdown ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {showIngredientDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-[#E9DCC9] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {ingredients.map((ingredient) => (
                              <div
                                key={ingredient.id}
                                className="px-3 py-2 hover:bg-[#FAF3E8] cursor-pointer flex items-center"
                                onClick={() =>
                                  toggleIngredientSelection(ingredient.name)
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={menuItemForm.ingredients.includes(
                                    ingredient.name
                                  )}
                                  onChange={() => {}}
                                  className="mr-2"
                                />
                                <span>{ingredient.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {menuItemForm.ingredients.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {menuItemForm.ingredients.map((ingredient) => (
                            <div
                              key={ingredient}
                              className="bg-[#E9DCC9] text-[#7D6E63] px-2 py-1 rounded-full text-xs flex items-center"
                            >
                              {ingredient}
                              <button
                                type="button"
                                onClick={() => removeIngredient(ingredient)}
                                className="ml-1 text-[#A67C52] hover:text-[#8A6642]"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#A67C52] text-white rounded-xl hover:bg-[#8A6642] transition-colors"
                      >
                        {editingMenuItemId
                          ? "Update Menu Item"
                          : "Add Menu Item"}
                      </button>
                      {editingMenuItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMenuItemId(null);
                            setMenuItemForm({
                              name: "",
                              category: "",
                              price: "",
                              cost: "",
                              description: "",
                              ingredients: [],
                            });
                          }}
                          className="px-4 py-2 bg-[#E9DCC9] text-[#7D6E63] rounded-xl hover:bg-[#d8cbb8] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>

                {/* Menu Items List */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-[#5C4738]">
                      All Menu Items
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7D6E63]" />
                      <input
                        type="text"
                        placeholder="Search menu items..."
                        value={menuItemSearch}
                        onChange={(e) => setMenuItemSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-[#E9DCC9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A67C52] text-sm"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E9DCC9]">
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                            Category
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Price
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Cost
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Profit
                          </th>
                          <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMenuItems.length > 0 ? (
                          filteredMenuItems.map((item) => {
                            const profit = item.price - item.cost;
                            const margin = (profit / item.price) * 100;

                            return (
                              <motion.tr
                                key={item.id}
                                className="border-b border-[#E9DCC9] hover:bg-[#FAF3E8]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ backgroundColor: "#FAF3E8" }}
                              >
                                <td className="py-3 px-4 text-[#5C4738]">
                                  <div>{item.name}</div>
                                  <div className="text-xs text-[#7D6E63] mt-1">
                                    {item.description}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-[#7D6E63]">
                                  {item.category}
                                </td>
                                <td className="py-3 px-4 text-right text-[#5C4738]">
                                  ${item.price.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-right text-[#7D6E63]">
                                  ${item.cost.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="text-[#5C4738]">
                                    ${profit.toFixed(2)}
                                  </div>
                                  <div className="text-xs text-[#7D6E63]">
                                    {margin.toFixed(1)}% margin
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => handleEditMenuItem(item)}
                                      className="p-1 text-[#A67C52] hover:text-[#8A6642]"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteMenuItem(item.id)
                                      }
                                      className="p-1 text-[#E9DCC9] hover:text-[#d8cbb8] bg-[#A67C52] rounded-full"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="py-4 text-center text-[#7D6E63]"
                            >
                              No menu items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Profits Tab */}
            {activeTab === "profits" && (
              <motion.div
                key="profits"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-medium text-[#5C4738]">
                    Profits
                  </h1>
                </div>

                {/* Financial Overview */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  variants={slideIn}
                >
                  {[
                    {
                      title: "Total Revenue",
                      value: totalRevenue,
                      icon: DollarSign,
                      color: "bg-[#E9DCC9]",
                      textColor: "text-[#A67C52]",
                      trend: 8.5,
                      trendUp: true,
                    },
                    {
                      title: "Total Expenses",
                      value: totalExpenses,
                      icon: DollarSign,
                      color: "bg-[#FAF3E8]",
                      textColor: "text-[#7D6E63]",
                      trend: 3.2,
                      trendUp: false,
                    },
                    {
                      title: "Total Profit",
                      value: totalProfit,
                      icon: DollarSign,
                      color: "bg-[#A67C52]",
                      textColor: "text-white",
                      trend: 12.4,
                      trendUp: true,
                    },
                    {
                      title: "Profit Margin",
                      value: profitMargin,
                      icon: Percent,
                      color: "bg-[#5C4738]",
                      textColor: "text-white",
                      trend: 1.8,
                      trendUp: true,
                      isPercent: true,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`${item.color} p-6 rounded-2xl shadow-sm`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className={`text-sm ${
                              item.textColor === "text-white"
                                ? "text-white/80"
                                : "text-[#7D6E63]"
                            }`}
                          >
                            {item.title}
                          </p>
                          <h3
                            className={`text-2xl font-medium mt-1 ${item.textColor}`}
                          >
                            {item.isPercent
                              ? `${item.value.toFixed(1)}%`
                              : `$${item.value.toLocaleString()}`}
                          </h3>
                        </div>
                        <div
                          className={`p-2 rounded-xl ${
                            item.textColor === "text-white"
                              ? "bg-white/20"
                              : "bg-white"
                          }`}
                        >
                          <item.icon className={`h-5 w-5 ${item.textColor}`} />
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <div
                          className={`flex items-center ${
                            item.trendUp ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {item.trendUp ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-xs">{item.trend}%</span>
                        </div>
                        <span
                          className={`text-xs ml-1 ${
                            item.textColor === "text-white"
                              ? "text-white/80"
                              : "text-[#7D6E63]"
                          }`}
                        >
                          vs last month
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Revenue Chart */}
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-sm"
                  variants={slideIn}
                >
                  <h2 className="text-lg font-medium text-[#5C4738] mb-4">
                    Revenue, Expenses & Profit
                  </h2>
                  <LineChart data={monthlyData} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profit by Category */}
                  <motion.div
                    className="bg-white p-6 rounded-2xl shadow-sm"
                    variants={slideIn}
                  >
                    <h2 className="text-lg font-medium text-[#5C4738] mb-4">
                      Profit by Category
                    </h2>
                    <BarChart
                      data={categoryProfits}
                      valueKey="profit"
                      labelKey="category"
                    />
                  </motion.div>

                  {/* Most Profitable Items */}
                  <motion.div
                    className="bg-white p-6 rounded-2xl shadow-sm"
                    variants={slideIn}
                  >
                    <h2 className="text-lg font-medium text-[#5C4738] mb-4">
                      Most Profitable Items
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E9DCC9]">
                            <th className="text-left py-3 px-4 text-[#7D6E63] font-medium">
                              Item
                            </th>
                            <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                              Price
                            </th>
                            <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                              Profit
                            </th>
                            <th className="text-right py-3 px-4 text-[#7D6E63] font-medium">
                              Margin
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {profitableItems.map((item, index) => (
                            <motion.tr
                              key={item.id}
                              className="border-b border-[#E9DCC9] hover:bg-[#FAF3E8]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              whileHover={{ backgroundColor: "#FAF3E8" }}
                            >
                              <td className="py-3 px-4 text-[#5C4738]">
                                {item.name}
                              </td>
                              <td className="py-3 px-4 text-right text-[#7D6E63]">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right text-[#A67C52]">
                                ${item.profit.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right text-[#7D6E63]">
                                {item.margin.toFixed(1)}%
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
