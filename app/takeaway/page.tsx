"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, Clock, CheckCircle2,
  ChevronRight, X, Info, ChevronDown, Check, ChefHat
} from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";

// --- CORE INTERFACES ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients?: string[];
}

interface CartItem {
  cartId: string;
  product: MenuItem;
  quantity: number;
  selectedExtras: { name: string; price: number }[];
  removals: string[];
  specialNotes: string;
  isMealDeal?: boolean;
  mealComponents?: { burger: string; fries: string; drink: string };
}

// --- MENU DATA ---
const MENU_CATEGORIES = [
  "Beef Burgers", "Chicken Burgers", "Veggie Burgers", 
  "Loaded Fries", "Sides", "Dips", "Drinks", "Meal Deals"
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: "bf-1",
    name: "Classic Smash",
    description: "Double dry-aged beef patties, mature cheddar, house pickles, Bro's sauce on potato bun.",
    price: 10.50,
    category: "Beef Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    ingredients: ["Potato Bun", "Dry Aged Beef", "Mature Cheddar", "Pickles", "Bro's Sauce"]
  },
  {
    id: "bf-2",
    name: "Smoky Bro",
    description: "Double smashed patty, applewood cheese, crispy bacon, onion ring, BBQ glaze.",
    price: 11.95,
    category: "Beef Burgers",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80",
    ingredients: ["Potato Bun", "Beef Patties", "Applewood Cheese", "Smoked Bacon", "Onion Ring", "BBQ Glaze"]
  },
  {
    id: "ch-1",
    name: "Nashville Hot",
    description: "Buttermilk fried chicken, Nashville hot glaze, vinegar slaw, sweet pickles, brioche bun.",
    price: 11.00,
    category: "Chicken Burgers",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80",
    ingredients: ["Brioche Bun", "Fried Chicken", "Nashville Glaze", "Vinegar Slaw", "Pickles"]
  },
  {
    id: "vg-1",
    name: "Green Smash",
    description: "Plant-based patty, vegan cheddar, heirloom tomato, artisan lettuce on gluten-free bun.",
    price: 10.50,
    category: "Veggie Burgers",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=80",
    ingredients: ["Gluten-Free Bun", "Plant Patty", "Vegan Cheddar", "Tomatoes", "Lettuce"]
  },
  {
    id: "fr-1",
    name: "Truffle Fries",
    description: "Hand-cut fries, white truffle essence, shaved aged parmesan.",
    price: 6.50,
    category: "Loaded Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "sd-1",
    name: "Onion Rings",
    description: "Beer-battered thick onion rings with smoked paprika dust.",
    price: 4.25,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dp-1",
    name: "Bro's Sauce",
    description: "Our award-winning signature dipping sauce.",
    price: 1.50,
    category: "Dips",
    image: "https://images.unsplash.com/photo-1626127136500-24b2207ff0b0?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "dr-1",
    name: "Craft Cola",
    description: "Cane sugar cola served ice-cold.",
    price: 3.00,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80"
  }
];

const EXTRAS_LIST = [
  { name: "Extra Beef Patty", price: 2.50 },
  { name: "Extra Chicken", price: 2.50 },
  { name: "Extra Cheese", price: 1.00 },
  { name: "Extra Sauce", price: 0.50 }
];

const TIME_SLOTS = ["ASAP (15-20 mins)", "6:15 PM", "6:30 PM", "6:45 PM", "7:00 PM", "7:15 PM", "7:30 PM"];

