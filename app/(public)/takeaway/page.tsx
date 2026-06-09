"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  CheckCircle2,
  ChefHat,
  Store,
  Loader2,
} from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

// --- INTERFACES matching backend schemas ---
interface TAddOnItem {
  _id?: string;
  title: string;
  price: number;
}

interface TCategory {
  _id: string;
  CategoryName: string;
  createdAt?: string;
}

interface TMenu {
  _id: string;
  title: string;
  description?: string;
  price: number;
  categoryId: string | { _id: string; CategoryName: string };
  image?: string;
  addOnItems: TAddOnItem[];
  ingredientItem: string[];
  cookingTime?: number;
}

interface CartItem {
  cartId: string;
  product: TMenu;
  quantity: number;
  selectedExtras: TAddOnItem[];
  specialNotes: string;
}

export default function TakeAwayPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [menuItems, setMenuItems] = useState<TMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<
    "ordering" | "checkout" | "success"
  >("ordering");
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Fetch categories & menu ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catRes, menuRes] = await Promise.all([
          axiosInstance.get("/category?limit=all"),
          axiosInstance.get(`/menu?limit=all&status=active`),
        ]);

        const cats: TCategory[] = catRes.data?.data?.result ?? [];
        const menus: TMenu[] = menuRes.data?.data?.result ?? [];

        const activeCategories = cats.filter((cat) =>
          menus.some((item) => {
            const catId =
              typeof item.categoryId === "object"
                ? item.categoryId._id
                : item.categoryId;
            return catId === cat._id;
          })
        );

        setCategories(activeCategories);
        setMenuItems(menus);
        if (activeCategories.length > 0)
          setCurrentCategory(activeCategories[0]._id);
      } catch (err) {
        console.error("Failed to load menu data:", err);
        toast({
          title: "Error",
          description: "Failed to load menu. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Modification Modal States
  const [modifyingItem, setModifyingItem] = useState<TMenu | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<TAddOnItem[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");

  // Checkout Form
  const [customerForm, setCustomerForm] = useState<{
    name: string;
    email: string;
    phone: string;
    collectionMethod: string;
    timing: "asap" | "schedule";
    time: { value: string; label: string } | null;
  }>({
    name: "",
    email: "",
    phone: "",
    collectionMethod: "store",
    timing: "asap",
    time: null,
  });

  // Calculate highest cooking time from the cart selection
  const maxCookingTime = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(...cart.map((item) => item.product.cookingTime || 0));
  }, [cart]);

  // Compute calculated target time for ASAP pickups
  const estimatedReadyTimeStr = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + maxCookingTime);
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }, [maxCookingTime]);

  // Generate discrete incremental pickup times adjusting for max cooking time
  const availableTimeSlots = useMemo(() => {
    const slots: { value: string; label: string }[] = [];
    const now = new Date();
    now.setMinutes(now.getMinutes() + maxCookingTime);

    const currentMinutes = now.getMinutes();
    const remainder = currentMinutes % 15;
    if (remainder !== 0) {
      now.setMinutes(currentMinutes + (15 - remainder));
    }
    now.setSeconds(0);
    now.setMilliseconds(0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 45, 0, 0);

    const tempTracker = new Date(now.getTime());
    while (tempTracker <= endOfDay) {
      const h = String(tempTracker.getHours()).padStart(2, "0");
      const m = String(tempTracker.getMinutes()).padStart(2, "0");
      const timeStr = `${h}:${m}`;
      slots.push({ value: timeStr, label: timeStr });
      tempTracker.setMinutes(tempTracker.getMinutes() + 15);
    }
    return slots;
  }, [maxCookingTime]);

  // Reset scheduling selection if the minimum processing window shifts
  useEffect(() => {
    setCustomerForm((prev) => ({ ...prev, time: null }));
  }, [maxCookingTime]);

  // Lock background scroll when modals are open
  useEffect(() => {
    if (modifyingItem || isMobileCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modifyingItem, isMobileCartOpen]);

  // --- Derived totals ---
  const getItemTotal = (item: CartItem) => {
    const extrasTotal = item.selectedExtras.reduce(
      (sum, e) => sum + e.price,
      0
    );
    return (item.product.price + extrasTotal) * item.quantity;
  };

  const totalBasketCost = useMemo(
    () => cart.reduce((total, item) => total + getItemTotal(item), 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // --- Filter menu by selected category ---
  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const catId =
          typeof item.categoryId === "object"
            ? item.categoryId._id
            : item.categoryId;
        return catId === currentCategory;
      }),
    [menuItems, currentCategory]
  );

  // --- Customizer ---
  const openCustomizer = (item: TMenu) => {
    setModifyingItem(item);
    setSelectedExtras([]);
    setSpecialNotes("");
  };

  const addToCart = () => {
    if (!modifyingItem) return;
    const newItem: CartItem = {
      cartId: `cart-${modifyingItem._id}-${Date.now()}`,
      product: modifyingItem,
      quantity: 1,
      selectedExtras: [...selectedExtras],
      specialNotes,
    };
    setCart((prev) => [...prev, newItem]);
    setModifyingItem(null);
  };

  const updateQuantity = (cartId: string, change: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.cartId !== cartId) return item;
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  // --- Submit order - UPDATED to match the Order model structure ---
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerForm.timing === "schedule" && !customerForm.time) return;

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before ordering.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform cart items to match the Order schema
      const orderItems = cart.map((item) => ({
        menuId: item.product._id,
        quantity: item.quantity,
        instructions: item.specialNotes || undefined,
        addOnItems: item.selectedExtras.map((extra) => ({
          title: extra.title,
          price: extra.price,
        })),
      }));

      // Generate a reference ID
      const refId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Calculate pickup time
      const pickUpTime =
        customerForm.timing === "asap"
          ? estimatedReadyTimeStr
          : customerForm.time!.value;

      // Send single order with all items (matching the Order model)
      const response = await axiosInstance.post("/orders", {
        items: orderItems,
        refId: refId,
        totalAmount: totalBasketCost,
        status: "pending",
        customerName: customerForm.name,
        customerPhone: customerForm.phone,
        customerEmail: customerForm.email
          ? customerForm.email.trim().toLowerCase()
          : "",
        pickUpTime: pickUpTime,
      });

      setOrderNumber(refId);
      setActiveStep("success");
      setIsMobileCartOpen(false);

     
    } catch (err: any) {
      console.error("Order submission failed:", err);
      const errorMsg =
        err?.response?.data?.message ||
        "Failed to place order. Please try again.";
      toast({
        title: "Order Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetOrder = () => {
    setActiveStep("ordering");
    setCart([]);
    setCustomerForm({
      name: "",
      email: "",
      phone: "",
      collectionMethod: "store",
      timing: "asap",
      time: null,
    });
  };

  // react-select custom styles
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      border: "1px solid #d4d4d8",
      borderRadius: "8px",
      padding: "1px",
      fontSize: "14px",
      boxShadow: "none",
      "&:hover": { borderColor: "#a1a1aa" },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#dc2626"
        : state.isFocused
        ? "#fef2f2"
        : "white",
      color: state.isSelected ? "white" : "#18181b",
      fontSize: "14px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#18181b",
      fontSize: "14px",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#a1a1aa",
      fontSize: "14px",
    }),
    menu: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  if (isLoading) {
    return (
      <SmoothScroll>
        <Hero
          title="Click & Collect"
          subtitle="Order online. We'll smash it fresh. Collect in minutes."
        />
        <div className="flex items-center justify-center min-h-[40vh] bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-black text-sm font-medium">Loading menu…</p>
          </div>
        </div>
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <Hero
        title="Click & Collect"
        subtitle="Order online. We'll smash it fresh. Collect in minutes."
      />

      <div className="bg-white text-zinc-900 min-h-screen">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {activeStep === "success" ? (
            /* SUCCESS SCREEN */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-4">
                Order Confirmed!
              </h2>
              <p className="text-black text-sm mb-6">
                We'll notify you when it's ready for collection.
              </p>

              <div className="bg-zinc-50 border rounded-2xl p-6 mb-8 text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black">Order Number</span>
                  <span className="font-bold">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Pickup Time</span>
                  <span className="font-bold">
                    {customerForm.timing === "asap"
                      ? `${estimatedReadyTimeStr} (ASAP)`
                      : customerForm.time?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Name</span>
                  <span className="font-bold">{customerForm.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Total Items</span>
                  <span className="font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Total Amount</span>
                  <span className="font-bold">
                    £{totalBasketCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={resetOrder}
                className="bg-red-600 text-white font-bold px-8 py-3 rounded-full hover:bg-red-700"
              >
                Place Another Order
              </Button>
            </motion.div>
          ) : (
            /* ORDERING / CHECKOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN - MENU */}
              <div
                className={`lg:col-span-8 space-y-6 ${
                  activeStep === "checkout" ? "hidden lg:block" : "block"
                }`}
              >
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 sticky top-0 bg-white z-10 pt-2 scrollbar-none">
                  {categories.map((category) => (
                    <Button
                      key={category._id}
                      onClick={() => setCurrentCategory(category._id)}
                      className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                        currentCategory === category._id
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {category.CategoryName.charAt(0).toUpperCase() +
                        category.CategoryName.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.length === 0 ? (
                    <p className="text-zinc-400 text-sm col-span-2 text-center py-10">
                      No items in this category yet.
                    </p>
                  ) : (
                    filteredItems.map((item) => {
                      const ingredientsString = Array.isArray(
                        item.ingredientItem
                      )
                        ? item.ingredientItem.join(", ")
                        : "";

                      return (
                        <div
                          key={item._id}
                          className="group border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-5 bg-white hover:border-red-200 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
                          onClick={() => openCustomizer(item)}
                        >
                          {/* Product Image */}
                          <div className="w-full sm:w-36 sm:h-36 h-48 rounded-xl overflow-hidden bg-zinc-100 shrink-0 relative">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                                <ChefHat className="w-8 h-8 text-zinc-300" />
                              </div>
                            )}
                           
                          </div>

                          {/* Content */}
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <h3 className="font-extrabold text-base sm:text-lg leading-tight text-zinc-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                                {item.title}
                              </h3>
                              {ingredientsString && (
                                <h4 className="text-xs text-zinc-500 font-medium leading-relaxed mt-1.5 line-clamp-2">
                                  {ingredientsString}
                                </h4>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                              <span className="font-black text-base sm:text-lg text-zinc-900">
                                £{item.price.toFixed(2)}
                              </span>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCustomizer(item);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all duration-200"
                              >
                                Add To Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN - CART / CHECKOUT */}
              <div
                className={`lg:col-span-4 ${
                  activeStep === "checkout" ? "block" : "hidden lg:block"
                }`}
              >
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200">
                    <h3 className="font-bold flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Your Order
                    </h3>
                    <span className="bg-zinc-200 text-zinc-700 text-xs font-bold px-2 py-1 rounded-full">
                      {totalItems} items
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-zinc-400 text-sm text-center py-8">
                      Your cart is empty. Add some items to get started!
                    </p>
                  ) : (
                    <>
                      {/* Cart Items List */}
                      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-2">
                        {cart.map((item) => (
                          <div
                            key={item.cartId}
                            className="flex justify-between items-start pb-3 border-b border-zinc-200"
                          >
                            <div className="flex gap-3 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-zinc-200 shrink-0 overflow-hidden relative">
                                {item.product.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ChefHat className="w-6 h-6 m-auto mt-3 text-zinc-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">
                                  {item.product.title}
                                </h4>
                                {item.selectedExtras.length > 0 && (
                                  <p className="text-xs text-zinc-600 mt-1">
                                    +{" "}
                                    {item.selectedExtras
                                      .map((e) => e.title)
                                      .join(", ")}
                                  </p>
                                )}
                                {item.specialNotes && (
                                  <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 rounded-lg italic break-words">
                                    <span className="font-bold not-italic block mb-0.5 text-[10px] uppercase tracking-wide text-amber-900">
                                      Note:
                                    </span>
                                    "{item.specialNotes}"
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <span className="font-bold text-sm">
                                £{getItemTotal(item).toFixed(2)}
                              </span>
                              <div className="flex items-center gap-1.5 bg-white border rounded-full p-0.5 shadow-sm">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.cartId, -1)
                                  }
                                  className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-bold text-xs w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.cartId, 1)
                                  }
                                  className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Area */}
                      {activeStep === "ordering" ? (
                        <>
                          <div className="flex justify-between items-center mb-4 pt-2">
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-800 text-sm">
                                Total Amount
                              </span>
                              <span className="text-[11px] text-zinc-500 font-medium">
                                Est. Prep: {maxCookingTime} mins
                              </span>
                            </div>
                            <span className="text-2xl font-black text-zinc-900">
                              £{totalBasketCost.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveStep("checkout")}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors shadow-md"
                          >
                            Proceed to Checkout
                          </button>
                        </>
                      ) : (
                        <form
                          onSubmit={handleSubmitOrder}
                          className="space-y-4 pt-4"
                        >
                          {/* Personal Details */}
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-zinc-800">
                              Your Details
                            </h4>
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={customerForm.name}
                                onChange={(e) =>
                                  setCustomerForm({
                                    ...customerForm,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full rounded-[5px] p-2 border border-zinc-300 text-sm focus:outline-none focus:border-red-500"
                              />
                              <input
                                type="email"
                                placeholder="Email Address"
                                required
                                value={customerForm.email}
                                onChange={(e) =>
                                  setCustomerForm({
                                    ...customerForm,
                                    email: e.target.value,
                                  })
                                }
                                className="w-full rounded-[5px] p-2 border border-zinc-300 text-sm focus:outline-none focus:border-red-500"
                              />
                              <input
                                type="tel"
                                placeholder="Phone Number"
                                required
                                value={customerForm.phone}
                                onChange={(e) =>
                                  setCustomerForm({
                                    ...customerForm,
                                    phone: e.target.value,
                                  })
                                }
                                className="w-full p-2 border border-zinc-300 rounded-[5px] text-sm focus:outline-none focus:border-red-500"
                              />
                            </div>
                          </div>

                          {/* Collection Method */}
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-zinc-800">
                              Collection Method
                            </h4>
                            <div className="flex items-center justify-between p-3 border-2 border-red-600 bg-red-50 rounded-xl">
                              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                                <Store className="w-5 h-5" />
                                <span>Collect From Store</span>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-red-600" />
                            </div>
                          </div>

                          {/* Pickup Time */}
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-zinc-800">
                              Pickup Time
                            </h4>
                            <div className="flex gap-2 mb-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomerForm({
                                    ...customerForm,
                                    timing: "asap",
                                    time: null,
                                  })
                                }
                                className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                                  customerForm.timing === "asap"
                                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                                    : "bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50"
                                }`}
                              >
                                ASAP ({estimatedReadyTimeStr})
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomerForm({
                                    ...customerForm,
                                    timing: "schedule",
                                  })
                                }
                                className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                                  customerForm.timing === "schedule"
                                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                                    : "bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50"
                                }`}
                              >
                                Schedule Time
                              </button>
                            </div>

                            {customerForm.timing === "schedule" && (
                              <div data-lenis-prevent>
                                <Select
                                  options={availableTimeSlots}
                                  value={customerForm.time}
                                  onChange={(val) =>
                                    setCustomerForm({
                                      ...customerForm,
                                      time: val,
                                    })
                                  }
                                  placeholder={
                                    availableTimeSlots.length === 0
                                      ? "No slots available today"
                                      : "Select Pickup Time"
                                  }
                                  styles={selectStyles}
                                  isSearchable={false}
                                  required
                                  isDisabled={availableTimeSlots.length === 0}
                                  menuPosition="fixed"
                                  menuPlacement="top"
                                  closeMenuOnScroll={false}
                                  menuShouldBlockScroll={true}
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setActiveStep("ordering")}
                              className="flex-1 bg-zinc-200 text-zinc-700 font-bold py-2.5 rounded-full text-xs hover:bg-zinc-300 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={
                                isSubmitting ||
                                (customerForm.timing === "schedule" &&
                                  !customerForm.time)
                              }
                              className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-full text-xs disabled:opacity-60 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Placing…
                                </>
                              ) : (
                                "Place Order"
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOMIZER MODAL */}
      <AnimatePresence>
        {modifyingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModifyingItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {modifyingItem.image && (
                <div className="w-full h-48 bg-zinc-100 shrink-0 relative">
                  <img
                    src={modifyingItem.image}
                    alt={modifyingItem.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setModifyingItem(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/70 rounded-full backdrop-blur-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="p-6 border-b shrink-0 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{modifyingItem.title}</h3>
                    {modifyingItem.cookingTime && (
                      <span className="inline-block mt-1 bg-zinc-100 text-zinc-600 font-semibold text-[11px] px-2 py-0.5 rounded-md">
                        Prep Time: {modifyingItem.cookingTime} mins
                      </span>
                    )}
                  </div>
                  {!modifyingItem.image && (
                    <button
                      onClick={() => setModifyingItem(null)}
                      className="p-1 hover:bg-zinc-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  £
                  {(
                    modifyingItem.price +
                    selectedExtras.reduce((s, e) => s + e.price, 0)
                  ).toFixed(2)}
                </p>
              </div>

              <div
                data-lenis-prevent
                className="p-6 space-y-6 overflow-y-auto flex-1"
                onWheel={(e) => e.stopPropagation()}
              >
                {modifyingItem.addOnItems?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-2">Add Extras</h4>
                    <div className="space-y-2">
                      {modifyingItem.addOnItems.map((extra, idx) => {
                        const isSelected = selectedExtras.some(
                          (e) => e.title === extra.title
                        );
                        return (
                          <button
                            key={extra._id ?? idx}
                            onClick={() =>
                              setSelectedExtras((prev) =>
                                isSelected
                                  ? prev.filter((e) => e.title !== extra.title)
                                  : [...prev, extra]
                              )
                            }
                            className={`w-full flex justify-between items-center p-3 rounded-xl border text-sm font-bold transition-all ${
                              isSelected
                                ? "border-red-300 bg-red-50 text-red-600"
                                : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            <span>{extra.title}</span>
                            <span>+£{extra.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm mb-2">
                    Special Instructions
                  </h4>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Allergies, cooking preference, etc..."
                    rows={3}
                    className="w-full border border-zinc-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div className="p-6 border-t shrink-0 bg-white">
                <button
                  onClick={addToCart}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors"
                >
                  Add to Cart — £
                  {(
                    modifyingItem.price +
                    selectedExtras.reduce((s, e) => s + e.price, 0)
                  ).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE CART BAR */}
      {cart.length > 0 && activeStep === "ordering" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-40 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-black font-bold">{totalItems} items</p>
              <p className="text-lg font-bold">
                £{totalBasketCost.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* MOBILE CART DRAWER */}
      <AnimatePresence>
        {isMobileCartOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileCartOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Your Order
                </h3>
                <Button
                  onClick={() => setIsMobileCartOpen(false)}
                  variant="ghost"
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex justify-between items-start pb-3 border-b"
                  >
                    <div className="flex gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-zinc-200 shrink-0 overflow-hidden relative">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ChefHat className="w-6 h-6 m-auto mt-3 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">
                          {item.product.title}
                        </h4>
                        {item.selectedExtras.length > 0 && (
                          <p className="text-xs text-zinc-600 mt-1">
                            +{" "}
                            {item.selectedExtras
                              .map((e) => e.title)
                              .join(", ")}
                          </p>
                        )}
                        {item.specialNotes && (
                          <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 rounded-lg italic break-words">
                            <span className="font-bold not-italic block mb-0.5 text-[10px] uppercase tracking-wide text-amber-900">
                              Note:
                            </span>
                            "{item.specialNotes}"
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="font-bold text-sm">
                        £{getItemTotal(item).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 bg-zinc-100 rounded-full p-0.5 shadow-sm">
                        <Button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="p-1 h-6 w-6"
                          variant="ghost"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </Button>
                        <span className="font-bold text-xs w-4 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="p-1 h-6 w-6"
                          variant="ghost"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-sm">Total</span>
                  <span className="text-xl font-bold text-zinc-900">
                    £{totalBasketCost.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => {
                    setActiveStep("checkout");
                    setIsMobileCartOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SmoothScroll>
  );
}