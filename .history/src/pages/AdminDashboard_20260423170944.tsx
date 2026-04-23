import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plane,
  Hotel as HotelIcon,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
// 🛑 تم استيراد الرابط الموحد هنا
import { API_URL } from "../App";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 🔄 التعديل هنا: استخدام API_URL لطلب الإحصائيات
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          console.error("Failed to fetch admin stats");
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="bg-primary text-primary-foreground shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-widest">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic">
              {stats?.totalUsers || 124}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Flights
            </CardTitle>
            <Plane className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic">12</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Hotels
            </CardTitle>
            <HotelIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic">45</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Total Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black italic text-green-600">
              $12,450
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger
            value="users"
            className="font-bold uppercase tracking-widest text-xs"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="font-bold uppercase tracking-widest text-xs"
          >
            Bookings
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="font-bold uppercase tracking-widest text-xs"
          >
            Content Management
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold italic">Admin User</td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                          Admin
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-muted-foreground">
                        2026-04-21
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card className="p-12 text-center text-muted-foreground bg-muted/20 border-dashed border-2">
            <p className="text-xl font-bold uppercase tracking-widest italic">
              Manage Bookings
            </p>
            <p className="text-sm mt-2">All user bookings will appear here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
