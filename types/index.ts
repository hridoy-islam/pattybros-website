export type Role = "admin" | "customer";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  password?: string; // mock only
  image?: string;
  phone?: string;
}

/** What the decoded access token holds (same shape the real API should sign) */
export interface TokenUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  exp: number;
  iat: number;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  _id: string;
  ref: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  minutes: number;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  status: BookingStatus;
  depositAmount: number;
  depositMethod: "card" | "transfer";
  depositPaid: boolean;
  newClient: boolean;
  notes: string;
  createdAt: string;
}

export interface ServiceItem {
  _id: string;
  slug: string;
  name: string;
  group: "sets" | "infills" | "other";
  minutes: number;
  price: number;
  short: string;
  description: string;
  suitableFor: string;
  image: string;
  popular: boolean;
  active: boolean;
  order: number;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  email: string;
  phone: string;
  instagram: string;
  area: string;
  areaLine: string;
  depositAmount: number;
  cancellationHours: number;
  hours: { label: string; time: string }[];
}

export interface MockDb {
  users: User[];
  services: ServiceItem[];
  bookings: Booking[];
  settings: StudioSettings;
}

export interface Paginated<T> {
  result: T[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
