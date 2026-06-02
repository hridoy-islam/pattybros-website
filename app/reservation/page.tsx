"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, Phone, Mail, User, CheckCircle } from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";

export default function ReservationPage() {
  const title = "Reservations";
  const subtitle = "Secure your place at the table. Crafted moments await.";

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guests: "2 People",
    date: "",
    time: "7:00 PM",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API transmission delay
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <SmoothScroll>
      <Hero title={title} subtitle={subtitle} />

      {/* Main Page Wrapper - Transformed to a clean, crisp white background */}
      <div className="bg-white text-zinc-900 min-h-screen py-20 px-4 relative overflow-hidden flex items-center justify-center">
        
        {/* Subtle upscale geometric grid lines underlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-3xl w-full relative z-10">
          <AnimatePresence mode="wait">
            
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                /* White luxury frame architecture inspired directly by image_4a83ba.png */
                className="bg-white border-2 border-primary/40 p-8 md:p-16 relative rounded-sm shadow-xl shadow-zinc-200/50"
              >
                {/* Internal fine-line accent border mimicking image_4a83ba.png */}
                <div className="absolute inset-2 md:inset-4 border border-primary/20 pointer-events-none rounded-sm" />

                {/* --- HEADER BLOCK --- */}
                <div className="text-center space-y-4 mb-12 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-primary tracking-[1.3rem] font-black text-[14px] uppercase">
                    <h4><span>✦</span> Online Reservation <span>✦</span></h4>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl  text-zinc-900 tracking-wide ">
                    Book A Table
                  </h2>
                  
                  <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto font-medium leading-relaxed">
                    Booking request{" "}
                    <a href="tel:+18008529001" className="text-primary-foreground hover:underline transition-all font-bold">
                      +1-800-852-9001
                    </a>{" "}
                    or fill out the order form below.
                  </p>
                </div>

                {/* --- INPUT MATRIX FORM --- */}
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Guest Name */}
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 transition-colors"
                      />
                      <User className="w-4 h-4 text-zinc-400 absolute right-4 top-4 group-focus-within:text-primary transition-colors" />
                    </div>

                    {/* Phone Number */}
                    <div className="relative group">
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 transition-colors"
                      />
                      <Phone className="w-4 h-4 text-zinc-400 absolute right-4 top-4 group-focus-within:text-primary transition-colors" />
                    </div>

                    {/* Email Terminal */}
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-zinc-400 absolute right-4 top-4 group-focus-within:text-primary transition-colors" />
                    </div>

                    {/* Guest Count Dropdown Selector */}
                    <div className="relative group">
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-bold appearance-none cursor-pointer transition-colors"
                      >
                        <option value="1 Person">1 Person</option>
                        <option value="2 People">2 People</option>
                        <option value="4 People">4 People</option>
                        <option value="6 People">6 People</option>
                        <option value="8+ People">8+ Large Group</option>
                      </select>
                      <Users className="w-4 h-4 text-zinc-400 absolute right-4 top-4 pointer-events-none" />
                    </div>

                    {/* Calendar Field */}
                    <div className="relative group">
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-bold transition-colors"
                      />
                      <Calendar className="w-4 h-4 text-zinc-400 absolute right-4 top-4 pointer-events-none hidden md:block" />
                    </div>

                    {/* Time Window Selector */}
                    <div className="relative group">
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-bold appearance-none cursor-pointer transition-colors"
                      >
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                      </select>
                      <Clock className="w-4 h-4 text-zinc-400 absolute right-4 top-4 pointer-events-none" />
                    </div>

                  </div>

                  {/* Message / Special Notes Field */}
                  <div className="relative">
                    <textarea
                      rows={4}
                      placeholder="Message / Special Dietary Instructions / Occasion Notes..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-zinc-50/80 border border-zinc-200 focus:border-primary text-zinc-900 p-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 resize-none transition-colors"
                    />
                  </div>

                  {/* Solid Theme Action Button (Yellow/Gold Primary) */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary font-black text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-amber-400 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                  >
                    {loading ? "Transmitting Request..." : "Send Message"}
                  </Button>

                </form>
              </motion.div>
            ) : (
              /* --- LIGHT THEME SUCCESS CONFIRMATION --- */
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-primary/40 p-8 md:p-16 text-center relative rounded-sm shadow-xl space-y-6"
              >
                <div className="absolute inset-2 md:inset-4 border border-primary/20 pointer-events-none rounded-sm" />
                
                <div className="w-16 h-16 bg-zinc-50 border border-primary/30 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8 stroke-[1.5]" />
                </div>

                <div className="space-y-2 relative z-10">
                  <p className="text-primary tracking-[0.2em] font-black text-[10px] uppercase">Request Authenticated</p>
                  <h3 className="text-3xl  text-zinc-900 tracking-wide">Table Provisionally Held</h3>
                  <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed font-medium">
                    Thank you, <span className="text-zinc-900 font-bold">{formData.name}</span>. We have noted your reservation request for <span className="text-zinc-900 font-bold">{formData.guests}</span> on <span className="text-zinc-900 font-bold">{formData.date || "Selected Date"}</span> at <span className="text-zinc-900 font-bold">{formData.time}</span>.
                  </p>
                </div>

                <div className="pt-4 relative z-10">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 border border-primary text-zinc-900 hover:bg-primary hover:text-zinc-950 font-black text-[10px] uppercase tracking-widest rounded-sm transition-all cursor-pointer"
                  >
                    Modify Selection Itinerary
                  </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

      </div>
    </SmoothScroll>
  );
}