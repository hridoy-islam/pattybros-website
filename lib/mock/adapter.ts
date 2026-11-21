// A mock backend behind axios. It answers the same routes, with the same response shapes, as the real
// API is expected to (the Patty Bros API conventions: { success, message, data } and paginated
// { result, meta }). lib/axios.ts plugs it in while NEXT_PUBLIC_USE_MOCK is not "false".
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { loadDb, saveDb } from "./db";
import type { Booking, MockDb, ServiceItem, TokenUser, User } from "@/types";
import { now as londonNow, todayIso } from "@/lib/moment-setup";

const ACCESS_TTL_SECONDS = 60 * 60 * 8; // 8 hours

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// ── fake JWT (unsigned; the real API signs it) ───────────────────────────────
const b64url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const fromB64url = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));

function signToken(u: User) {
  const now = londonNow().unix();
  const payload: TokenUser = { _id: u._id, name: u.name, email: u.email, role: u.role, iat: now, exp: now + ACCESS_TTL_SECONDS };
  return `${b64url(JSON.stringify({ alg: "none", typ: "JWT" }))}.${b64url(JSON.stringify(payload))}.mock`;
}

function readToken(config: InternalAxiosRequestConfig): TokenUser {
  const header = String(config.headers?.Authorization || config.headers?.authorization || "");
  const token = header.replace(/^Bearer\s+/i, "");
  if (!token) throw new HttpError(401, "You are not authorized");
  try {
    const payload = JSON.parse(fromB64url(token.split(".")[1])) as TokenUser;
    if (londonNow().isAfter(payload.exp * 1000)) throw new HttpError(401, "JWT Expired");
    return payload;
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(401, "You are not authorized");
  }
}

function requireAdmin(config: InternalAxiosRequestConfig) {
  const user = readToken(config);
  if (user.role !== "admin") throw new HttpError(403, "Admins only");
  return user;
}

// ── helpers ──────────────────────────────────────────────────────────────────
const ok = <T>(data: T, message?: string) => ({ success: true, message, data });
const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const body = (config: InternalAxiosRequestConfig) => {
  if (!config.data) return {};
  return typeof config.data === "string" ? JSON.parse(config.data) : config.data;
};

function paginate<T>(items: T[], params: Record<string, unknown>) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 20);
  const total = items.length;
  return {
    result: items.slice((page - 1) * limit, page * limit),
    meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) },
  };
}


// ── routes ───────────────────────────────────────────────────────────────────
type Handler = (ctx: { config: InternalAxiosRequestConfig; db: MockDb; params: Record<string, string>; query: Record<string, unknown> }) => unknown;
const routes: [string, RegExp, Handler, string[]][] = [];
const route = (method: string, path: string, h: Handler) => {
  const keys: string[] = [];
  const re = new RegExp(
    "^" + path.replace(/:(\w+)/g, (_, k) => {
      keys.push(k);
      return "([^/]+)";
    }) + "/?$"
  );
  routes.push([method, re, h, keys]);
};

// auth
route("post", "/auth/login", ({ config, db }) => {
  const { email, password } = body(config);
  const user = db.users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
  if (!user || user.password !== password) throw new HttpError(401, "The email or password is not right");
  return ok({ accessToken: signToken(user) }, "Logged in");
});
route("post", "/auth/refreshToken", () => {
  // the mock has no refresh cookie: an expired session signs in again
  throw new HttpError(401, "Session ended");
});
route("post", "/auth/forget", ({ config, db }) => {
  const { email } = body(config);
  if (!db.users.some((u) => u.email.toLowerCase() === String(email || "").toLowerCase()))
    throw new HttpError(404, "No account uses that email");
  return ok(null, "A reset code was sent (mock: use 123456)");
});
route("post", "/auth/validate", ({ config }) => {
  const { otp } = body(config);
  if (otp !== "123456") throw new HttpError(400, "That code is not right");
  return ok(null, "Code accepted");
});

