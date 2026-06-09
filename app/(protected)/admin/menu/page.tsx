"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import { Plus, Edit2, Trash2, Loader2, Utensils, Search } from "lucide-react";
import axiosInstance from "@/lib/axios";

// Shadcn UI Imports
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import { BlinkingDots } from "@/components/ui/blinking-dots";
import { useToast } from "@/components/ui/use-toast";

interface IAddOnItem {
  title: string;
  price: number;
}

interface ICategory {
  _id: string;
  CategoryName: string;
}

interface IMenuItem {
  _id: string;
  title: string;
  ingredientItem: string[];
  addOnItems: IAddOnItem[];
  price: number;
  categoryId: string | ICategory;
  status: "active" | "inactive";
  cookingTime: string;
  createdAt: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<{
    value: string;
    label: string;
  } | null>(null);

  // Execution parameters applied on submit
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Dialog & Pagination States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [selectedMenu, setSelectedMenu] = useState<IMenuItem | null>(null);
  const {toast} = useToast();
  // Fetch Categories for Filter Dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category", {
          params: { limit: "all" },
        });
        const catData =
          res?.data?.data?.result || res?.data?.data || res?.data || [];
        setCategories(catData);
      } catch (err) {
        console.error("Failed to load layout structural categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Paginated & Filtered Menu Items
  const fetchMenuItems = async (
    page: number,
    limit: number,
    search: string,
    category: string,
  ) => {
    try {
      setPageLoading(true);
      const response = await axiosInstance.get("/menu", {
        params: {
          page,
          limit,
          searchTerm: search || undefined,
          categoryId: category || undefined,
        },
      });

      const data = response?.data?.data?.result || response?.data || [];
      const metaTotal = response?.data?.data?.meta?.totalPage || 1;

      setMenuItems(data);
      setTotalPages(metaTotal);
    } catch (error:any) {
      console.error("Failed to fetch menu items:", error);
      const fallbackMsg =
        error?.response?.data?.message || "Server not reachable";
      toast({
        title: "Error",
        description: fallbackMsg,
        variant: "destructive",
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems(currentPage, entriesPerPage, activeSearch, activeCategory);
  }, [currentPage, entriesPerPage, activeSearch, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchQuery);
    setActiveCategory(selectedCategory ? selectedCategory.value : "");
  };

  const handleDeleteOpen = (menu: IMenuItem) => {
    setSelectedMenu(menu);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMenu) return;
    try {
      setSubmitLoading(true);
      await axiosInstance.delete(`/menu/${selectedMenu._id}`);
      await fetchMenuItems(
        currentPage,
        entriesPerPage,
        activeSearch,
        activeCategory,
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    } finally {
      setSubmitLoading(false);
      setSelectedMenu(null);
    }
  };

  // Immediate Status Patch Request (Updates state instantly, no full-page loader)
  const handleStatusToggle = async (
    itemId: string,
    currentStatus: "active" | "inactive",
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    // 1. Optimistically update local UI state immediately
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      // 2. Perform the actual PATCH API request in the background
      await axiosInstance.patch(`/menu/${itemId}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status on server:", error);

      // 3. Fallback: revert state if patch fails
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, status: currentStatus } : item,
        ),
      );
    }
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "black" : "rgba(0, 0, 0, 0.2)",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
      "&:hover": { borderColor: "black" },
      color: "black",
      fontSize: "0.875rem",
      height: "2.5rem",
      width: "100%",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "black"
        : state.isFocused
          ? "rgba(0,0,0,0.05)"
          : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
      fontSize: "0.875rem",
      "&:active": { backgroundColor: "black", color: "white" },
    }),
  };

  const categoryOptions = [
    ...categories.map((cat) => ({
      value: cat._id,
      label: cat.CategoryName,
    })),
  ];

  return (
    <div className="mx-auto space-y-6 text-black">
      {/* Top Header Row Panel */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Row Container holding Title and Filters immediately beside each other */}
        <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center flex-1">
          <h1 className="text-2xl font-bold tracking-tight shrink-0">Menu</h1>

          {/* Filter Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 w-full sm:flex-row sm:items-center lg:max-w-2xl lg:ml-6"
          >
            <div className="relative w-full lg:w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <Input
                type="text"
                placeholder="Search by menu title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-black/20 rounded-[5px] focus-visible:ring-black h-10 bg-white w-full"
              />
            </div>

            <div className="w-full sm:w-[180px] shrink-0">
              <Select
                styles={customSelectStyles}
                options={categoryOptions}
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                placeholder="All Categories"
                isSearchable
                isClearable
              />
            </div>

            <Button
              type="submit"
              className="h-10 w-full sm:w-auto px-5 rounded-sm font-medium shrink-0"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Action Configuration Area */}
        <div className="w-full lg:w-auto shrink-0">
          <Link href="/admin/menu/create" passHref className="w-full">
            <Button className="w-full lg:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add Menu Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <BlinkingDots />
        </div>
      ) : menuItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-black/20 rounded-xl p-12 text-center bg-black/[0.01]">
          <Utensils className="w-12 h-12 text-black/30 mb-4" />
          <h3 className="text-lg font-semibold text-primary">
            No Menu Items Listed
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try modifying your search queries or filter categories.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[700px] w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/30 hover:bg-transparent">
                  <TableHead className="text-black font-semibold h-12">
                    Item Details
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    Category
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    Cooking Time
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    Price
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12">
                    Status
                  </TableHead>
                  <TableHead className="text-black font-semibold h-12 text-right pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow
                    key={item._id}
                    className="border-b border-black/10 hover:bg-black/[0.01] transition-colors"
                  >
                    <TableCell className="py-4 pl-4">
                      <div className="font-bold text-black break-words max-w-[220px] sm:max-w-xs">
                        {item.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-black/80 py-4 font-medium">
                      {typeof item.categoryId === "object"
                        ? item.categoryId.CategoryName
                        : "Unassigned"}
                    </TableCell>
                    <TableCell className="font-bold text-black py-4">
  {item.cookingTime ? `${item.cookingTime} mins` : "—"}
</TableCell>
                    <TableCell className="font-bold text-black py-4">
                      £{Number(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`status-${item._id}`}
                          checked={item.status === "active"}
                          onCheckedChange={() =>
                            handleStatusToggle(item._id, item.status)
                          }
                        />
                        <Label
                          htmlFor={`status-${item._id}`}
                          className={`text-sm font-semibold capitalize select-none cursor-pointer ${
                            item.status === "active"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {item.status}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/menu/${item._id}`} passHref>
                          <Button
                            size="icon"
                            variant="outline"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteOpen(item)}
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-black/5 overflow-x-auto">
              <DynamicPagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* CONFIRM DELETION MODAL */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-black/10 max-w-[92vw] sm:max-w-md rounded-xl text-black p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
              Retract Menu Entry
            </DialogTitle>
            <DialogDescription className="text-black/70 pt-2 text-sm">
              Are you sure you want to delete{" "}
              <strong className="text-black">"{selectedMenu?.title}"</strong>?
              This will permanently wipe the record and clear customer choices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto border-black/20  rounded-lg order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={submitLoading}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg min-w-[100px] order-1 sm:order-2"
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
