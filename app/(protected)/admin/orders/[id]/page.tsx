"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select";
import {
  ArrowLeft,
  User,
  Phone,
  Clock,
  Receipt,
  Utensils,
  Loader2,
  Download,
  CalendarRange,
  Mail,
  Hash,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import moment from "@/lib/moment-setup";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlinkingDots } from "@/components/ui/blinking-dots";

interface IAddOnItem {
  _id: string;
  title: string;
  price: number;
}

interface IPopulatedMenu {
  _id: string;
  title: string;
  ingredientItem: string[];
  addOnItems: IAddOnItem[];
  price: number;
  categoryId: string;
  image?: string;
  cookingTime?: string;
}

interface IOrderItem {
  _id: string;
  menuId: IPopulatedMenu;
  quantity: number;
  instructions?: string;
  addOnItems: IAddOnItem[];
}

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

interface IOrderDetail {
  _id: string;
  items: IOrderItem[];
  refId: string;
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickUpTime: string;
  createdAt: string;
  updatedAt: string;
}

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #fbbf24',
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#fef3c7',
    padding: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #f3f4f6',
  },
  label: {
    fontSize: 11,
    color: '#666666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTop: '2px solid #fbbf24',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  badge: {
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 4,
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#999999',
    fontSize: 9,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
});

// Helper function for PDF status color
const getPDFStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending": return "#f59e0b";
    case "preparing": return "#3b82f6";
    case "ready": return "#8b5cf6";
    case "completed": return "#10b981";
    case "cancelled": return "#ef4444";
    default: return "#6b7280";
  }
};