export default function TakeAwayPage() {
  const [currentCategory, setCurrentCategory] = useState("Beef Burgers");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<"ordering" | "checkout" | "success">("ordering");
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Modification Modal States
  const [modifyingItem, setModifyingItem] = useState<MenuItem | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");

  // Meal Deal States
  const [isBuildingMeal, setIsBuildingMeal] = useState(false);
  const [mealSelection, setMealSelection] = useState({ burger: "", fries: "", drink: "" });

  // Checkout Form
  const [customerForm, setCustomerForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    time: "ASAP (15-20 mins)" 
  });

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

  // Calculate total basket cost
  const totalBasketCost = useMemo(() => {
    return cart.reduce((total, item) => {
      if (item.isMealDeal) return total + (14.00 * item.quantity);
      const extrasCost = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
      return total + ((item.product.price + extrasCost) * item.quantity);
    }, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Customizer Functions
  const openCustomizer = (item: MenuItem) => {
    setModifyingItem(item);
    setSelectedExtras([]);
    setSelectedRemovals([]);
    setSpecialNotes("");
  };

  const addToCart = () => {
    if (!modifyingItem) return;
    const newItem: CartItem = {
      cartId: `cart-${modifyingItem.id}-${Date.now()}`,
      product: modifyingItem,
      quantity: 1,
      selectedExtras: [...selectedExtras],
      removals: [...selectedRemovals],
      specialNotes
    };
    setCart(prev => [...prev, newItem]);
    setModifyingItem(null);
  };

  const addMealDealToCart = () => {
    const mealProduct: MenuItem = {
      id: "meal-deal",
      name: "Meal Deal Combo",
      description: `${mealSelection.burger} + ${mealSelection.fries} + ${mealSelection.drink}`,
      price: 14.00,
      category: "Meal Deals",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80"
    };

    const mealItem: CartItem = {
      cartId: `meal-${Date.now()}`,
      product: mealProduct,
      quantity: 1,
      selectedExtras: [],
      removals: [],
      specialNotes: "",
      isMealDeal: true,
      mealComponents: { ...mealSelection }
    };

    setCart(prev => [...prev, mealItem]);
    setIsBuildingMeal(false);
    setMealSelection({ burger: "", fries: "", drink: "" });
  };

  const updateQuantity = (cartId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep("success");
    setIsMobileCartOpen(false);
  };

  const resetOrder = () => {
    setActiveStep("ordering");
    setCart([]);
    setCustomerForm({ name: "", phone: "", email: "", time: "ASAP (15-20 mins)" });
  };

  const getItemTotal = (item: CartItem) => {
    if (item.isMealDeal) return 14.00 * item.quantity;
    const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return (item.product.price + extrasTotal) * item.quantity;
  };

  // Filter menu items by current category
  const filteredItems = MENU_ITEMS.filter(item => item.category === currentCategory);

  return (
    <SmoothScroll>
      <Hero 
        title="Click & Collect" 
        subtitle="Order online. We'll smash it fresh. Collect in minutes." 
      />

      <div className="bg-white text-zinc-900 min-h-screen">
        <div className="container mx-auto  py-10">
          
          {activeStep === "success" ? (
            /* SUCCESS SCREEN */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center py-16"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Order Confirmed!</h2>
              <p className="text-zinc-600 mb-2">Order #B-{Math.floor(Math.random() * 9000) + 1000}</p>
              <p className="text-zinc-500 text-sm mb-6">We'll notify you when it's ready for collection.</p>
              
              <div className="bg-zinc-50 border rounded-2xl p-6 mb-8 text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pickup Time</span>
                  <span className="font-bold">{customerForm.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Name</span>
                  <span className="font-bold">{customerForm.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Paid</span>
                  <span className="font-bold">£{totalBasketCost.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={resetOrder}
                className="bg-zinc-900 text-white font-bold px-8 py-3 rounded-full hover:bg-zinc-800"
              >
                Place Another Order
              </Button>
            </motion.div>
          ) : (
            /* ORDERING / CHECKOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN - MENU */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 sticky top-0 bg-white z-10 pt-2">
                  {MENU_CATEGORIES.map(category => (
                    <Button
                      key={category}
                      onClick={() => setCurrentCategory(category)}
                      className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                        currentCategory === category 
                          ? "bg-red-600 text-white" 
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Meal Deal Builder */}
                {currentCategory === "Meal Deals" && (
                  <div className="bg-zinc-900 text-white p-8 rounded-3xl">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <ChefHat className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Best Value</span>
                    </div>
                    <h3 className="text-2xl font-black mb-2">Meal Deal - £14.00</h3>
                    <p className="text-zinc-400 text-sm mb-6">Any burger + fries + drink</p>
                    
                    {!isBuildingMeal ? (
                      <Button 
                        onClick={() => setIsBuildingMeal(true)}
                        className="bg-yellow-400 text-zinc-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300"
                      >
                        Build Your Meal
                      </Button>
                    ) : (
                      <div className="space-y-4 bg-zinc-800 p-4 rounded-2xl">
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1">Burger</label>
                          <select 
                            value={mealSelection.burger}
                            onChange={(e) => setMealSelection({...mealSelection, burger: e.target.value})}
                            className="w-full bg-zinc-700 text-white border-none rounded-lg p-2 text-sm"
                          >
                            <option value="">Select Burger</option>
                            <option value="Classic Smash">Classic Smash</option>
                            <option value="Smoky Bro">Smoky Bro</option>
                            <option value="Nashville Hot">Nashville Hot</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1">Fries / Side</label>
                          <select 
                            value={mealSelection.fries}
                            onChange={(e) => setMealSelection({...mealSelection, fries: e.target.value})}
                            className="w-full bg-zinc-700 text-white border-none rounded-lg p-2 text-sm"
                          >
                            <option value="">Select Side</option>
                            <option value="Truffle Fries">Truffle Fries</option>
                            <option value="Onion Rings">Onion Rings</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1">Drink</label>
                          <select 
                            value={mealSelection.drink}
                            onChange={(e) => setMealSelection({...mealSelection, drink: e.target.value})}
                            className="w-full bg-zinc-700 text-white border-none rounded-lg p-2 text-sm"
                          >
                            <option value="">Select Drink</option>
                            <option value="Craft Cola">Craft Cola</option>
                            <option value="Sparkling Water">Sparkling Water</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setIsBuildingMeal(false)}
                            className="flex-1 bg-zinc-700 text-white font-bold py-2 rounded-full text-sm"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={addMealDealToCart}
                            disabled={!mealSelection.burger || !mealSelection.fries || !mealSelection.drink}
                            className="flex-1 bg-yellow-400 text-zinc-900 font-bold py-2 rounded-full text-sm disabled:opacity-50"
                          >
                            Add Meal
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map(item => (
                    <div 
                      key={item.id} 
                      className="border border-zinc-200 rounded-2xl p-4 flex gap-4 hover:border-zinc-300 transition-all"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                          <p className="text-zinc-500 text-sm line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-lg">£{item.price.toFixed(2)}</span>
                          <Button 
                            onClick={() => openCustomizer(item)}
                            className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN - CART (Desktop) */}
              <div className="hidden lg:block lg:col-span-4">
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
                      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                        {cart.map(item => (
                          <div key={item.cartId} className="flex justify-between items-start pb-3 border-b border-zinc-200">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm">{item.product.name}</h4>
                              {item.mealComponents && (
                                <div className="text-xs text-zinc-500 mt-1">
                                  <p>{item.mealComponents.burger}</p>
                                  <p>{item.mealComponents.fries}</p>
                                  <p>{item.mealComponents.drink}</p>
                                </div>
                              )}
                              {item.selectedExtras.length > 0 && (
                                <p className="text-xs text-zinc-500 mt-1">
                                  + {item.selectedExtras.map(e => e.name).join(", ")}
                                </p>
                              )}
                              {item.removals.length > 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                  No: {item.removals.join(", ")}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              <span className="font-bold">£{getItemTotal(item).toFixed(2)}</span>
                              <div className="flex items-center gap-2 bg-white border rounded-full px-1">
                                <button 
                                  onClick={() => updateQuantity(item.cartId, -1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 rounded-full"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.cartId, 1)}
                                  className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 rounded-full"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {activeStep === "ordering" ? (
                        <>
                          <div className="flex justify-between items-center mb-4 pt-4 border-t border-zinc-200">
                            <span className="font-bold text-zinc-500">Total</span>
                            <span className="text-2xl font-black">£{totalBasketCost.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => setActiveStep("checkout")}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700"
                          >
                            Proceed to Checkout
                          </button>
                        </>
                      ) : (
                        <form onSubmit={handleSubmitOrder} className="space-y-3 pt-4 border-t border-zinc-200">
                          <h4 className="font-bold text-sm">Collection Details</h4>
                          <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={customerForm.name}
                            onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                            className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            required
                            value={customerForm.phone}
                            onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                            className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            required
                            value={customerForm.email}
                            onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                            className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                          />
                          <select
                            value={customerForm.time}
                            onChange={(e) => setCustomerForm({...customerForm, time: e.target.value})}
                            className="w-full p-2 border border-zinc-300 rounded-lg text-sm"
                          >
                            {TIME_SLOTS.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveStep("ordering")}
                              className="flex-1 bg-zinc-200 text-zinc-700 font-bold py-2 rounded-full text-sm"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="flex-1 bg-red-600 text-white font-bold py-2 rounded-full text-sm"
                            >
                              Place Order
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
              className="absolute inset-0 bg-black/50" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              // CHANGED: max-w-md -> max-w-xl to make wider. 
              // Changed overflow handling to a flex-col so standard internal scrolling works perfectly over Framer animations.
              className="relative bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* Header: shrink-0 keeps it fixed at the top */}
              <div className="p-6 border-b shrink-0 bg-white rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{modifyingItem.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{modifyingItem.description}</p>
                  </div>
                  <button 
                    onClick={() => setModifyingItem(null)}
                    className="p-1 hover:bg-zinc-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  £{(modifyingItem.price + selectedExtras.reduce((s, e) => s + e.price, 0)).toFixed(2)}
                </p>
              </div>

              {/* Body: flex-1 and overflow-y-auto lets ONLY the middle content scroll smoothly */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Ingredients / Removals */}
                {modifyingItem.ingredients && modifyingItem.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm mb-2">Remove Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {modifyingItem.ingredients.map(ing => {
                        const isRemoved = selectedRemovals.includes(ing);
                        return (
                          <button
                            key={ing}
                            onClick={() => setSelectedRemovals(prev => 
                              isRemoved ? prev.filter(i => i !== ing) : [...prev, ing]
                            )}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                              isRemoved 
                                ? "border-red-300 bg-red-50 text-red-600 line-through" 
                                : "border-zinc-200 hover:border-zinc-300"
                            }`}
                          >
                            {ing}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Extras */}
                <div>
                  <h4 className="font-bold text-sm mb-2">Add Extras</h4>
                  <div className="space-y-2">
                    {EXTRAS_LIST.map(extra => {
                      const isSelected = selectedExtras.some(e => e.name === extra.name);
                      return (
                        <button
                          key={extra.name}
                          onClick={() => setSelectedExtras(prev => 
                            isSelected 
                              ? prev.filter(e => e.name !== extra.name) 
                              : [...prev, extra]
                          )}
                          className={`w-full flex justify-between items-center p-3 rounded-xl border text-sm font-bold transition-all ${
                            isSelected 
                              ? "border-red-300 bg-red-50 text-red-600" 
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <span>{extra.name}</span>
                          <span>+£{extra.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <h4 className="font-bold text-sm mb-2">Special Instructions</h4>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Allergies, cooking preference, etc..."
                    rows={3}
                    className="w-full border border-zinc-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              {/* Footer: shrink-0 keeps it fixed at the bottom */}
              <div className="p-6 border-t shrink-0 bg-white rounded-b-2xl">
                <button
                  onClick={addToCart}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700"
                >
                  Add to Cart - £{(modifyingItem.price + selectedExtras.reduce((s, e) => s + e.price, 0)).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE CART BAR */}
      {cart.length > 0 && activeStep !== "success" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-40 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-bold">{totalItems} items</p>
              <p className="text-lg font-bold">£{totalBasketCost.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm"
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
              className="absolute inset-0 bg-black/50" 
            />
            
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full min-w-lg bg-white shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Your Order</h3>
                <Button onClick={() => setIsMobileCartOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between items-start pb-3 border-b">
                    <div>
                      <h4 className="font-bold">{item.product.name}</h4>
                      {item.mealComponents && (
                        <div className="text-xs text-zinc-500">
                          <p>{item.mealComponents.burger}</p>
                          <p>{item.mealComponents.fries}</p>
                          <p>{item.mealComponents.drink}</p>
                        </div>
                      )}
                      {item.selectedExtras.length > 0 && (
                        <p className="text-xs text-zinc-500">
                          + {item.selectedExtras.map(e => e.name).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold">£{getItemTotal(item).toFixed(2)}</span>
                      <div className="flex items-center gap-2 bg-zinc-100 rounded-full px-1">
                        <Button onClick={() => updateQuantity(item.cartId, -1)} className="p-1">
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-bold text-sm">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.cartId, 1)} className="p-1">
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold">£{totalBasketCost.toFixed(2)}</span>
                </div>
                {activeStep === "ordering" ? (
                  <Button
                    onClick={() => {
                      setActiveStep("checkout");
                      setIsMobileCartOpen(false);
                    }}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-full"
                  >
                    Checkout
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsMobileCartOpen(false)}
                    className="w-full bg-zinc-200 text-zinc-700 font-bold py-3 rounded-full"
                  >
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SmoothScroll>
  );
}