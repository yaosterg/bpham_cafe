"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronRight, Coffee, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
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
import {
  findAllIngredients,
  selectAllIngredients,
} from "@/store/reducers/ingredientSlice";
import { selectMenuItemsById, findItemById } from "@/store/reducers/itemSlice";
import CategoryItems from "./CategoryItems";

export default function CategoriesManager() {
  const dispatch = useDispatch();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const allCategories = useSelector(selectAllCategories);
  const allIngredients = useSelector(selectAllIngredients);
  const menuItemsById = useSelector(selectMenuItemsById);

  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(findAllCategories());
      await dispatch(findAllIngredients());
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") return;

    await dispatch(createCategory({ newCategory: newCategoryName }));
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
    setSelectedCategory(null);
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    await dispatch(findItemById(categoryId));
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
                                  placeholder="New category name"
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#F9F5F0] border-[#D6C8B8]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#8B6E4F]">
                                Delete Category
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this category?
                                This action cannot be undone. You cannot delete
                                categories with menu items.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#F9F5F0] text-[#8B6E4F] hover:bg-[#EFE9E0] border-[#D6C8B8]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(category.id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 border-[#E6DDD1] bg-white">
          <CategoryItems
            id={selectedCategory}
            ingredients={allIngredients}
            selectedCategory={selectedCategory}
            menuItems={menuItemsById}
          />
        </Card>
      </div>
    </div>
  );
}