// PDF Document Component
const OrderPDFDocument = ({ order }: { order: IOrderDetail }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.headerTitle}>Order Receipt</Text>
      </View>

      {/* Order ID */}
      <Text style={pdfStyles.orderId}>{order.refId || `Order #${order._id}`}</Text>

      {/* Customer Information */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>CUSTOMER DETAILS</Text>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Customer Name:</Text>
          <Text style={pdfStyles.value}>{order.customerName}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Phone Number:</Text>
          <Text style={pdfStyles.value}>{order.customerPhone}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Email:</Text>
          <Text style={pdfStyles.value}>{order.customerEmail}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Pickup Time:</Text>
          <Text style={pdfStyles.value}>{order.pickUpTime}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Order Date:</Text>
          <Text style={pdfStyles.value}>
            {moment(order.createdAt).format('DD MMM, YYYY')}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Status:</Text>
          <View style={[pdfStyles.badge, { backgroundColor: getPDFStatusColor(order.status) }]}>
            <Text style={{ color: '#ffffff' }}>{order.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>ORDER ITEMS</Text>
        {order.items.map((item, itemIndex) => (
          <View key={item._id || itemIndex} style={{ marginBottom: 15 }}>
            <View style={pdfStyles.row}>
              <View>
                <Text style={pdfStyles.itemTitle}>
                  {item.menuId?.title || "Menu Item"} x {item.quantity}
                </Text>
              </View>
              <Text style={pdfStyles.value}>
                £{((Number(item.menuId?.price || 0) + 
                  item.addOnItems.reduce((sum, addon) => sum + Number(addon.price || 0), 0)) * item.quantity).toFixed(2)}
              </Text>
            </View>

            {/* Ingredients */}
            {item.menuId?.ingredientItem && item.menuId.ingredientItem.length > 0 && (
              <View style={{ marginBottom: 8, marginTop: 3 }}>
                <Text style={{ fontSize: 10, color: '#666666', marginBottom: 2 }}>Ingredients:</Text>
                <Text style={{ fontSize: 9, color: '#333333' }}>
                  {item.menuId.ingredientItem.join(', ')}
                </Text>
              </View>
            )}

            {/* Add-ons */}
            {item.addOnItems && item.addOnItems.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={{ fontSize: 10, color: '#666666', marginBottom: 3 }}>Add-ons:</Text>
                {item.addOnItems.map((addon, addonIndex) => (
                  <View key={addon._id || addonIndex} style={{ ...pdfStyles.row, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 9, color: '#333333' }}>+ {addon.title}</Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>
                      {addon.price > 0 ? `£${Number(addon.price).toFixed(2)}` : 'Free'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Special Instructions */}
            {item.instructions && (
              <View style={pdfStyles.instructions}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#92400e', marginBottom: 3 }}>
                  Special Instructions:
                </Text>
                <Text style={{ fontSize: 10, color: '#78350f', fontStyle: 'italic' }}>
                  "{item.instructions}"
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={pdfStyles.totalRow}>
        <Text style={pdfStyles.totalLabel}>Total Amount</Text>
        <Text style={pdfStyles.totalValue}>£{Number(order.totalAmount).toFixed(2)}</Text>
      </View>

      {/* Footer */}
      <Text style={pdfStyles.footer}>
        Thank you for your order! For any inquiries, please contact us with your order reference number.
      </Text>
    </Page>
  </Document>
);

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id: orderId } = useParams();

  const [order, setOrder] = useState<IOrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  
  // Confirmation Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orders/${orderId}`);
        const data = response?.data?.data || response?.data || null;
        setOrder(data);
      } catch (error) {
        console.error("Error retrieving order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  // Handle Enter key for confirmation dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isConfirmOpen && pendingStatus) {
        e.preventDefault();
        confirmStatusChange();
      }
    };

    if (isConfirmOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirmOpen, pendingStatus]);

  const handleStatusSelect = (newStatus: string) => {
    if (newStatus === order?.status) return;
    setPendingStatus(newStatus);
    setIsConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!order || !pendingStatus) return;
    
    setIsConfirmOpen(false);
    try {
      setStatusUpdating(true);
      await axiosInstance.patch(`/orders/${order._id}`, { status: pendingStatus });
      setOrder((prev) =>
        prev ? { ...prev, status: pendingStatus as OrderStatus } : null,
      );
    } catch (error) {
      console.error("Failed to alter status state:", error);
    } finally {
      setStatusUpdating(false);
      setPendingStatus(null);
    }
  };

  const cancelStatusChange = () => {
    setIsConfirmOpen(false);
    setPendingStatus(null);
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "ready":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-black/5 text-black/80 border-black/20";
    }
  };

  // Calculate item total
  const getItemTotal = (item: IOrderItem) => {
    const basePrice = Number(item.menuId?.price || 0);
    const addonsTotal = item.addOnItems.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
    return (basePrice + addonsTotal) * item.quantity;
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "#fbbf24" : "rgba(0, 0, 0, 0.15)",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(251, 191, 36, 0.3)" : "none",
      "&:hover": { borderColor: "#fbbf24" },
      color: "black",
      fontSize: "0.875rem",
      height: "2.5rem",
      width: "170px",
      backgroundColor: "white",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#000000"
        : state.isFocused
          ? "rgba(251, 191, 36, 0.1)"
          : "white",
      color: state.isSelected ? "#fbbf24" : "black",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: state.isSelected ? "bold" : "normal",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
      fontWeight: "600",
    }),
    menu: (provided: any) => ({
      ...provided,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      borderRadius: "0.5rem",
      overflow: "hidden",
    }),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <BlinkingDots />
        <p className="text-black/60 mt-4 text-sm font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-black/60 text-lg font-medium">Order not found</p>
        <Button onClick={() => router.push("/admin/orders")} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 text-black">
      {/* Top Header Section */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-black/5 rounded-2xl p-6 border border-yellow-400/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                {order?.refId || `Order #${order._id.slice(-6)}`}
              </h1>
              <p className="text-sm text-black/50 mt-1">
                {moment(order?.createdAt).format('DD MMMM, YYYY • hh:mm A')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => router.push("/admin/orders")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {/* {order && (
              <PDFDownloadLink
                document={<OrderPDFDocument order={order} />}
                fileName={`order-${order.refId || order._id}.pdf`}
                className="inline-flex items-center gap-2 bg-black hover:bg-black/90 text-white font-semibold px-4 py-2 rounded-sm transition-colors text-sm shadow-md"
              >
                {({ loading: pdfLoading }) =>
                  pdfLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Download PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            )} */}
          </div>
        </div>

        {/* Status Update Section */}
        <div className="mt-4 pt-4 border-t border-yellow-400/20">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-black">Current Status:</span>
            <Badge
              className={`capitalize border-2 font-bold px-3 py-1 rounded-full text-sm ${getStatusBadgeVariant(order?.status as OrderStatus)}`}
            >
              {order?.status}
            </Badge>
            <span className="text-black/40 mx-2">→</span>
            <div className="flex items-center gap-2">
              <Select
                styles={customSelectStyles}
                options={statusOptions}
                value={statusOptions.find((o) => o.value === order?.status)}
                onChange={(val) => val && handleStatusSelect(val.value)}
                isSearchable={false}
                isDisabled={statusUpdating}
                placeholder="Update Status..."
              />
              {statusUpdating && (
                <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-black/10 bg-white shadow-lg rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-colors">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-5">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
                <Utensils className="w-5 h-5" /> Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {order.items.map((item, index) => (
                <div key={item._id || index} className="border border-gray-200 rounded-xl p-5 space-y-4">
                  {/* Item Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-black">
                          {item.menuId?.title || "Menu Item"}
                        </h3>
                        <Badge className="bg-black/10 text-black border-black/20">
                          x{item.quantity}
                        </Badge>
                      </div>
                      
                      {/* Ingredients */}
                      {item.menuId?.ingredientItem && item.menuId.ingredientItem.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.menuId.ingredientItem.map((ing, idx) => (
                            <span
                              key={idx}
                              className="bg-primary-foreground/20 text-black font-semibold text-xs px-2.5 py-1 rounded-full border border-primary-foreground/30"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}
                      
                     
                    </div>
                    <div className="font-extrabold text-xl text-red-600 shrink-0">
                      £{getItemTotal(item).toFixed(2)}
                    </div>
                  </div>

                  {/* Add-ons */}
                  {item.addOnItems && item.addOnItems.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-black/50 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        Add-ons
                      </h4>
                      <div className="space-y-1.5 pl-4">
                        {item.addOnItems.map((addon, addonIndex) => (
                          <div
                            key={addon._id || addonIndex}
                            className="flex justify-between items-center bg-yellow-400/5 p-2.5 rounded-lg border-l-4 border-yellow-400"
                          >
                            <span className="text-black font-semibold text-sm">
                              + {addon.title}
                            </span>
                            <span className="font-bold text-red-600 text-sm">
                              {addon.price > 0
                                ? `£${Number(addon.price).toFixed(2)}`
                                : "FREE"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {item.instructions && (
                    <div className="bg-yellow-400/10 border-2 border-yellow-400/30 p-4 rounded-xl">
                      <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                        <span>📝</span> Special Instructions
                      </h4>
                      <p className="text-black font-medium mt-2 bg-white border border-gray-200 p-3 rounded-lg text-sm">
                        "{item.instructions}"
                      </p>
                    </div>
                  )}

                  {/* Item Breakdown */}
                  <div className="bg-black/[0.02] rounded-lg p-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-black/60">Base Price:</span>
                      <span className="font-bold">£{Number(item.menuId?.price || 0).toFixed(2)}</span>
                    </div>
                    {item.addOnItems.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-black/60">Add-ons:</span>
                        <span className="font-bold">
                          £{item.addOnItems.reduce((sum, a) => sum + Number(a.price || 0), 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-black/60">Quantity:</span>
                      <span className="font-bold">x{item.quantity}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Item Total:</span>
                      <span className="font-bold text-red-600">£{getItemTotal(item).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Customer Details & Totals */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="border-2 border-black/10 bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="p-5">
              <CardTitle className="text-md font-bold flex items-center gap-2 text-black">
                <User className="w-5 h-5" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-sm">
              <div className="flex items-start gap-4 p-3 bg-black/[0.02] rounded-lg">
                <User className="w-5 h-5 text-black mt-0.5 shrink-0" />
                <div>
                  <div className="text-black/50 text-xs font-bold uppercase">Name</div>
                  <div className="font-bold text-black text-lg mt-0.5">
                    {order?.customerName}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-black/[0.02] rounded-lg">
                <Mail className="w-5 h-5 text-black mt-0.5 shrink-0" />
                <div>
                  <div className="text-black/50 text-xs font-bold uppercase">Email</div>
                  <div className="font-bold text-black mt-0.5 break-all">
                    {order?.customerEmail}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-black/[0.02] rounded-lg">
                <Phone className="w-5 h-5 text-black mt-0.5 shrink-0" />
                <div>
                  <div className="text-black/50 text-xs font-bold uppercase">Phone</div>
                  <div className="font-bold text-black text-lg mt-0.5">
                    {order?.customerPhone}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-black/[0.02] rounded-lg">
                <Clock className="w-5 h-5 text-black mt-0.5 shrink-0" />
                <div>
                  <div className="text-black/50 text-xs font-bold uppercase">Pickup Time</div>
                  <div className="font-bold text-black text-lg mt-0.5">
                    {order?.pickUpTime}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-black/[0.02] rounded-lg">
                <Hash className="w-5 h-5 text-black mt-0.5 shrink-0" />
                <div>
                  <div className="text-black/50 text-xs font-bold uppercase">Total Items</div>
                  <div className="font-bold text-black text-lg mt-0.5">
                    {order?.items?.length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Summary Card */}
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-yellow-400/20">
              <CardTitle className="text-md font-bold flex items-center gap-2 text-black">
                <Receipt className="w-5 h-5" /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-sm">
              {order.items.map((item, index) => (
                <div key={item._id || index} className="flex justify-between items-center text-black/80">
                  <span className="font-medium truncate mr-2">
                    {item.menuId?.title || "Item"} x{item.quantity}
                  </span>
                  <span className="font-bold shrink-0">
                    £{getItemTotal(item).toFixed(2)}
                  </span>
                </div>
              ))}

              <Separator className="bg-black/30 my-3" />

              <div className="flex justify-between items-center pt-2">
                <span className="font-extrabold text-lg text-black">Grand Total</span>
                <span className="font-extrabold text-2xl text-red-500 tracking-tight">
                  £{Number(order?.totalAmount).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-black/10 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-black mb-3">Confirm Update</h2>
            <p className="text-black/80 mb-6 text-sm">
              Are you sure you want to change the order status to{" "}
              <span className="font-bold text-black capitalize">'{pendingStatus}'</span>?
              <br />
              <span className="text-xs text-black/50 mt-2 block font-medium">
                Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5">Enter</kbd> to confirm.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={cancelStatusChange}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmStatusChange}
                className="bg-yellow-500 hover:bg-yellow-600 font-semibold"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}