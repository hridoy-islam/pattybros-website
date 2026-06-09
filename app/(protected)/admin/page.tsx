"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Star,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";

type DashboardStats = {
  todayRevenue: number;
  todayOrders: number;
  totalReservations: number;
};

type RecentOrder = {
  _id: string;
  refId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  menuId?: { title?: string };
  createdAt: string;
};

type TopOrderItem = {
  menuId: string;
  orderCount: number;
  totalQuantity: number;
  totalRevenue: number;
  title: string;
  price: number;
  image: string;
  categoryId: string;
};

const statusColorMap: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  preparing: "bg-blue-50 text-blue-700 border-blue-200/60",
  ready: "bg-violet-50 text-violet-700 border-violet-200/60",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200/60",
};

export default function AdminDashboardPage() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    todayOrders: 0,
    totalReservations: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topOrders, setTopOrders] = useState<TopOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        const [ordersRes, topOrdersRes, reservationsRes] = await Promise.all([
          axiosInstance.get("/orders", {
            params: {
              limit: 500,
              sort: "-createdAt",
            },
          }),
          axiosInstance.get("/orders/top-orders", {
            params: {
              year: currentYear,
              month: currentMonth,
              limit: 5,
            },
          }),
          axiosInstance.get("/reservation", {
            params: { limit: 1 },
          }),
        ]);

        // --- Process Orders ---
        const allOrders: RecentOrder[] = ordersRes.data?.data?.result ?? [];
        
        // Filter today's orders
        const todayOrders = allOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today && orderDate < tomorrow;
        });

        // Calculate today's revenue
        const todayRevenue = todayOrders.reduce(
          (sum, order) =>
            order.status !== "cancelled" ? sum + (order.totalAmount ?? 0) : sum,
          0
        );

        // --- Top Orders ---
        const topOrdersData: TopOrderItem[] = topOrdersRes.data?.data ?? [];

        // --- Reservations ---
        const totalReservations: number =
          reservationsRes.data?.data?.meta?.total ?? 0;

        setStats({
          todayRevenue,
          todayOrders: todayOrders.length,
          totalReservations,
        });

        setRecentOrders(allOrders.slice(0, 5));
        setTopOrders(topOrdersData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

const statCards = [
  {
    title: "Today's Revenue",
    value: loading ? "—" : `£${stats.todayRevenue.toFixed(2)}`,
    icon: DollarSign,
    link: null, // No link for revenue
  },
  {
    title: "Today's Orders",
    value: loading ? "—" : String(stats.todayOrders),
    icon: ShoppingBag,
    link: "/admin/orders",
  },
  {
    title: "Total Reservations",
    value: loading ? "—" : String(stats.totalReservations),
    icon: Users,
    link: "/admin/reservations",
  },
];

  const handleViewAllOrders = () => {
    router.push("/admin/orders");
  };

  const handleViewAllTopOrders = () => {
    router.push("/admin/orders/top-orders");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your restaurant today.
            </p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
  {statCards.map((stat, idx) => {
    const Icon = stat.icon;
    const CardContent = (
      <div
        className={`bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-200 group ${
          stat.link ? "cursor-pointer" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500 tracking-wide">
            {stat.title}
          </span>
          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:border-transparent transition-colors duration-200">
            <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-3xl font-bold text-gray-900 tracking-tight">
            {stat.value}
          </div>
        </div>
      </div>
    );

    // Wrap with link if link exists
    return stat.link ? (
      <div key={idx} onClick={() => router.push(stat.link)} role="button" tabIndex={0}>
        {CardContent}
      </div>
    ) : (
      <div key={idx}>{CardContent}</div>
    );
  })}
</div>
        {/* RECENT ORDERS & TOP ORDERS - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* RECENT ORDERS TABLE */}
          <div className=" md:col-span-2 bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Recent Orders
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Latest customer orders
                </p>
              </div>
              <Button onClick={handleViewAllOrders} variant="link" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-left text-xs font-semibold  uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold  uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="pb-3 text-left text-xs font-semibold  uppercase tracking-wider">
                        Total
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold  uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="group hover:bg-gray-50/40 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                      >
                        <td className="py-3 text-sm font-mono text-gray-500 group-hover:text-gray-900 transition-colors">
                          {order.refId ?? `#${order._id?.slice(-6)}`}
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="py-3 text-sm font-semibold text-gray-900">
                          £{order.totalAmount?.toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              statusColorMap[order.status] ??
                              "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-sm ">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* TOP ORDERS SECTION */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                  Top Orders This Month
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Most popular menu items
                </p>
              </div>
             
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {topOrders.map((item, index) => (
                    <div
                      key={item.menuId}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/admin/menu/${item.menuId}`)}
                    >
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        {index < 3 ? (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-amber-100 text-amber-700"
                                : index === 1
                                ? "bg-gray-100 text-gray-600"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                        ) : (
                          <span className="text-sm font-medium ">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Item Image */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 " />
                        </div>
                      )}

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700">
                          {item.title || "Unknown Item"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-800">
                            {item.totalQuantity} sold
                          </span>
                          
                        </div>
                      </div>

                      
                    </div>
                  ))}

                  {topOrders.length === 0 && (
                    <div className="py-10 text-center text-sm ">
                      No orders this month yet.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}