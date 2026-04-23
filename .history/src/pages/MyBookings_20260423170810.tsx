import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
// 🛑 تم استيراد الرابط الموحد هنا
import { API_URL } from "../App";

export default function MyBookings() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // 🔄 التعديل هنا: استخدام API_URL لطلب الحجوزات الخاصة بالمستخدم
        const res = await fetch(`${API_URL}/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching my bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading)
    return (
      <div className="container mx-auto p-20 text-center flex flex-col items-center gap-4 min-h-[60vh] justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-bold italic uppercase tracking-widest text-xs">
          Loading your trips...
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
        <Plane className="text-primary rotate-45" />
        {t("my_bookings")}
      </h1>

      <div className="grid gap-6">
        {bookings.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground bg-muted/20 border-dashed border-2">
            <Plane size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold mb-4 uppercase tracking-wider italic">
              No trips found yet.
            </p>
            <p className="italic">
              Start exploring and book your first adventure today!
            </p>
          </Card>
        ) : (
          bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                      {booking.type === "flight" ? (
                        <Plane size={32} />
                      ) : (
                        <Hotel size={32} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="uppercase text-[10px] tracking-widest font-black text-primary bg-primary/10"
                        >
                          {booking.type}
                        </Badge>
                        <span className="text-muted-foreground text-xs font-bold">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight italic">
                        {booking.type === "flight"
                          ? `${booking.flightId?.departureCity || "Unknown"} → ${booking.flightId?.arrivalCity || "Unknown"}`
                          : booking.hotelId?.name || "Hotel Booking"}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-primary" />
                          {booking.type === "hotel"
                            ? booking.hotelId?.location
                            : booking.flightId?.airline}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-primary" />
                          {booking.type === "flight" &&
                          booking.flightId?.departureTime
                            ? new Date(
                                booking.flightId.departureTime,
                              ).toLocaleDateString()
                            : "Confirmed"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Total Paid
                      </p>
                      <p className="text-2xl font-black text-primary tracking-tighter italic">
                        ${booking.totalAmount}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1 gap-1 font-bold tracking-widest text-[10px]">
                      <CheckCircle2 size={12} />
                      {booking.status?.toUpperCase() || "COMPLETED"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
