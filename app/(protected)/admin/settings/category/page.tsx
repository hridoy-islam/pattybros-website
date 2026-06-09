"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit2, Trash2, Loader2, FolderOpen } from "lucide-react";
import axiosInstance from "@/lib/axios";

// Shadcn UI Imports (Adjust paths based on your absolute configuration)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import { BlinkingDots } from "@/components/ui/blinking-dots";

// Interfaces matching your Mongoose Schema
interface ICategory {
  _id: string;
  CategoryName: string;
  createdAt: string;
  updatedAt: string;
}

// Zod Validation Schema
const categoryFormSchema = z.object({
  CategoryName: z
    .string()
    .min(2, "Category name must be at least 2 characters.")
    .max(50, "Category name must not exceed 50 characters.")
    .trim(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function CategoryPage() {
  // State Management
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // Dialog States
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  // Selection States
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  // React Hook Form Configuration
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      CategoryName: "",
    },
  });

  // Fetch Categories on Mount
  const fetchCategories = async (page: number, limit: number) => {
    try {
      setPageLoading(true);
      const response = await axiosInstance.get("/category", {
        params: {
          page,
          limit,
        },
      });
      const data = response?.data?.data?.result || response?.data || [];
      setTotalPages(response.data.data.meta.totalPage);

      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  // Open Form for Creating New Category
  const handleCreateOpen = () => {
    setSelectedCategory(null);
    form.reset({ CategoryName: "" });
    setFormDialogOpen(true);
  };

  // Open Form for Editing Existing Category
  const handleEditOpen = (category: ICategory) => {
    setSelectedCategory(category);
    form.reset({ CategoryName: category.CategoryName });
    setFormDialogOpen(true);
  };

  // Open Delete Confirmation Dialog
  const handleDeleteOpen = (category: ICategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // Form Submit Handler (Handles both Create and Update)
  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setSubmitLoading(true);
      if (selectedCategory) {
        // Update Action
        await axiosInstance.patch(`/category/${selectedCategory._id}`, values);
      } else {
        // Create Action
        await axiosInstance.post("/category", values);
      }
      await fetchCategories(currentPage, entriesPerPage);
      setFormDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Action Handler
  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      setSubmitLoading(true);
      await axiosInstance.delete(`/category/${selectedCategory._id}`);
      await fetchCategories(currentPage, entriesPerPage);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setSubmitLoading(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="mx-auto space-y-6 text-black">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Product Categories
          </h1>
        </div>
        <Button onClick={handleCreateOpen}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* Main Content Area */}
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
         <BlinkingDots  />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-black/20 rounded-xl p-12 text-center bg-black/[0.01]">
          <FolderOpen className="w-12 h-12 text-black/30 mb-4" />
          <h3 className="text-lg font-semibold text-primary">
            No Categories Found
          </h3>
          <p className="text-sm text-black/60 max-w-sm mt-1 mb-6">
            Get started by adding your first menu category structure.
          </p>
        </div>
      ) : (
        /* Modern Data Table Layout */
        <div className=" overflow-hidden  bg-white">
          <Table>
            <TableHeader className="">
              <TableRow className="border-b border-black/10 hover:bg-transparent">
                <TableHead className="text-black font-semibold h-12">
                  Category Name
                </TableHead>
                <TableHead className="text-black font-semibold h-12 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category._id}
                  className="border-b border-black/10 hover:bg-black/[0.01] transition-colors"
                >
                  <TableCell className="font-medium text-black py-4">
                    {category.CategoryName}
                  </TableCell>

                  <TableCell className="text-right py-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        onClick={() => handleEditOpen(category)}
                        title="Edit Category"
                        variant="brand"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteOpen(category)}
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <DynamicPagination
              pageSize={entriesPerPage}
              setPageSize={setEntriesPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* CREATE & EDIT DIALOG */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="bg-white border border-black/10 sm:max-w-xl rounded-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-2"
            >
              <FormField
                control={form.control}
                name="CategoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-semibold">
                      Category Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gourmet Burgers" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600 font-medium" />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitLoading}>
                  {submitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : selectedCategory ? (
                    "Save Changes"
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-black/10 sm:max-w-md rounded-xl text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-black/70 pt-2">
              Are you sure you want to delete{" "}
              <strong className="text-black">
                "{selectedCategory?.CategoryName}"
              </strong>
              ? This process cannot be undone and may remove item associations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={submitLoading}
              className=" text-white rounded-lg min-w-[100px]"
            >
              {submitLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
