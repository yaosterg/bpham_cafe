"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronRight, Coffee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  selectAllCategories,
  createCategory,
  findAllCategories,
  updateCategory,
  deleteCategory,
} from "@/store/reducers/categorySlice";

// Sample data - replace with your actual data
const initialCategories = [
  { id: 1, name: "Hot Coffee", itemCount: 8 },
  { id: 2, name: "Cold Coffee", itemCount: 6 },
  { id: 3, name: "Espresso", itemCount: 5 },
  { id: 4, name: "Tea", itemCount: 7 },
  { id: 5, name: "Pastries", itemCount: 12 },
  { id: 6, name: "Sandwiches", itemCount: 4 },
];

const menuItemsByCategory = {
  1: [
    {
      id: 101,
      name: "Americano",
      price: "$3.50",
      description: "Espresso with hot water",
    },
    {
      id: 102,
      name: "Cappuccino",
      price: "$4.25",
      description: "Espresso with steamed milk and foam",
    },
    {
      id: 103,
      name: "Latte",
      price: "$4.50",
      description: "Espresso with steamed milk",
    },
    {
      id: 104,
      name: "Mocha",
      price: "$4.75",
      description: "Espresso with chocolate and steamed milk",
    },
    {
      id: 105,
      name: "Drip Coffee",
      price: "$2.75",
      description: "House blend coffee",
    },
  ],
  2: [
    {
      id: 201,
      name: "Iced Americano",
      price: "$3.75",
      description: "Espresso with cold water and ice",
    },
    {
      id: 202,
      name: "Iced Latte",
      price: "$4.75",
      description: "Espresso with cold milk and ice",
    },
    {
      id: 203,
      name: "Cold Brew",
      price: "$4.50",
      description: "Slow-steeped cold coffee",
    },
    {
      id: 204,
      name: "Frappuccino",
      price: "$5.25",
      description: "Blended coffee with ice and milk",
    },
  ],
  3: [
    {
      id: 301,
      name: "Espresso Shot",
      price: "$2.50",
      description: "Single shot of espresso",
    },
    {
      id: 302,
      name: "Double Shot",
      price: "$3.25",
      description: "Double shot of espresso",
    },
    {
      id: 303,
      name: "Macchiato",
      price: "$3.75",
      description: "Espresso with a dash of foam",
    },
  ],
  4: [
    {
      id: 401,
      name: "Green Tea",
      price: "$3.25",
      description: "Traditional green tea",
    },
    {
      id: 402,
      name: "Earl Grey",
      price: "$3.25",
      description: "Black tea with bergamot",
    },
    {
      id: 403,
      name: "Chai Latte",
      price: "$4.50",
      description: "Spiced tea with steamed milk",
    },
    {
      id: 404,
      name: "Herbal Tea",
      price: "$3.25",
      description: "Caffeine-free herbal infusion",
    },
  ],
  5: [
    {
      id: 501,
      name: "Croissant",
      price: "$3.50",
      description: "Buttery, flaky pastry",
    },
    {
      id: 502,
      name: "Blueberry Muffin",
      price: "$3.75",
      description: "Muffin with fresh blueberries",
    },
    {
      id: 503,
      name: "Chocolate Chip Cookie",
      price: "$2.50",
      description: "Freshly baked chocolate chip cookie",
    },
    {
      id: 504,
      name: "Cinnamon Roll",
      price: "$4.25",
      description: "Sweet roll with cinnamon and icing",
    },
  ],
  6: [
    {
      id: 601,
      name: "Turkey & Cheese",
      price: "$6.75",
      description: "Turkey with cheddar on sourdough",
    },
    {
      id: 602,
      name: "Veggie Wrap",
      price: "$6.50",
      description: "Seasonal vegetables in a wrap",
    },
    {
      id: 603,
      name: "BLT",
      price: "$6.95",
      description: "Bacon, lettuce, and tomato on toast",
    },
  ],
};

