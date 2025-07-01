"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit,
  Trash,
  Coffee,
  Search,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createIngredient,
  batchCreateIngredients,
  findAllIngredients,
  selectAllIngredients,
  deleteIngredient,
  updateIngredient,
  selectEditedIngredient,
  setEditedIngredient,
} from "@/store/reducers/ingredientSlice";
import CoffeeAnimation from "@/components/Loading";

// Form schema for adding a new ingredient (no ID required)
const addFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  source: z.string().min(1, "Source is required"),
  price: z.coerce.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

// Form schema for editing an existing ingredient (ID included)
const editFormSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
  name: z.string().min(1, "Name is required"),
  source: z.string().min(1, "Source is required"),
  price: z.coerce.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

export default function Ingredients() {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const ingredientToEdit = useSelector(selectEditedIngredient);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const ingredients = useSelector(selectAllIngredients);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchIngredients = async () => {
      await dispatch(findAllIngredients());
    };
    fetchIngredients();
  }, []);

  // Filtered ingredients based on search query
  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredient.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form for adding a new ingredient (no ID field)
  function AddIngredientForm({ onSubmit }) {
    const form = useForm({
      resolver: zodResolver(addFormSchema),
      defaultValues: {
        name: "",
        source: "",
        price: 0,
        unit: "",
      },
    });

    const handleSubmit = async (values) => {
      const result = await dispatch(createIngredient(values));
      setIsAddDialogOpen(false);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Premium Arabica Beans"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  The name of the ingredient
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Source</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Colombian Farms"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  Where the ingredient is sourced from
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="15.99"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  The price per unit
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Unit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="lb"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  The unit of measurement (e.g., lb, oz, gallon)
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#8B6E4F] hover:bg-[#725A41] text-white"
            >
              Add Ingredient
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError("");

    if (!file) {
      setUploadFile(null);
      return;
    }

    // Check if file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a CSV file only.");
      setUploadFile(null);
      return;
    }

    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    // In a real application, you would send the file to the backend here
    // For demo purposes, we'll just show a success message

    setLoading(true);
    await dispatch(batchCreateIngredients(uploadFile));
    setLoading(false);
    setIsUploadDialogOpen(false);
    setUploadFile(null);
  };

  // Form for editing an existing ingredient (ID field included but disabled)
  function EditIngredientForm({ ingredient, onSubmit }) {
    const form = useForm({
      resolver: zodResolver(editFormSchema),
      defaultValues: {
        id: ingredient.id,
        name: ingredient.name,
        source: ingredient.source,
        price: ingredient.price,
        unit: ingredient.unit,
      },
    });

    function handleSubmit(values) {
      onSubmit(values);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    className="border-[#D6C8B8] bg-gray-100 text-gray-500"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  Ingredient ID (auto-generated)
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Premium Arabica Beans"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  The name of the ingredient
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Source</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Colombian Farms"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  Where the ingredient is sourced from
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="15.99"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  The price per unit
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#8B6E4F]">Unit</FormLabel>
                <FormControl>
                  <Input
                    placeholder="lb"
                    {...field}
                    className="border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
                  />
                </FormControl>
                <FormDescription className="text-[#8B6E4F]">
                  The unit of measurement (e.g., lb, oz, gallon)
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#8B6E4F] hover:bg-[#725A41] text-white"
            >
              Update Ingredient
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // Event handlers

  const handleEditIngredient = async (ingredientToEdit) => {
    await dispatch(updateIngredient(ingredientToEdit));
    setSelectedIngredient(ingredientToEdit);
    setIsEditDialogOpen(false);
  };

  const handleDeleteIngredient = async (ingredient) => {
    await dispatch(deleteIngredient(ingredient));
    setSelectedIngredient(null);
  };

  const openEditDialog = async (ingredient) => {
    await dispatch(setEditedIngredient(ingredient));
    setIsEditDialogOpen(true);
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      style={{ backgroundColor: "#F9F5F0" }}
    >
      {/* Ingredients List */}
      <Card className="md:col-span-1 border-[#D6C8B8] bg-white min-w-[275px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#D6C8B8]">
          <CardTitle className="text-[#8B6E4F] flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-[#8B6E4F]" />
            Ingredients
          </CardTitle>
          <div className="flex space-x-2">
            {/* CSV Upload Button */}
            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-md bg-[#8B6E4F] hover:bg-[#725A41] border-0"
                >
                  <FileSpreadsheet className="h-4 w-4 text-white" />
                  <span className="sr-only">Upload CSV</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#F9F5F0] border-[#D6C8B8]">
                <DialogHeader>
                  <DialogTitle className="text-[#8B6E4F]">
                    Upload Ingredients CSV
                  </DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to bulk import or update ingredients.
                  </DialogDescription>
                </DialogHeader>
                {loading ? (
                  <CoffeeAnimation />
                ) : (
                  <>
                    {" "}
                    <div className="space-y-4 py-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                        <p className="font-medium mb-2">Please note:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Upload only .csv files</li>
                          <li>
                            Required columns: id, name, source, price, unit
                          </li>
                          <li>Existing IDs will be updated</li>
                          <li>Blank IDs will create new items</li>
                          <li>All other fields of columns must not be empty</li>
                        </ul>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label
                          htmlFor="csv-upload"
                          className="text-[#8B6E4F] font-medium"
                        >
                          Select CSV File
                        </label>
                        <div className="flex items-center">
                          <input
                            type="file"
                            id="csv-upload"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#D6C8B8] text-[#8B6E4F] hover:bg-[#F9F5F0] hover:text-[#5D4B35]"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Browse...
                          </Button>
                          <span className="ml-3 text-sm text-[#8B6E4F]">
                            {uploadFile ? uploadFile.name : "No file selected"}
                          </span>
                        </div>
                        {uploadError && (
                          <p className="text-red-500 text-sm">{uploadError}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#D6C8B8] text-[#8B6E4F] hover:bg-[#F9F5F0]"
                    onClick={() => setIsUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#8B6E4F] hover:bg-[#725A41] text-white"
                    onClick={handleUpload}
                    disabled={!uploadFile}
                  >
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Ingredient Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-md bg-[#8B6E4F] hover:bg-[#725A41] border-0"
                >
                  <Plus className="h-4 w-4 text-white" />
                  <span className="sr-only">Add Ingredient</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#F9F5F0] border-[#D6C8B8]">
                <DialogHeader>
                  <DialogTitle className="text-[#8B6E4F]">
                    Add New Ingredient
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new ingredient to your
                    inventory.
                  </DialogDescription>
                </DialogHeader>
                <AddIngredientForm onSubmit={handleUpload} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#8B6E4F]" />
            <Input
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 border-[#D6C8B8] bg-white focus-visible:ring-[#8B6E4F]"
            />
          </div>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-2">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedIngredient?.id === ingredient.id
                        ? "bg-[#F9F5F0] border-l-4 border-[#8B6E4F]"
                        : "hover:bg-[#F9F5F0]"
                    }`}
                    onClick={() => setSelectedIngredient(ingredient)}
                  >
                    <div>
                      <div className="font-medium text-[#5D4B35]">
                        {ingredient.name}
                      </div>
                      <div className="text-xs italic text-[#8B6E4F] mt-0.5 mb-1">
                        {ingredient.source}
                      </div>
                      <div className="text-sm text-[#8B6E4F]">
                        ${ingredient.price.toFixed(2)} / {ingredient.unit}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[#8B6E4F]">
                  <CoffeeAnimation />
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ingredient Details */}
      <Card className="md:col-span-2 border-[#D6C8B8] bg-white">
        <CardHeader className="border-b border-[#D6C8B8]">
          {selectedIngredient ? (
            <>
              <CardTitle className="text-[#5D4B35]">
                {selectedIngredient.id}. {selectedIngredient.name}
              </CardTitle>
              <p className="text-sm italic text-[#8B6E4F] mt-1">
                {selectedIngredient.source}
              </p>
            </>
          ) : (
            <CardTitle className="text-[#8B6E4F]">
              Select an ingredient
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {selectedIngredient ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#8B6E4F]">Price</h3>
                  <p className="text-lg font-medium text-[#5D4B35]">
                    ${selectedIngredient.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#8B6E4F]">Unit</h3>
                  <p className="text-lg font-medium text-[#5D4B35]">
                    {selectedIngredient.unit}
                  </p>
                </div>
              </div>

              <Separator className="bg-[#D6C8B8]" />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  className="border-[#D6C8B8] text-[#8B6E4F] hover:bg-[#F9F5F0] hover:text-[#5D4B35]"
                  onClick={() => openEditDialog(selectedIngredient)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Ingredient
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Ingredient
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#F9F5F0] border-[#D6C8B8]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#8B6E4F]">
                        Delete Ingredient
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this ingredient? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-[#F9F5F0] text-[#8B6E4F] hover:bg-[#EFE9E0] border-[#D6C8B8]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={() =>
                          handleDeleteIngredient(selectedIngredient)
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center">
              <div className="text-[#8B6E4F] mb-4">
                Select an ingredient from the list to view details
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B6E4F] hover:bg-[#725A41] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Ingredient
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F9F5F0] border-[#D6C8B8]">
                  <DialogHeader>
                    <DialogTitle className="text-[#8B6E4F]">
                      Add New Ingredient
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new ingredient to your
                      inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <AddIngredientForm />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#F9F5F0] border-[#D6C8B8]">
          <DialogHeader>
            <DialogTitle className="text-[#8B6E4F]">
              Edit Ingredient
            </DialogTitle>
            <DialogDescription>
              Update the details of this ingredient.
            </DialogDescription>
          </DialogHeader>
          {ingredientToEdit && (
            <EditIngredientForm
              ingredient={ingredientToEdit}
              onSubmit={handleEditIngredient}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
