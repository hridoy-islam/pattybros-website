"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import { Plus, Loader2, X, ArrowLeft, Camera } from "lucide-react";
import axiosInstance from "@/lib/axios";

// Shadcn UI Imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlinkingDots } from "@/components/ui/blinking-dots";
import { ImageUploader } from "@/components/profile/userImage-uploader";

interface ICategory {
  _id: string;
  CategoryName: string;
}

const menuFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").trim(),
  price: z.coerce
    .number()
    .min(0.01, "Price must be greater than zero.")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Price cannot have more than 2 decimal places (e.g., 13.23)."
    ),
  cookingTime: z.coerce
    .number()
    .int("Cooking time must be a whole number.")
    .min(1, "Cooking time must be at least 1 minute."),
  categoryId: z.string().min(1, "Please select a category."),
  image: z.string().optional(),
  ingredientItem: z.array(z.string().min(1, "Ingredient cannot be empty")).min(1, "At least one ingredient is required"),
  addOnItems: z.array(
    z.object({
      title: z.string().min(1, "Add-on title required.").trim(),
      price: z.coerce
        .number()
        .min(0, "Price must be a positive number.")
        .refine(
          (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
          "Price cannot have more than 2 decimal places."
        ),
    })
  ),
});

type MenuFormValues = z.infer<typeof menuFormSchema>;

export default function CreateMenuPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      price: 0,
      cookingTime: 0,
      categoryId: "",
      image: "",
      ingredientItem: [""],
      addOnItems: [],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredientItem" as any,
  });

  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control: form.control,
    name: "addOnItems",
  });

  const currentImageUrl = form.watch("image");

  // Forces the input value to strictly stick to maximum 2 decimal places
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const value = e.target.value;
    // Allows numbers with up to 2 decimal places, or empty string (while typing)
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      onChange(value);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setPageLoading(true);
        const catResponse = await axiosInstance.get("/category", {
          params: { limit: "all" },
        });
        const catData = catResponse?.data?.data?.result || catResponse?.data?.data || catResponse?.data || [];
        setCategories(catData);
      } catch (error) {
        console.error("Failed to load setup context data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (values: MenuFormValues) => {
    try {
      setSubmitLoading(true);
      await axiosInstance.post("/menu", values);
      router.push("/admin/menu");
    } catch (error) {
      console.error("Error creating menu item:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUploadComplete = (data: any) => {
    setUploadOpen(false);
    if (data?.url || data?.fileUrl || data?.data?.fileUrl) {
      const url = data?.url || data?.fileUrl || data?.data?.fileUrl;
      form.setValue("image", url, { shouldValidate: true });
    }
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "black" : "rgba(0, 0, 0, 0.2)",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": { borderColor: "black" },
      color: "black",
      fontSize: "0.875rem",
      height: "2.5rem"
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : state.isFocused ? "rgba(0,0,0,0.05)" : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
      fontSize: "0.875rem",
      "&:active": { backgroundColor: "black", color: "white" }
    })
  };

  const selectOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.CategoryName,
  }));

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <BlinkingDots />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 text-black">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Menu Entry</h1>
        </div>
        <Button 
          size="sm" 
          onClick={() => router.push("/admin/menu")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold tracking-tight uppercase text-black block">
          Menu Image
        </label>
        <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          <img
            src={currentImageUrl || 'https://kzmjkvje8tr2ra724fhh.lite.vusercontent.net/placeholder.svg'}
            alt="Menu preview"
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            size="icon"
            className="absolute bottom-2 right-2 rounded-full bg-black text-white hover:bg-black/80 shadow-md w-8 h-8"
            onClick={() => setUploadOpen(true)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => <input type="hidden" {...field} />}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-black">
                    Item Title <span className="text-red-600 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic Cheeseburger" {...field} className="border-black/20 focus-visible:ring-black h-10 rounded-sm" />
                  </FormControl>
                  <FormMessage className="text-red-600 font-medium" />
                </FormItem>
              )}
            />

            {/* Price (Strict Input Level Filtering) */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-black">
                    Price (£) <span className="text-red-600 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-black/50">£</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="13.23" 
                        {...field} 
                        onChange={(e) => handlePriceChange(e, field.onChange)}
                        className="pl-7 border-black/20 focus-visible:ring-black h-10 rounded-sm" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 font-medium" />
                </FormItem>
              )}
            />

            {/* Cooking Time */}
            <FormField
              control={form.control}
              name="cookingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-black">
                    Cooking Time (mins) <span className="text-red-600 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" placeholder="e.g., 20" {...field} className="border-black/20 focus-visible:ring-black h-10 rounded-sm" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 font-medium" />
                </FormItem>
              )}
            />
            
            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-black">
                    Menu Classification Category <span className="text-red-600 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="categoryId"
                      render={({ field: { onChange, value } }) => (
                        <Select
                          styles={customSelectStyles}
                          options={selectOptions}
                          value={selectOptions.find((opt) => opt.value === value) || null}
                          onChange={(val) => onChange(val ? val.value : "")}
                          placeholder="Select classification structural parent..."
                          isSearchable
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-medium" />
                </FormItem>
              )}
            />
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3 bg-black/[0.01] p-5 border border-black/10 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold tracking-tight uppercase text-black">
                Ingredients Composition <span className="text-red-600 normal-case ml-0.5">*</span>
              </p>
              <Button type="button" size="sm" onClick={() => appendIngredient("")} className="h-8 rounded-md">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
              </Button>
            </div>
            
            <div className="space-y-2">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`ingredientItem.${index}` as any}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="e.g., Smoked Cheddar" {...field} className="border-black/20 focus-visible:ring-black h-10 rounded-sm" />
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => removeIngredient(index)} 
                    className="w-10 h-10 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg border border-transparent"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Items Section */}
          <div className="space-y-3 bg-black/[0.01] p-5 border border-black/10 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold tracking-tight uppercase text-black">Supplementary Add-Ons</p>
              <Button type="button" size="sm" onClick={() => appendAddOn({ title: "", price: 0 })} className="h-8 border-black rounded-sm">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
              </Button>
            </div>
            <div className="space-y-2">
              {addOnFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 bg-white p-3 border border-black/10 rounded-xl shadow-sm">
                  <FormField
                    control={form.control}
                    name={`addOnItems.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Addon Name (e.g., Extra Bacon)" {...field} className="border-black/20 focus-visible:ring-black h-10 rounded-sm" />
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`addOnItems.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="w-36">
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-black/50">£</span>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="1.50" 
                              {...field} 
                              onChange={(e) => handlePriceChange(e, field.onChange)}
                              className="pl-6 border-black/20 focus-visible:ring-black h-10 rounded-sm" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium" />
                      </FormItem>
                    )}
                  />
                  <Button type="button" size="icon" variant="ghost" onClick={() => removeAddOn(index)} className="w-10 h-10 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/menu")} className="h-10 rounded-lg px-6">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitLoading || !form.formState.isValid} 
              className="h-10 rounded-md"
            >
              {submitLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Menu Item"}
            </Button>
          </div>
        </form>
      </Form>

      <ImageUploader
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
        entityId="new-menu-item"
      />
    </div>
  );
}