export default function CategoriesManager() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const allCategories = useSelector(selectAllCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(findAllCategories());
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") return;
    console.log("Adding category:", newCategoryName);
    await dispatch(createCategory({ newCategory: newCategoryName }));
    const newCategory = {
      id: categories.length + 1,
      name: newCategoryName,
      itemCount: 0,
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsDialogOpen(false);
  };

  const handleUpdateCategory = async () => {
    if (newCategoryName.trim() === "") return;

    await dispatch(
      updateCategory({ original: editingCategory, newName: newCategoryName })
    );
    setNewCategoryName("");
    setIsEditCategoryOpen(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    await dispatch(deleteCategory({ id: categoryId }));
    setIsDeleteCategoryOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setMenuItems(menuItemsByCategory[categoryId] || []);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#F9F5F1]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#5F4B32]">Menu Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8C7851] hover:bg-[#6F5B3E] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#5F4B32]">
                Add New Category
              </DialogTitle>
              <DialogDescription className="text-[#8C7851]">
                Create a new category for your menu items.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-[#5F4B32]">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="col-span-3 border-[#E6DDD1]"
                  placeholder="e.g., Specialty Drinks"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddCategory}
                className="bg-[#8C7851] hover:bg-[#6F5B3E] text-white"
              >
                Save Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4 border-[#E6DDD1] bg-white">
          <CardHeader>
            <CardTitle className="text-[#5F4B32]">All Categories</CardTitle>
            <CardDescription className="text-[#8C7851]">
              Click on a category to view its menu items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#F9F5F1]">
                  <TableHead className="text-[#5F4B32]">Name</TableHead>
                  <TableHead className="text-right text-[#5F4B32]">
                    Items
                  </TableHead>
                  <TableHead className="w-[100px] text-[#5F4B32]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {categories.map((category) => (
                  <TableRow
                    key={category.id}
                    className={`cursor-pointer hover:bg-[#F9F5F1] ${
                      selectedCategory === category.id ? "bg-[#F9F5F1]" : ""
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <TableCell className="font-medium text-[#5F4B32]">
                      <div className="flex items-center">
                        {selectedCategory === category.id && (
                          <ChevronRight className="mr-2 h-4 w-4 text-[#8C7851]" />
                        )}
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[#8C7851]">
                      {category.itemCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#8C7851]"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit functionality would go here
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete functionality would go here
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))} */}
                {allCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className={`cursor-pointer hover:bg-[#F9F5F1] ${
                      selectedCategory === category.id ? "bg-[#F9F5F1]" : ""
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <TableCell className="font-medium text-[#5F4B32]">
                      <div className="flex items-center">
                        {selectedCategory === category.id && (
                          <ChevronRight className="mr-2 h-4 w-4 text-[#8C7851]" />
                        )}
                        {category.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[#8C7851]">
                      {category.itemCount}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={isEditCategoryOpen}
                          onOpenChange={setIsEditCategoryOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#8C7851]"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-[#5F4B32]">
                                Change Category Title
                              </DialogTitle>
                              <DialogDescription className="text-[#8C7851]">
                                Adjust the name of the categories.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="name"
                                  className="text-right text-[#5F4B32]"
                                >
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  value={newCategoryName}
                                  onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                  }
                                  className="col-span-3 border-[#E6DDD1]"
                                  placeholder={category.category}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => handleUpdateCategory()}
                                className="bg-[#8C7851] hover:bg-[#6F5B3E] text-white"
                              >
                                Save
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 border-[#E6DDD1] bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#5F4B32]">
                  {selectedCategory
                    ? `${
                        categories.find((c) => c.id === selectedCategory)?.name
                      } Items`
                    : "Menu Items"}
                </CardTitle>
                <CardDescription className="text-[#8C7851]">
                  {selectedCategory
                    ? `All items in the ${
                        categories.find((c) => c.id === selectedCategory)?.name
                      } category`
                    : "Select a category to view items"}
                </CardDescription>
              </div>
              {selectedCategory && (
                <Button className="bg-[#8C7851] hover:bg-[#6F5B3E] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              menuItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#F9F5F1]">
                      <TableHead className="text-[#5F4B32]">Name</TableHead>
                      <TableHead className="text-[#5F4B32]">
                        Description
                      </TableHead>
                      <TableHead className="text-right text-[#5F4B32]">
                        Price
                      </TableHead>
                      <TableHead className="w-[100px] text-[#5F4B32]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-[#F9F5F1]">
                        <TableCell className="font-medium text-[#5F4B32]">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-[#8C7851]">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right font-medium text-[#5F4B32]">
                          {item.price}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#8C7851]"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Coffee className="h-12 w-12 text-[#8C7851] mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-[#5F4B32]">
                    No items found
                  </h3>
                  <p className="text-sm text-[#8C7851] mt-1">
                    This category doesn't have any menu items yet.
                  </p>
                  <Button className="mt-4 bg-[#8C7851] hover:bg-[#6F5B3E] text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Item
                  </Button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Coffee className="h-12 w-12 text-[#8C7851] mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-[#5F4B32]">
                  Select a category
                </h3>
                <p className="text-sm text-[#8C7851] mt-1">
                  Click on a category from the left to view its menu items
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
