"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit2, Trash2, Loader2, Search, Sliders } from "lucide-react";
import axiosInstance from "@/lib/axios";
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

// 1. Define Zod Validation Schema
const tableSchema = z.object({
  tableNumber: z
    .string()
    .min(1, "Table number/label is required")
    .trim(),
  capacity: z
    .union([z.number(), z.string().transform((val) => (val === "" ? undefined : Number(val)))])
    .pipe(
      z.number({ required_error: "Seating capacity is required", invalid_type_error: "Capacity must be a number" })
       .min(1, "Capacity must be at least 1 guest")
    ),
});

type TableFormValues = z.infer<typeof tableSchema>;

interface ITableItem {
  _id: string;
  tableNumber: string;
  capacity: number;
  status: "active" | "inactive";
  createdAt: string;
}

export default function TableManagementPage() {
  const [tables, setTables] = useState<ITableItem[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [selectedTable, setSelectedTable] = useState<ITableItem | null>(null);

  // 2. Initialize React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableNumber: "",
      // Using undefined instead of 0 allows the input field to be fully cleared out cleanly
      capacity: undefined,
    },
  });

  const fetchTables = async (page: number, limit: number, search: string) => {
    try {
      setPageLoading(true);
      const response = await axiosInstance.get("/table", {
        params: {
          page,
          limit,
          searchTerm: search || undefined,
        },
      });
      const data = response?.data?.data?.result || response?.data || [];
      const metaTotal = response?.data?.data?.meta?.totalPage || 1;
      setTables(data);
      setTotalPages(metaTotal);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTables(currentPage, entriesPerPage, activeSearch);
  }, [currentPage, entriesPerPage, activeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchQuery);
  };

  // 3. Handled through React Hook Form onSubmit wrapper
  const handleCreateTableSubmit = async (values: TableFormValues) => {
    try {
      setSubmitLoading(true);
      await axiosInstance.post("/table", {
        tableNumber: values.tableNumber,
        capacity: values.capacity,
      });

      reset(); // Resets fields cleanly back to default layout configs
      setAddDialogOpen(false);
      await fetchTables(currentPage, entriesPerPage, activeSearch);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteOpen = (table: ITableItem) => {
    setSelectedTable(table);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTable) return;
    try {
      setSubmitLoading(true);
      await axiosInstance.delete(`/table/${selectedTable._id}`);
      await fetchTables(currentPage, entriesPerPage, activeSearch);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
      setSelectedTable(null);
    }
  };

  const handleStatusToggle = async (itemId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    setTables((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, status: newStatus } : item
      )
    );

    try {
      await axiosInstance.patch(`/table/${itemId}`, { status: newStatus });
    } catch (error) {
      console.error(error);
      setTables((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, status: currentStatus } : item
        )
      );
    }
  };

  return (
    <div className="mx-auto space-y-6 text-black">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center flex-1">
          <h1 className="text-2xl font-bold tracking-tight shrink-0">Tables</h1>
          
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 w-full sm:flex-row sm:items-center lg:max-w-md"
          >
            <div className="relative w-full lg:w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <Input
                type="text"
                placeholder="Search by table number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-black/20 rounded-[5px] focus-visible:ring-black"
              />
            </div>
            <Button type="submit" className="h-10 w-full sm:w-auto px-5 rounded-sm font-semibold">
              Search
            </Button>
          </form>
        </div>

        <div className="w-full lg:w-auto shrink-0">
          <Button onClick={() => { reset(); setAddDialogOpen(true); }} className="w-full lg:w-auto">
            <Plus className="w-4 h-4 mx-2" /> Add New Table
          </Button>
        </div>
      </div>

      {pageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <BlinkingDots />
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-black/20 rounded-lg p-12 text-center bg-gray-50/50">
          <Sliders className="w-12 h-12 text-black/30 mb-4" />
          <h3 className="text-lg font-semibold text-primary">No Tables Available</h3>
          <p className="text-sm text-gray-500 mt-1">Try modifying your search query or add a physical layout table.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[700px] w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/30 hover:bg-transparent">
                  <TableHead className="text-black font-semibold h-12">Table Number</TableHead>
                  <TableHead className="text-black font-semibold h-12">Seating Capacity</TableHead>
                  <TableHead className="text-black font-semibold h-12">Status</TableHead>
                  <TableHead className="text-black font-semibold h-12 text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((item) => (
                  <TableRow key={item._id} className="border-b border-black/10 hover:bg-black/5 transition-colors">
                    <TableCell className="py-4 pl-4 font-bold text-black">
                      {item.tableNumber}
                    </TableCell>
                    <TableCell className="text-black/80 py-4 font-medium">
                      {item.capacity} Guests
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`status-${item._id}`}
                          checked={item.status === "active"}
                          onCheckedChange={() => handleStatusToggle(item._id, item.status)}
                        />
                        <Label
                          htmlFor={`status-${item._id}`}
                          className={`text-sm font-semibold capitalize select-none cursor-pointer w-28 ${
                            item.status === "active" ? "text-green-600" : "text-amber-600"
                          }`}
                        >
                          {item.status}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="outline">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteOpen(item)}
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

      {/* CREATE DIALOG WITH VALIDATIONS */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-white border border-black/10 max-w-[92vw] sm:max-w-[480px] rounded-md">
          <form onSubmit={handleSubmit(handleCreateTableSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Create Table Layout Entry
              </DialogTitle>
              <DialogDescription className="text-black/70 pt-1 text-sm">
                Add a physical layout asset to the room grid configuration matrix.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="tableNumber" className="text-sm font-semibold">Table Number / Label</Label>
                <Input
                  id="tableNumber"
                  type="text"
                  placeholder="e.g., T-01, Patio-4"
                  {...register("tableNumber")}
                  className={`border-black/20 focus-visible:ring-black ${errors.tableNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.tableNumber && (
                  <p className="text-xs font-medium text-red-500 mt-1">{errors.tableNumber.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="capacity" className="text-sm font-semibold">Seating Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 4"
                  {...register("capacity")}
                  className={`border-black/20 focus-visible:ring-black ${errors.capacity ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.capacity && (
                  <p className="text-xs font-medium text-red-500 mt-1">{errors.capacity.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading} className="min-w-[120px]">
                {submitLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Table"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-black/10 max-w-[92vw] sm:max-w-[480px] rounded-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
              Delete Table Layout Item
            </DialogTitle>
            <DialogDescription className="text-black/70 pt-2 text-sm">
              Are you sure you want to delete <strong className="text-black">"{selectedTable?.tableNumber}"</strong>? This will permanently wipe the table configuration asset from the room setup registry.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmDelete} disabled={submitLoading} className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]">
              {submitLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete Table"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}