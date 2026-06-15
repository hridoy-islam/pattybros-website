"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Phone,
  Mail,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { z } from "zod";
import axiosInstance from "@/lib/axios";
import moment from "@/lib/moment-setup";
import { Hero } from "@/components/shared/Hero";
import SmoothScroll from "@/components/shared/smooth-scroll";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/components/ui/use-toast";

interface SelectOption {
  value: string;
  label: string;
}

// 1. Define the Zod Schema for validation
const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  partySize: z.string().min(1, "Please select the number of guests."),
  date: z.date({
    required_error: "Please select a date.",
    invalid_type_error: "That's not a valid date!",
  }),
  time: z.string().min(1, "Please select a time."),
});

export default function ReservationPage() {
  const title = "Reservations";
  const subtitle = "Secure your place at the table. Crafted moments await.";
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // Start with null so they are not pre-selected
  const [partySize, setPartySize] = useState<SelectOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<SelectOption | null>(null);

  // State to hold validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guestOptions: SelectOption[] = [
    { value: "1", label: "1 Guest" },
    { value: "2", label: "2 Guests" },
    { value: "3", label: "3 Guests" },
    { value: "4", label: "4 Guests" },
    { value: "5", label: "5 Guests" },
    { value: "6", label: "6 Guests" },
    { value: "7", label: "7 Guests" },
    { value: "8", label: "8+ Large Group" },
  ];

  const generateTimeOptions = (): SelectOption[] => {
    const options: SelectOption[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      const timeString = `${formattedHour}:00`;
      options.push({ value: timeString, label: timeString });
    }
    options.push({ value: "24:00", label: "24:00" });
    return options;
  };

  // Check if selected date is today
  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }, [selectedDate]);

  // Filter time options based on selected date
  const filteredTimeOptions = useMemo(() => {
    const allTimeOptions = generateTimeOptions();
    
    if (!selectedDate || !isToday) {
      // If no date selected or future date, show all times
      return allTimeOptions;
    }

    // If today, only show future times (current hour + 1)
    const currentHour = new Date().getHours();
    
    return allTimeOptions.filter((option) => {
      const hourValue = parseInt(option.value.split(":")[0]);
      // Show times that are at least 1 hour from now
      return hourValue > currentHour;
    });
  }, [selectedDate, isToday]);

  // Reset time when date changes to avoid invalid selections
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const isTimeStillValid = filteredTimeOptions.some(
        (option) => option.value === selectedTime.value
      );
      
      if (!isTimeStillValid) {
        setSelectedTime(null);
      }
    }
  }, [selectedDate, filteredTimeOptions, selectedTime]);

  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "rgb(249 250 251 / 0.8)",
      borderColor: state.isFocused ? "var(--primary)" : "#e4e4e7",
      minHeight: "48px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#18181b",
      boxShadow: "none",
      borderRadius: "10px",
      "&:hover": {
        borderColor: "var(--primary)",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#18181b",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#a1a1aa",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 50,
    }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // 2. Validate form state against Zod schema (handle potential nulls)
    const validationResult = reservationSchema.safeParse({
      name,
      phone,
      email,
      partySize: partySize?.value || "",
      date: selectedDate,
      time: selectedTime?.value || "",
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);

      const finalIsoString = new Date(
        Date.UTC(
          selectedDate!.getFullYear(),
          selectedDate!.getMonth(),
          selectedDate!.getDate()
        )
      ).toISOString()  ;

      await axiosInstance.post("/reservation", {
        customerName: name,
        customerPhone: phone,
        customerEmail: email?.trim().toLowerCase(),
        partySize: Number(partySize?.value),
        reservationDate: finalIsoString,
        preferredTime: selectedTime?.value,
      });

      setIsSubmitted(true);
    } catch (error: any) {
      console.error(error);

      const fallbackMsg =
        error?.response?.data?.message ||
        "Failed to process the reservation request. Please try again.";
      toast({
        title: "Reservation Failed",
        description: fallbackMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SmoothScroll>
      <Hero title={title} subtitle={subtitle} />

      <div className="bg-white text-zinc-900 min-h-screen py-20 px-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-3xl w-full relative z-10">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white border-2 border-primary/40 p-8 md:p-16 relative rounded-sm shadow-xl shadow-zinc-200/50"
              >
                <div className="absolute inset-2 md:inset-4 border border-primary/20 pointer-events-none rounded-sm" />

                <div className="text-center space-y-4 mb-12 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-primary tracking-[1.3rem] font-black text-[14px] uppercase">
                    <h4>
                      <span>✦</span> Online Reservation <span>✦</span>
                    </h4>
                  </div>
                  <h2 className="text-4xl md:text-5xl text-zinc-900 tracking-wide">
                    Book A Table
                  </h2>
                  <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto font-medium leading-relaxed">
                    Booking request{" "}
                    <a
                      href="tel:(+44) 07495258565"
                      className="text-primary-foreground hover:underline transition-all font-bold"
                    >
                      (+44) 07495258565
                    </a>{" "}
                    or fill out the order form below.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10 text-xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-zinc-600 font-bold ml-1"
                      >
                        Full Name
                      </Label>
                      <div className="relative group">
                        <input
                          id="name"
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full bg-zinc-50/80 border ${errors.name ? "border-red-500" : "border-zinc-200"} focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 transition-colors`}
                        />
                        <User className="w-4 h-4 text-zinc-400 absolute right-4 top-4 group-focus-within:text-primary transition-colors" />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-[10px] ml-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-zinc-600 font-bold ml-1"
                      >
                        Phone Number
                      </Label>
                      <div className="relative group">
                        <input
                          id="phone"
                          type="tel"
                          placeholder="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full bg-zinc-50/80 border ${errors.phone ? "border-red-500" : "border-zinc-200"} focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 transition-colors`}
                        />
                        <Phone className="w-4 h-4 text-zinc-400 absolute right-4 top-4 group-focus-within:text-primary transition-colors" />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-[10px] ml-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-zinc-600 font-bold ml-1"
                      >
                        Email Address
                      </Label>
                      <div className="relative group">
                        <input
                          id="email"
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full bg-zinc-50/80 border ${errors.email ? "border-red-500" : "border-zinc-200"} focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-medium placeholder-zinc-400 transition-colors`}
                        />
                        <Mail className="w-4 h-4 text-zinc-400 absolute right-4 top-4 group-focus-within:text-primary transition-colors" />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-[10px] ml-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Number of Guests Field (Formerly Party Size) */}
                    <div className="space-y-2" data-lenis-prevent>
                      <Label
                        htmlFor="partySize"
                        className="text-zinc-600 font-bold ml-1"
                      >
                        Number of Guests
                      </Label>
                      <div className="relative z-30">
                        <Select
                          inputId="partySize"
                          options={guestOptions}
                          value={partySize}
                          onChange={(selected) =>
                            selected && setPartySize(selected as SelectOption)
                          }
                          styles={selectStyles}
                          isSearchable={false}
                          placeholder="Select guest count"
                        />
                      </div>
                      {errors.partySize && (
                        <p className="text-red-500 text-[10px] ml-1">
                          {errors.partySize}
                        </p>
                      )}
                    </div>

                    {/* Date Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="date"
                        className="text-zinc-600 font-bold ml-1"
                      >
                        Reservation Date
                      </Label>
                      <div className="relative group datepicker-wrapper z-20">
                        <DatePicker
                          id="date"
                          selected={selectedDate}
                          onChange={(date: Date | null) =>
                            setSelectedDate(date)
                          }
                          placeholderText="Select Date"
                          dateFormat="dd-MM-yyyy"
                          wrapperClassName="w-full"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          minDate={new Date()}
                          className={`w-full bg-zinc-50/80 border ${errors.date ? "border-red-500" : "border-zinc-200"} focus:border-primary text-zinc-900 h-12 px-4 rounded-sm focus:outline-none font-bold transition-colors`}
                        />
                        <Calendar className="w-4 h-4 text-zinc-400 absolute right-4 top-4 pointer-events-none hidden md:block" />
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-[10px] ml-1">
                          {errors.date}
                        </p>
                      )}
                    </div>

                    {/* Time Field */}
                    <div className="space-y-2" data-lenis-prevent>
                      <Label
                        htmlFor="time"
                        className="text-zinc-600 font-bold ml-1"
                      >
                        Reservation Time
                      </Label>
                      <div className="relative z-20">
                        <Select
                          inputId="time"
                          options={filteredTimeOptions}
                          value={selectedTime}
                          onChange={(selected) =>
                            selected &&
                            setSelectedTime(selected as SelectOption)
                          }
                          styles={selectStyles}
                          isSearchable={false}
                          menuPosition="fixed"
                          closeMenuOnScroll={false}
                          menuShouldBlockScroll={true}
                          placeholder={
                            isToday && selectedDate
                              ? "Select a time"
                              : "Select a time"
                          }
                          noOptionsMessage={() =>
                            isToday
                              ? "No more times available today"
                              : "No times available"
                          }
                        />
                      </div>
                      {errors.time && (
                        <p className="text-red-500 text-[10px] ml-1">
                          {errors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary font-black text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-amber-400 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      "Confirm Reservation"
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-primary/40 p-8 md:p-16 text-center relative rounded-sm shadow-xl space-y-6"
              >
                <div className="absolute inset-2 md:inset-4 border border-primary/20 pointer-events-none rounded-sm" />

                <div className="w-16 h-16 bg-zinc-50 border border-primary-foreground/30 text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8 stroke-[1.5]" />
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="text-3xl text-primary-foreground tracking-wide font-medium">
                    Reservation Successfully Confirmed
                  </h3>
                  <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed font-medium">
                    Thank you,{" "}
                    <span className="text-zinc-900 font-bold">{name}</span>.
                    Your reservation for{" "}
                    <span className="text-zinc-900 font-bold">
                      {partySize?.label}
                    </span>{" "}
                    on{" "}
                    <span className="text-zinc-900 font-bold">
                  {selectedDate
  ? `${selectedDate.getDate()} ${selectedDate.toLocaleString("en-GB", { month: "long" })} ${selectedDate.getFullYear()}`
  : ""}
                    </span>{" "}
                    at{" "}
                    <span className="text-zinc-900 font-bold">
                      {selectedTime?.label}
                    </span>{" "}
                    has been successfully completed. We will keep you updated
                    regarding your booking status via the contact information
                    provided. We look forward to serving you!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SmoothScroll>
  );
}