// users / profile
route("get", "/users/:id", ({ config, db, params }) => {
  readToken(config);
  const u = db.users.find((x) => x._id === params.id);
  if (!u) throw new HttpError(404, "User not found");
  const { password: _p, ...safe } = u;
  return ok(safe);
});
route("patch", "/users/:id", ({ config, db, params }) => {
  const me = readToken(config);
  if (me._id !== params.id && me.role !== "admin") throw new HttpError(403, "Not allowed");
  const u = db.users.find((x) => x._id === params.id);
  if (!u) throw new HttpError(404, "User not found");
  const patch = body(config);
  Object.assign(u, { name: patch.name ?? u.name, phone: patch.phone ?? u.phone, image: patch.image ?? u.image });
  if (patch.password) u.password = patch.password;
  saveDb(db);
  const { password: _p, ...safe } = u;
  return ok(safe, "Profile updated");
});

// dashboard
route("get", "/dashboard", ({ config, db }) => {
  requireAdmin(config);
  const today = todayIso();
  const month = today.slice(0, 7);
  const upcoming = db.bookings
    .filter((b) => b.date >= today && (b.status === "pending" || b.status === "confirmed"))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return ok({
    todayCount: db.bookings.filter((b) => b.date === today && b.status !== "cancelled").length,
    pendingCount: db.bookings.filter((b) => b.status === "pending").length,
    upcomingCount: upcoming.length,
    depositsDue: db.bookings.filter((b) => b.depositAmount > 0 && !b.depositPaid && b.status !== "cancelled").length,
    monthRevenue: db.bookings
      .filter((b) => b.date.startsWith(month) && b.status === "completed")
      .reduce((sum, b) => sum + b.price, 0),
    next: upcoming.slice(0, 6),
  });
});

// bookings
route("get", "/bookings", ({ config, db, query }) => {
  requireAdmin(config);
  const term = String(query.searchTerm || "").toLowerCase();
  const status = String(query.status || "");
  const when = String(query.when || ""); // upcoming | past
  const today = todayIso();
  let list = [...db.bookings];
  if (term)
    list = list.filter((b) =>
      [b.customerName, b.customerEmail, b.customerPhone, b.ref, b.serviceName].some((v) => v.toLowerCase().includes(term))
    );
  if (status) list = list.filter((b) => b.status === status);
  if (when === "upcoming") list = list.filter((b) => b.date >= today);
  if (when === "past") list = list.filter((b) => b.date < today);
  list.sort((a, b) =>
    when === "past" ? (b.date + b.time).localeCompare(a.date + a.time) : (a.date + a.time).localeCompare(b.date + b.time)
  );
  return ok(paginate(list, query));
});
route("get", "/bookings/:id", ({ config, db, params }) => {
  requireAdmin(config);
  const b = db.bookings.find((x) => x._id === params.id);
  if (!b) throw new HttpError(404, "Booking not found");
  return ok(b);
});
route("post", "/bookings", ({ config, db }) => {
  requireAdmin(config);
  const data = body(config) as Partial<Booking>;
  const s = db.services.find((x) => x._id === data.serviceId);
  if (!s) throw new HttpError(400, "Choose a service");
  const b: Booking = {
    _id: id("b"),
    ref: `LBZ-${londonNow().valueOf().toString(36).toUpperCase().slice(-6)}`,
    customerName: data.customerName || "",
    customerEmail: data.customerEmail || "",
    customerPhone: data.customerPhone || "",
    serviceId: s._id,
    serviceName: s.name,
    price: s.price,
    minutes: s.minutes,
    date: data.date || todayIso(),
    time: data.time || "10:00",
    status: data.status || "confirmed",
    depositAmount: s.price > 0 ? Math.min(db.settings.depositAmount, s.price) : 0,
    depositMethod: data.depositMethod || "transfer",
    depositPaid: Boolean(data.depositPaid),
    newClient: Boolean(data.newClient),
    notes: data.notes || "",
    createdAt: londonNow().toISOString(),
  };
  db.bookings.push(b);
  saveDb(db);
  return ok(b, "Booking added");
});
route("patch", "/bookings/:id", ({ config, db, params }) => {
  requireAdmin(config);
  const b = db.bookings.find((x) => x._id === params.id);
  if (!b) throw new HttpError(404, "Booking not found");
  const patch = body(config) as Partial<Booking>;
  const allowed: (keyof Booking)[] = ["status", "depositPaid", "notes", "date", "time", "customerName", "customerEmail", "customerPhone"];
  for (const k of allowed) if (k in patch) (b as unknown as Record<string, unknown>)[k] = patch[k];
  saveDb(db);
  return ok(b, "Booking updated");
});
route("delete", "/bookings/:id", ({ config, db, params }) => {
  requireAdmin(config);
  const before = db.bookings.length;
  db.bookings = db.bookings.filter((x) => x._id !== params.id);
  if (db.bookings.length === before) throw new HttpError(404, "Booking not found");
  saveDb(db);
  return ok(null, "Booking deleted");
});

