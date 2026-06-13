"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { contactContent } from "@/utils/content";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const { title, subtitle } = contactContent.hero;
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Form State Setup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const payload = {
        name: formData.name,
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject,
        phone: formData.phone,
        message: formData.message,
      };

      // Executes both endpoint requests simultaneously using native fetch
      const responses = await Promise.all([
        fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        fetch("/api/send-email-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
      ]);

      // Native fetch checks: Verify both network operations succeeded 
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Server encountered an error processing requests.");
        }
      }

      // Restored success toast configuration
      // toast({
      //   title: "Message Sent Successfully!",
      //   description: "We'll get back to you as soon as possible.",
      // });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });
      
    } catch (error: any) {
      console.error(error);
      const fallbackMsg = error?.message || "Failed to send message. Please try again.";
      toast({
        title: "Error",
        description: fallbackMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <SmoothScroll>
      {/* 1. Header Hero Core Overlay Banner Component */}
      <Hero title={title} subtitle={subtitle} />

      {/* WRAPPED IN SECTION AS REQUESTED */}
      <section className="bg-white pb-0 mt-0 relative z-30">
        <div className="container mx-auto ">
          
          {/* ==================== SECTION A: INFO CARDS ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-40 mt-12 mb-12">
            
            {/* Card 1: Our Address */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="bg-white rounded-sm shadow-xl shadow-zinc-200/60 p-8 flex flex-col items-center text-center border border-zinc-200"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground bg-red-50/60 mb-5 border border-red-100/20">
                <MapPin className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="text-zinc-900 font-extraboldtext-sm uppercase tracking-[0.15em] mb-2 select-none">
                Our Address
              </h4>
              <p className="text-sm font-semibold leading-relaxed ">
                Patty Bros, Market Place Peckham<br />
                Unit 10, The Aylesham Shopping Centre<br />
                Rye Ln, Peckham<br />
                London SE15 5EW
              </p>
            </motion.div>

            {/* Card 2: Email Address */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-sm shadow-xl shadow-zinc-200/60 p-8 flex flex-col items-center text-center border border-zinc-200"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground bg-red-50/60 mb-5 border border-red-100/20">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className=" font-extraboldtext-sm uppercase tracking-[0.15em] mb-2 select-none">
                Email Address
              </h4>
              <div className="text-sm font-semibold leading-relaxed flex flex-col">
                <a href="mailto:info@pattybros.co.uk" className="hover:text-primary-foreground transition-colors">
                  <p>info@pattybros.co.uk</p>
                </a>
              </div>
            </motion.div>

            {/* Card 3: Phone Number */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-sm shadow-xl shadow-zinc-200/60 p-8 flex flex-col items-center text-center border border-zinc-200"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground bg-red-50/60 mb-5 border border-red-100/20">
                <Phone className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-extraboldtext-sm uppercase tracking-[0.15em] mb-2 select-none">
                Phone Number
              </h4>
              <div className="text-sm font-semibold leading-relaxed flex flex-col">
                <a href="tel:+447495258565" className="hover:text-primary-foreground transition-colors">
                  <p>(+44) 07495258565</p>
                </a>
              </div>
            </motion.div>

            {/* Card 4: Opening Time */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-sm shadow-xl shadow-zinc-200/60 p-8 flex flex-col items-center text-center border border-zinc-200"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground bg-red-50/60 mb-5 border border-red-100/20">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-extraboldtext-sm uppercase tracking-[0.15em] mb-2 select-none">
                Opening Time
              </h4>
              <div className="text-sm font-semibold leading-relaxed space-y-2">
                <div>
                  <p className=" font-bold">Sunday – Thursday</p>
                  <p>12:00 – 20:30</p>
                </div>
                <div>
                  <p className=" font-bold">Friday – Saturday</p>
                  <p>11:30 – 21:30</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ==================== SECTION B: RESTAURANT WRITE-US FORM BLOCK ==================== */}
          <div className="max-w-4xl mx-auto bg-white rounded-sm border border-zinc-200/70 p-8 md:p-14 mb-24 shadow-sm relative z-10">
            
            {/* Form Section Header Minimal Line Badging Indicator */}
            <div className="flex items-center gap-3 mb-2 select-none">
              <span className="w-6 h-[2px] bg-primary-foreground" />
              <span className="text-primary-foreground font-blacktext-sm uppercase tracking-[0.25em]">
                <h4>Contact</h4>
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-zinc-900 mb-10 scale-y-105 origin-left select-none">
              Write Us Something
            </h2>

            {/* Core Contact Inputs Layout Component Matrix */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 1: Name entry */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-600">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Your name here" 
                    className="w-full h-11 px-5 text-sm rounded-full border border-zinc-200 bg-zinc-50/40 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-300"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* Field 2: Email entry */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-600">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="Your email here" 
                    className="w-full h-11 px-5 text-sm rounded-full border border-zinc-200 bg-zinc-50/40 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-300"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 3: Subject entry */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-600">
                    Your Subject <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Your subject here" 
                    className="w-full h-11 px-5 text-sm rounded-full border border-zinc-200 bg-zinc-50/40 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-300"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                {/* Field 4: Telephone string */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-600">
                    Contact Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Your phone here" 
                    className="w-full h-11 px-5 text-sm rounded-full border border-zinc-200 bg-zinc-50/40 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-300"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Field 5: Textarea Container content box */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-600">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4} 
                  required
                  placeholder="Tell us a few words" 
                  className="w-full p-4 text-sm rounded-2xl border border-zinc-200 bg-zinc-50/40 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-300 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              {/* Action Button Dispatch Panel */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center bg-primary-foreground text-white font-extraboldtext-sm uppercase tracking-widest rounded-full px-9 py-4 shadow-md shadow-red-900/10 hover:bg-[#b01b20] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>

            </form>
          </div>

        </div>

        {/* ==================== SECTION C: FOOTER FULL-BLEED INTERACTIVE MAP ==================== */}
        <div className="w-full h-[400px] md:h-[480px] bg-zinc-200 relative border-t border-zinc-200/30">
          <iframe 
            src="https://maps.google.com/maps?q=51.47263781372934,-0.06956161550498596&z=15&output=embed"
            className="w-full h-full border-0 grayscale  hover:grayscale-0 opacity-90 contrast-[1.10]"
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="London Hub Map Integration Grid"
          />
        </div>
        
      </section>
    </SmoothScroll>
  );
}