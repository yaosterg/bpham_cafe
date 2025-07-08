"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMenuItem,
  selectMenuItemsById,
  deleteMenuItem,
  updateMenuItem,
} from "@/store/reducers/itemSlice";
import axios from "axios";

// Mock data for menu items with image URLs

export default function CategoryItems({
  categoryName = "Coffee Menu",
  id,
  ingredients,
  selectedCategory,
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: 0,
    ingredients: [],
    status: true,
    imageURL: "",
    options: {},
  });
  const dispatch = useDispatch();
  const menuItems = useSelector(selectMenuItemsById);

  // Calculate ingredient cost
  const calculateIngredientCost = (ingredients) => {
    return ingredients.reduce((total, item) => {
      const ingredient = getIngredientById(item.ingredientId);
      return total + (ingredient?.price || 0) * item.quantity;
    }, 0);
  };

  // Calculate profit
  const calculateProfit = (price, ingredients) => {
    const ingredientCost = calculateIngredientCost(ingredients);
    return price - ingredientCost;
  };

  const getIngredientById = (id) => {
    return ingredients.find((ingredient) => ingredient.id === id);
  };

  const formatIngredients = (ingredientArray) => {
    let newIngArray = [];
    for (let items of ingredientArray) {
      let chosen = ingredients.find((item) => item.id === items.ingredientId);
      newIngArray.push({ ingredientId: chosen.id, quantity: items.qty });
    }
    return newIngArray;
  };

  // Handle edit button click
  const handleEdit = async (item) => {
    setCurrentItem(item);
    const { data } = await axios.get(`/api/menu/getmenuingredients/${item.id}`);
    const ingList = formatIngredients(data.ingredients);

    setFormData({
      name: item.name,
      description: item.description,
      cost: item.price,
      ingredients: [...ingList],
      status: item.menuStatus,
      imageURL: item.imageURL || "",
      options: item.options || {},
    });

    setIsEditDialogOpen(true);
  };

  const getAvailableIngredients = (currentIngredientId) => {
    // Get IDs of all selected ingredients EXCEPT the current one we're editing
    const selectedIds = formData.ingredients
      .filter((ing) => Number(ing.ingredientId) !== Number(currentIngredientId))
      .map((ing) => Number(ing.ingredientId));

    return ingredients.filter((ing) => !selectedIds.includes(Number(ing.id)));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cost") {
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === "" || regex.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];

    if (field === "ingredientId") {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        ingredientId: Number(value),
      };
    } else {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        quantity: Number(value),
      };
    }

    setFormData({
      ...formData,
      ingredients: updatedIngredients,
    });
  };

  // Add new ingredient to form

  const handleDelete = async (item) => {
    await dispatch(deleteMenuItem(item));
  };

  const addIngredient = () => {
    const availableIngredients = getAvailableIngredients();
    if (availableIngredients.length === 0) return;

    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { ingredientId: availableIngredients[0].id, quantity: 1 },
      ],
    });
  };

  // Remove ingredient from form
  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: updatedIngredients,
    });
  };

  // Save menu item
  const saveMenuItem = async () => {
    if (!currentItem) {
      // Add new item
      const formattedData = {
        ...formData,
        price: formData.cost === "" ? 0 : Number(formData.cost),
        categoryId: selectedCategory,
      };
      await dispatch(createMenuItem(formattedData));
    } else {
      const formattedData = {
        ...formData,
        price: formData.cost === "" ? 0 : Number(formData.cost),
        categoryId: selectedCategory,
        id: currentItem.id,
      };
      console.log("this is formattedData", formattedData);
      await dispatch(updateMenuItem(formattedData));
    }
    setIsEditDialogOpen(false);
  };

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange, label }) => {
    return (
      <div className="flex items-center">
        {label && (
          <span className="mr-2 text-[#5c3d2e] font-medium">{label}</span>
        )}
        <div
          className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
            checked ? "bg-[#b85c38]" : "bg-gray-300"
          }`}
          onClick={onChange}
        >
          <span
            className={`absolute left-1 top-1 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
        <span className="ml-2 text-sm text-[#5c3d2e]">
          {checked ? "On" : "Off"}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f8f3e9] rounded-xl overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex justify-between items-center border-b border-[#e6ddd0] p-6 bg-gradient-to-r from-[#5c3d2e] to-[#b85c38]">
        <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
        {selectedCategory ? (
          <button
            className="px-5 py-2.5 bg-white text-[#b85c38] hover:bg-[#f8f3e9] rounded-full flex items-center shadow-md transition-all duration-200"
            onClick={() => {
              setCurrentItem(null);
              setFormData({
                name: "",
                description: "",
                cost: 0,
                ingredients: [],
                status: true,
                imageURL: "",
                options: {},
              });
              setIsEditDialogOpen(true);
            }}
          >
            <span className="mr-2 font-bold">+</span> Add Item
          </button>
        ) : null}
      </div>

      {/* Menu Items List - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-5">
          {menuItems.length > 0 &&
            menuItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white border border-[#e6ddd0] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full overflow-hidden ${
                  !item.menuStatus ? "opacity-70" : ""
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start">
                    {/* Image Preview */}
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#e6ddd0] shadow-sm flex items-center justify-center bg-white">
                        <img
                          src={item.imageURL || "/placeholder.svg"}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png/revision/latest/scale-to-width-down/1000?cb=20210223094656";
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between flex-1">
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-semibold ${
                            item.status ? "text-[#5c3d2e]" : "text-gray-400"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm italic text-[#8c7b6b] mt-2">
                          {item.description}
                        </p>
                        <p className="text-[#b85c38] font-medium mt-3">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center border border-[#b85c38] text-[#b85c38] hover:bg-[#f8f3e9] rounded-full shadow-sm hover:shadow transition-all duration-200"
                          onClick={() => handleEdit(item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center border border-red-400 text-red-400 hover:bg-red-50 rounded-full shadow-sm hover:shadow transition-all duration-200"
                          onClick={() => handleDelete(item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f8f3e9] rounded-2xl shadow-2xl max-w-[600px] w-full max-h-[90vh] overflow-hidden">
            <div className="overflow-y-auto max-h-[90vh] scrollbar-hide">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-[#e6ddd0] pb-4">
                  <h3 className="text-2xl font-bold text-[#5c3d2e]">
                    {currentItem ? "Edit Menu Item" : "Add Menu Item"}
                  </h3>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f0e9df] text-[#8c7b6b] hover:bg-[#e6ddd0] hover:text-[#5c3d2e] transition-colors duration-200"
                    onClick={() => setIsEditDialogOpen(false)}
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Image URL Field with Preview */}
                  <div className="space-y-2">
                    <label
                      htmlFor="imageURL"
                      className="block text-[#5c3d2e] font-medium"
                    >
                      Image URL
                    </label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          id="imageURL"
                          name="imageURL"
                          type="text"
                          value={formData.imageURL}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-[#d1c5b5] rounded-lg focus:ring-2 focus:ring-[#b85c38] focus:border-[#b85c38] outline-none"
                          placeholder="Enter image URL"
                        />
                      </div>
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#d1c5b5] shadow-sm flex-shrink-0 flex items-center justify-center bg-white">
                        <img
                          src={formData.imageURL || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png/revision/latest/scale-to-width-down/1000?cb=20210223094656";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-[#5c3d2e] font-medium"
                    >
                      Item Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#d1c5b5] rounded-lg focus:ring-2 focus:ring-[#b85c38] focus:border-[#b85c38] outline-none"
                      placeholder="Enter item name"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-[#5c3d2e] font-medium"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#d1c5b5] rounded-lg focus:ring-2 focus:ring-[#b85c38] focus:border-[#b85c38] outline-none"
                      rows="3"
                      placeholder="Enter item description"
                    />
                  </div>

                  {/* Price Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="cost"
                      className="block text-[#5c3d2e] font-medium"
                    >
                      Price ($)
                    </label>
                    <input
                      id="cost"
                      name="cost"
                      type="text"
                      inputMode="decimal"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#d1c5b5] rounded-lg focus:ring-2 focus:ring-[#b85c38] focus:border-[#b85c38] outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Ingredients Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-[#5c3d2e] font-medium">
                        Ingredients
                      </label>
                      <button
                        className={`px-3 py-1.5 border rounded-full shadow-sm transition-all duration-200 flex items-center text-sm ${
                          getAvailableIngredients().length === 0
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-[#b85c38] text-[#b85c38] hover:bg-[#f0e9df] hover:shadow"
                        }`}
                        onClick={addIngredient}
                        disabled={getAvailableIngredients().length === 0}
                      >
                        <span className="mr-1 font-bold">+</span> Add Ingredient
                      </button>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-[#d1c5b5] shadow-sm">
                      {formData.ingredients.length === 0 ? (
                        <p className="text-[#8c7b6b] text-center py-2">
                          No ingredients added yet
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {formData.ingredients.map((ingredient, index) => {
                            const ingredientDetails = getIngredientById(
                              Number(ingredient.ingredientId)
                            );
                            return (
                              <div
                                key={index}
                                className="bg-[#f8f3e9] p-4 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <select
                                      value={ingredient.ingredientId}
                                      onChange={(e) =>
                                        handleIngredientChange(
                                          index,
                                          "ingredientId",
                                          e.target.value
                                        )
                                      }
                                      className="w-full p-2 border border-[#d1c5b5] rounded-lg focus:ring-2 focus:ring-[#b85c38] focus:border-[#b85c38] outline-none bg-white"
                                    >
                                      {/* Show currently selected ingredient first */}
                                      {ingredientDetails && (
                                        <option value={ingredient.ingredientId}>
                                          {ingredientDetails.name} ($
                                          {ingredientDetails.price.toFixed(2)}/
                                          {ingredientDetails.unit})
                                        </option>
                                      )}

                                      {/* Show remaining available ingredients */}
                                      {getAvailableIngredients(
                                        ingredient.ingredientId
                                      ).map((ing) => (
                                        <option key={ing.id} value={ing.id}>
                                          {ing.name}
                                        </option>
                                      ))}
                                    </select>
                                    {ingredientDetails && (
                                      <p className="text-sm italic text-[#8c7b6b] mt-1">
                                        {ingredientDetails.source} ($
                                        {ingredientDetails.price.toFixed(2)}/
                                        {ingredientDetails.unit})
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    className="ml-2 p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors duration-200"
                                    onClick={() => removeIngredient(index)}
                                    title="Remove ingredient"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line
                                        x1="18"
                                        y1="6"
                                        x2="6"
                                        y2="18"
                                      ></line>
                                      <line
                                        x1="6"
                                        y1="6"
                                        x2="18"
                                        y2="18"
                                      ></line>
                                    </svg>
                                  </button>
                                </div>
                                <div className="flex items-center mt-2">
                                  <span className="text-[#5c3d2e] font-medium mr-2">
                                    Quantity:
                                  </span>
                                  <div className="flex items-center border border-[#d1c5b5] rounded-lg overflow-hidden bg-white">
                                    <input
                                      type="number"
                                      min="0.1"
                                      step="0.1"
                                      value={ingredient.quantity}
                                      onChange={(e) =>
                                        handleIngredientChange(
                                          index,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      className="w-20 p-2 outline-none"
                                    />
                                    {ingredientDetails && (
                                      <span className="px-2 py-2 bg-[#f0e9df] text-[#8c7b6b] border-l border-[#d1c5b5]">
                                        {ingredientDetails.unit}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-[#e6ddd0]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#5c3d2e] font-medium">
                            Total Ingredient Cost:
                          </span>
                          <span className="text-[#b85c38] font-bold">
                            $
                            {calculateIngredientCost(
                              formData.ingredients
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-[#e6ddd0]">
                          <span className="text-[#5c3d2e] font-medium">
                            Profit:
                          </span>
                          <span
                            className={`font-bold ${
                              calculateProfit(
                                formData.cost,
                                formData.ingredients
                              ) >= 0
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            $
                            {calculateProfit(
                              formData.cost,
                              formData.ingredients
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Status Toggle */}
                  <div className="p-4 bg-white rounded-xl border border-[#d1c5b5] shadow-sm">
                    <ToggleSwitch
                      checked={formData.status}
                      onChange={() =>
                        setFormData({ ...formData, status: !formData.status })
                      }
                      label="Menu Status:"
                    />
                  </div>

                  {/* Options Section */}
                  <div className="p-4 bg-white rounded-xl border border-[#d1c5b5] shadow-sm">
                    <ToggleSwitch
                      checked={"Decaf" in (formData.options ?? {})}
                      onChange={() => {
                        setFormData((prev) => {
                          if ("Decaf" in prev.options) {
                            // Remove 'Milk' key
                            const { Decaf, ...rest } = prev.options;
                            return { ...prev, options: rest };
                          } else {
                            // Add 'Decaf' key with fixed object
                            return {
                              ...prev,
                              options: {
                                ...prev.options,
                                Decaf: [
                                  { id: "Decaf", name: "Decaf" },
                                  { id: "Non decaf", name: "Non Decaf" },
                                ],
                              },
                            };
                          }
                        });
                      }}
                      label="Milk Options (Whole/Oat):"
                    />
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#d1c5b5] shadow-sm">
                    <ToggleSwitch
                      checked={"Temperature" in (formData.options ?? {})}
                      onChange={() => {
                        setFormData((prev) => {
                          if ("Temperature" in prev.options) {
                            const { Temperature, ...rest } = prev.options;
                            return { ...prev, options: rest };
                          } else {
                            return {
                              ...prev,
                              options: {
                                ...prev.options,
                                Temperature: [
                                  { id: "hot", name: "Hot" },
                                  { id: "cold", name: "Cold" },
                                ],
                              },
                            };
                          }
                        });
                      }}
                      label="Tempature Options (Hot/Cold):"
                    />
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#d1c5b5] shadow-sm">
                    <ToggleSwitch
                      checked={"Milk" in (formData.options ?? {})}
                      onChange={() => {
                        setFormData((prev) => {
                          if ("Milk" in prev.options) {
                            // Remove 'Milk' key
                            const { Milk, ...rest } = prev.options;
                            return { ...prev, options: rest };
                          } else {
                            // Add 'Milk' key with fixed object
                            return {
                              ...prev,
                              options: {
                                ...prev.options,
                                Milk: [
                                  { id: "whole", name: "Whole" },
                                  { id: "oat", name: "Oat" },
                                ],
                              },
                            };
                          }
                        });
                      }}
                      label="Milk Options (Whole/Oat):"
                    />
                  </div>
                  {"Temperature" in formData.options &&
                    "Milk" in formData.options && (
                      <div className="p-4 bg-white rounded-xl border border-[#d1c5b5] shadow-sm">
                        <ToggleSwitch
                          checked={"Foam" in (formData.options ?? {})}
                          onChange={() => {
                            setFormData((prev) => {
                              if ("Foam" in prev.options) {
                                // Remove 'Foam' key
                                const { Foam, ...rest } = prev.options;
                                return { ...prev, options: rest };
                              } else {
                                // Add 'Foam' key with fixed object
                                return {
                                  ...prev,
                                  options: {
                                    ...prev.options,
                                    Foam: [
                                      { id: "foam", name: "Foam" },
                                      { id: "nofoam", name: "No Foam" },
                                    ],
                                  },
                                };
                              }
                            });
                          }}
                          label="Foam Options:"
                        />
                      </div>
                    )}

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#e6ddd0]">
                    <button
                      onClick={() => setIsEditDialogOpen(false)}
                      className="px-5 py-2.5 border border-[#8c7b6b] text-[#8c7b6b] hover:bg-[#f0e9df] rounded-full shadow-sm hover:shadow transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveMenuItem}
                      className="px-5 py-2.5 bg-[#b85c38] hover:bg-[#a04b2d] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for hiding scrollbars when not in use */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
