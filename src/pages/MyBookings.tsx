import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Hotel, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export default function MyBookings() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/my-bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  if (loading) return <div className="p-20 text-center">Loading your trips...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
        <Plane className="text-primary rotate-45" />
        {t('my_bookings')}
      </h1>

      <div className="grid gap-6">
        {bookings.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground bg-muted/20">
            <p className="text-xl font-bold mb-4">No trips found yet.</p>
            <p>Start exploring and book your first adventure today!</p>
          </Card>
        ) : bookings.map((booking) => (
          <motion.div 
            key={booking._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-primary">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                    {booking.type === 'flight' ? <Plane size={32} /> : <Hotel size={32} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="uppercase text-[10px] tracking-widest">{booking.type}</Badge>
                      <span className="text-muted-foreground text-xs">{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-xl">
                      {booking.type === 'flight' 
                        ? `${booking.flightId?.departureCity} → ${booking.flightId?.arrivalCity}` 
                        : booking.hotelId?.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                       <div className="flex items-center gap-1"><MapPin size={14} /> {booking.type === 'hotel' ? booking.hotelId?.location : booking.flightId?.airline}</div>
                       <div className="flex items-center gap-1"><Calendar size={14} /> {booking.type === 'flight' ? new Date(booking.flightId?.departureTime).toLocaleDateString() : 'Confirmed'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-black text-primary">${booking.totalAmount}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1 gap-1">
                    <CheckCircle2 size={12} />
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