// services
route("get", "/services", ({ db, query }) => {
  const term = String(query.searchTerm || "").toLowerCase();
  const group = String(query.group || "");
  let list = [...db.services].sort((a, b) => a.order - b.order);
  if (term) list = list.filter((s) => s.name.toLowerCase().includes(term));
  if (group) list = list.filter((s) => s.group === group);
  return ok(paginate(list, { page: query.page, limit: query.limit || 100 }));
});
route("get", "/services/:id", ({ db, params }) => {
  const s = db.services.find((x) => x._id === params.id);
  if (!s) throw new HttpError(404, "Service not found");
  return ok(s);
});
route("post", "/services", ({ config, db }) => {
  requireAdmin(config);
  const data = body(config) as Partial<ServiceItem>;
  if (!data.name) throw new HttpError(400, "Give the service a name");
  const s: ServiceItem = {
    _id: id("s"),
    slug: (data.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: data.name,
    group: data.group || "sets",
    minutes: Number(data.minutes) || 60,
    price: Number(data.price) || 0,
    short: data.short || "",
    description: data.description || "",
    suitableFor: data.suitableFor || "",
    image: data.image || "",
    popular: Boolean(data.popular),
    active: data.active ?? true,
    order: db.services.length,
  };
  db.services.push(s);
  saveDb(db);
  return ok(s, "Service added");
});
route("patch", "/services/:id", ({ config, db, params }) => {
  requireAdmin(config);
  const s = db.services.find((x) => x._id === params.id);
  if (!s) throw new HttpError(404, "Service not found");
  const patch = body(config) as Partial<ServiceItem>;
  Object.assign(s, patch, {
    _id: s._id,
    minutes: patch.minutes !== undefined ? Number(patch.minutes) : s.minutes,
    price: patch.price !== undefined ? Number(patch.price) : s.price,
  });
  saveDb(db);
  return ok(s, "Service updated");
});
route("delete", "/services/:id", ({ config, db, params }) => {
  requireAdmin(config);
  db.services = db.services.filter((x) => x._id !== params.id);
  saveDb(db);
  return ok(null, "Service deleted");
});

// settings (company profile)
route("get", "/settings", ({ db }) => ok(db.settings));
route("patch", "/settings", ({ config, db }) => {
  requireAdmin(config);
  db.settings = { ...db.settings, ...body(config) };
  saveDb(db);
  return ok(db.settings, "Settings saved");
});

// ── the adapter ──────────────────────────────────────────────────────────────
export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((r) => setTimeout(r, 250)); // feel like a network
  const method = (config.method || "get").toLowerCase();
  const url = (config.url || "").replace(/^https?:\/\/[^/]+/, "").replace(config.baseURL || "", "").split("?")[0];
  const query = { ...(config.params || {}) } as Record<string, unknown>;
  const db = loadDb();
  const respond = (status: number, data: unknown): AxiosResponse => ({ data, status, statusText: String(status), headers: {}, config });

  for (const [m, re, handler, keys] of routes) {
    if (m !== method) continue;
    const match = url.match(re);
    if (!match) continue;
    const params = Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(match[i + 1])]));
    try {
      return respond(200, handler({ config, db, params, query }));
    } catch (e) {
      const err = e instanceof HttpError ? e : new HttpError(500, "Something went wrong");
      const res = respond(err.status, { success: false, message: err.message });
      return Promise.reject(Object.assign(new Error(err.message), { config, response: res, isAxiosError: true }));
    }
  }
  const res = respond(404, { success: false, message: `No mock route for ${method.toUpperCase()} ${url}` });
  return Promise.reject(Object.assign(new Error("Not found"), { config, response: res, isAxiosError: true }));
};
