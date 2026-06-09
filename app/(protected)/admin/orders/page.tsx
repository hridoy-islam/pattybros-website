"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import { Eye, Trash2, Loader2, ShoppingBag, Search, RefreshCw } from "lucide-react";
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
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import { BlinkingDots } from "@/components/ui/blinking-dots";

interface IAddOnItem {
  _id?: string;
  title: string;
  price: number;
}

interface IMenuMin {
  _id: string;
  title: string;
}

type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

interface IOrder {
  _id: string;
  menuId: string | IMenuMin;
  refId?: string;
  instructions?: string;
  addOnItems: IAddOnItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  pickUpTime: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string } | null>(null);

  // Execution parameters applied on submit
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<string>("");

  // Dialog & Pagination States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  
  // Staging state for prospective status changes
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    refId: string;
    customerName: string;
    newStatus: string;
  } | null>(null);

  // Fetch Paginated & Filtered Order Items
  const fetchOrders = async (page: number, limit: number, search: string, status: string) => {
    try {
      setPageLoading(true);
      const response = await axiosInstance.get("/orders", {
        params: {
          page,
          limit,
          searchTerm: search || undefined,
          status: status || undefined,
        },
      });

      const data = response?.data?.data?.result || response?.data || [];
      const metaTotal = response?.data?.data?.meta?.totalPage || 1;

      setOrders(data);
      setTotalPages(metaTotal);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, entriesPerPage, activeSearch, activeStatus);
  }, [currentPage, entriesPerPage, activeSearch, activeStatus]);

  // Handle Enter key intercept for processing the active status dialog confirmation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && statusDialogOpen && pendingStatusChange) {
        e.preventDefault();
        confirmStatusChange();
      }
    };

    if (statusDialogOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [statusDialogOpen, pendingStatusChange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchQuery);
    setActiveStatus(selectedStatus ? selectedStatus.value : "");
  };

  // Intercept the visual dropdown change to prompt user validation
  const handleStatusClick = (item: IOrder, newStatus: string) => {
    if (item.status === newStatus) return;
    setPendingStatusChange({
      orderId: item._id,
      refId: item.refId || "",
      customerName: item.customerName,
      newStatus,
    });
    setStatusDialogOpen(true);
  };

  // Process verified status change mutations
  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    const { orderId, newStatus } = pendingStatusChange;
    
    setStatusDialogOpen(false);
    try {
      setStatusUpdatingId(orderId);
      await axiosInstance.patch(`/orders/${orderId}`, { status: newStatus });
      
      // Optimistically update status in local UI state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setStatusUpdatingId(null);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setStatusDialogOpen(false);
    setPendingStatusChange(null);
  };

  const handleDeleteOpen = (order: IOrder) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      setSubmitLoading(true);
      await axiosInstance.delete(`/orders/${selectedOrder._id}`);
      await fetchOrders(currentPage, entriesPerPage, activeSearch, activeStatus);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting order entry:", error);
    } finally {
      setSubmitLoading(false);
      setSelectedOrder(null);
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
      backgroundColor: state.isSelected ? "black" : state.isFocused ? "rgba(0,0,0,0.05)" : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
      fontSize: "0.875rem",
      "&:active": { backgroundColor: "black", color: "white" },
    }),
  };

  // Inline styling modification for small status cells inside the table structure
  const tableStatusStyles = {
    ...customSelectStyles,
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: "rgba(0, 0, 0, 0.15)",
      borderRadius: "0.25rem",
      fontSize: "0.8rem",
      height: "2rem",
      minHeight: "2rem",
      width: "130px",
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <div className="mx-auto space-y-6 text-black">
      
      {/* Top Header Row Panel */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center flex-1">
          <h1 className="text-2xl font-bold tracking-tight shrink-0">Orders</h1>
          
          {/* Filter Form Area */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 w-full sm:flex-row sm:items-center lg:max-w-2xl lg:ml-6"
          >
            <div className="relative w-full lg:w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <Input
                type="text"
                placeholder="Search by Order Ref ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-black/20 rounded-[5px] focus-visible:ring-black h-10 bg-white w-full"
              />
            </div>

            <div className="w-full sm:w-[180px] shrink-0">
              <Select
                styles={customSelectStyles}
                options={statusOptions}
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
                placeholder="All Statuses"
                isSearchable={false}
                isClearable
              />
            </div>

            <Button type="submit" className="h-10 w-full sm:w-auto px-5 rounded-sm font-medium shrink-0">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <BlinkingDots />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-black/20 rounded-xl p-12 text-center bg-black/[0.01]">
          <ShoppingBag className="w-12 h-12 text-black/30 mb-4" />
          <h3 className="text-lg font-semibold text-primary">No Orders Found</h3>
          <p className="text-sm text-gray-500 mt-1">Try modifying your search queries or status filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[800px] w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-black/30 hover:bg-transparent">
                  <TableHead className="text-black font-semibold h-12">Order Ref</TableHead>
                  <TableHead className="text-black font-semibold h-12">Customer Details</TableHead>
                  <TableHead className="text-black font-semibold h-12">Pick Up</TableHead>
                  <TableHead className="text-black font-semibold h-12">Total Amount</TableHead>
                  <TableHead className="text-black font-semibold h-12">Status</TableHead>
                  <TableHead className="text-black font-semibold h-12 text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((item) => (
                  <TableRow key={item._id} className="border-b border-black/10 hover:bg-black/[0.01] transition-colors">
                    <TableCell className="py-4  font-bold text-black">
                      {item.refId || "-"}
                    </TableCell>
                    <TableCell className="py-4 text-black">
                      <div className="font-semibold">{item.customerName}</div>
                      <div className="text-xs text-black/60">{item.customerPhone}</div>
                    </TableCell>
                    <TableCell className="font-medium text-black py-4">
                      {item.pickUpTime}
                    </TableCell>
                    <TableCell className="font-bold text-black py-4">
                      £{Number(item.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Select
                          styles={tableStatusStyles}
                          options={statusOptions}
                          value={statusOptions.find((o) => o.value === item.status)}
                          onChange={(val) => val && handleStatusClick(item, val.value)}
                          isSearchable={false}
                          isDisabled={statusUpdatingId === item._id}
                          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                          menuPosition="fixed"
                        />
                        {statusUpdatingId === item._id && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-black/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/orders/${item._id}`} passHref>
                          <Button
                            size="icon"
                            variant="outline"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteOpen(item)}
                          title="Delete Record"
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

      {/* CONFIRM STATUS UPDATE MODAL */}
      <Dialog open={statusDialogOpen} onOpenChange={(open) => !open && cancelStatusChange()}>
        <DialogContent className="bg-white border border-black/10 max-w-[92vw] sm:max-w-md rounded-xl text-black p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-black">
              Update Order Status
            </DialogTitle>
            <DialogDescription className="text-black/70 pt-2 text-sm">
              Are you sure you want to transition order <strong className="text-black">"{pendingStatusChange?.refId || pendingStatusChange?.customerName}"</strong> to <strong className="text-black capitalize">"{pendingStatusChange?.newStatus}"</strong>?
              <br />
              <span className="text-xs text-black/40 mt-3 block font-medium">
                Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 font-sans shadow-sm text-black font-bold">Enter</kbd> to execute this step.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4">
            <Button type="button" variant="outline" onClick={cancelStatusChange} className="w-full sm:w-auto rounded-lg order-2 sm:order-1">
              Cancel
            </Button>
            <Button type="button" onClick={confirmStatusChange} className="w-full sm:w-auto  text-white rounded-lg min-w-[100px] order-1 sm:order-2 font-medium">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETION MODAL */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-black/10 max-w-[92vw] sm:max-w-md rounded-xl text-black p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
              Delete Order Record
            </DialogTitle>
            <DialogDescription className="text-black/70 pt-2 text-sm">
              Are you sure you want to completely erase order <strong className="text-black">"{selectedOrder?.refId || selectedOrder?.customerName}"</strong>? This will permanently wipe the transactional history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto border-black/20 rounded-lg order-2 sm:order-1">
              Cancel
            </Button>
            <Button type="button" onClick={confirmDelete} disabled={submitLoading} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg min-w-[100px] order-1 sm:order-2">
              {submitLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}