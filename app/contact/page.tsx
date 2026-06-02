"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { contactContent } from "@/utils/content";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const { title, subtitle } = contactContent.hero;
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
    captcha: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting contact request:", formData);
  };

  return (
    <SmoothScroll>
      {/* 1. Header Hero Core Overlay Banner Component */}
      <Hero title={title} subtitle={subtitle} />

      {/* WRAPPED IN SECTION AS REQUESTED */}
      <section className="bg-white pb-0 mt-0 relative z-30">
        <div className="container mx-auto ">
          
          {/* ==================== SECTION A: INFO CARDS ==================== */}
          {/* FIX: Removed -translate-y-20 and replaced with mt-12 mb-12 to prevent merging */}
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
              <h4 className="text-zinc-900 font-extrabold text-xs uppercase tracking-[0.15em] mb-2 select-none">
                Our Address
              </h4>
              <h4 className="text-zinc-500 text-xs font-semibold leading-relaxed max-w-[200px]">
                66 Guild Street 512B, Great North Town.
              </h4>
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
              <h4 className="text-zinc-900 font-extrabold text-xs uppercase tracking-[0.15em] mb-2 select-none">
                Email Address
              </h4>
              <div className="text-zinc-500 text-xs font-semibold leading-relaxed flex flex-col">
                <a href="mailto:info@example.com" className="hover:text-primary-foreground transition-colors"><h4>info@example.com</h4></a>
                <a href="mailto:info@domain.com" className="hover:text-primary-foreground transition-colors"><h4>info@domain.com</h4></a>
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
              <h4 className="text-zinc-900 font-extrabold text-xs uppercase tracking-[0.15em] mb-2 select-none">
                Phone Number
              </h4>
              <div className="text-zinc-500 text-xs font-semibold leading-relaxed flex flex-col">
                <a href="tel:+44123456789" className="hover:text-primary-foreground transition-colors"><h4>(+44) 123 456 789</h4></a>
                <a href="tel:+44152567987" className="hover:text-primary-foreground transition-colors"><h4>(+44) 152-567-987</h4></a>
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
              <h4 className="text-zinc-900 font-extrabold text-xs uppercase tracking-[0.15em] mb-2 select-none">
                Opening Time
              </h4>
              <div className="text-zinc-500 text-xs font-semibold leading-relaxed">
                <h4>Mon - Fri - 09:00AM - 09:00PM</h4>
                <h4 className="text-zinc-700 font-normal mt-0.5">Sat-Sun - closed</h4>
              </div>
            </motion.div>

          </div>

          {/* ==================== SECTION B: RESTAURANT WRITE-US FORM BLOCK ==================== */}
          <div className="max-w-4xl mx-auto bg-white rounded-sm border border-zinc-200/70 p-8 md:p-14 mb-24 shadow-sm relative z-10">
            
            {/* Form Section Header Minimal Line Badging Indicator */}
            <div className="flex items-center gap-3 mb-2 select-none">
              <span className="w-6 h-[2px] bg-primary-foreground" />
              <span className="text-primary-foreground font-black text-xs uppercase tracking-[0.25em]"><h4>Contact</h4></span>
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

              {/* Field 6: Spam Security Unit Captcha Block */}
              <div className="space-y-3 pt-1">
                <input 
                  type="text" 
                  required
                  placeholder="Type the below word" 
                  className="w-full h-11 px-5 text-sm rounded-full border border-zinc-200 bg-zinc-50/40 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-300"
                  value={formData.captcha}
                  onChange={(e) => setFormData({...formData, captcha: e.target.value})}
                />
                <div className="pl-2 select-none pointer-events-none">
                  <span className="font-serif italic text-sm tracking-[0.25em] text-zinc-500 bg-zinc-100 px-4 py-1.5 rounded border border-zinc-200/50 opacity-80">
                    catch
                  </span>
                </div>
              </div>

              {/* Action Button Dispatch Panel */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="inline-flex items-center justify-center bg-primary-foreground text-white font-extrabold text-xs uppercase tracking-widest rounded-full px-9 py-4 shadow-md shadow-red-900/10 hover:bg-[#b01b20] transition-colors cursor-pointer"
                >
                  Send Message
                </Button>
              </div>

            </form>
          </div>

        </div>

        {/* ==================== SECTION C: FOOTER FULL-BLEED INTERACTIVE MAP ==================== */}
        <div className="w-full h-[400px] md:h-[480px] bg-zinc-200 relative border-t border-zinc-200/30">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.907844111357!2d-0.12832322336683525!3d51.51490227181519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ccab37603b%3A0x2287be81afaf020e!2sThe%20British%20Museum!5e0!3m2!1sen!2s!4v1717350000000!5m2!1sen!2s" 
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