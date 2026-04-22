import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Plane, Hotel, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DestinationDetails() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/destinations/${city}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  if (loading) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-bold italic uppercase tracking-widest text-xs">Loading Destination...</p>
    </div>
  );

  if (!data) return <div className="container mx-auto p-20 text-center">Destination not found.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={data.image} alt={data.city} className="w-full h-full object-cover brightness-50 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4 inline-block italic">Destination Spotlight</span>
            <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter italic leading-none mb-6 italic">{data.city}</h1>
            <p className="text-white/80 text-xl max-w-3xl mx-auto italic drop-shadow-lg">{data.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Related Data */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Hotels */}
            <div className="space-y-10">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Luxury Stays in {data.city}</h2>
                  <p className="text-muted-foreground italic">Experience the best hospitality {data.city} has to offer.</p>
                </div>
                <Button variant="link" className="font-bold uppercase tracking-widest text-xs group">
                  See All <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                </Button>
              </div>

              <div className="grid gap-6">
                {data.hotels.length > 0 ? data.hotels.slice(0, 3).map((hotel: any) => (
                  <Card key={hotel._id} className="overflow-hidden border-none shadow-xl bg-muted/20 hover:bg-muted/30 transition-colors rounded-3xl group cursor-pointer" onClick={() => navigate(`/booking/hotel/${hotel._id}`)}>
                    <CardContent className="p-0 flex h-40">
                      <div className="w-40 shrink-0 overflow-hidden">
                        <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-black text-xl italic uppercase tracking-tighter leading-none">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-primary font-black">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-4">{hotel.location}</p>
                        <p className="text-primary font-black italic">From ${hotel.pricePerNight} <span className="text-muted-foreground text-[10px] uppercase">/ night</span></p>
                      </div>
                    </CardContent>
                  </Card>
                )) : <p className="italic text-muted-foreground">No hotels available right now. Check back soon!</p>}
              </div>
            </div>

            {/* Flights */}
            <div className="space-y-10">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Flights to {data.city}</h2>
                  <p className="text-muted-foreground italic">Premium connections to the world's most beautiful city.</p>
                </div>
              </div>

              <div className="grid gap-6">
                {data.flights.length > 0 ? data.flights.slice(0, 3).map((flight: any) => (
                  <Card key={flight._id} className="overflow-hidden border-none shadow-xl bg-muted/20 hover:bg-muted/30 transition-colors rounded-3xl group cursor-pointer" onClick={() => navigate(`/booking/flight/${flight._id}`)}>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={flight.airlineLogo} alt={flight.airline} className="h-8 w-auto filter dark:invert" />
                          <div>
                            <p className="font-black text-lg uppercase italic leading-none">{flight.airline}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{flight.flightNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black italic tracking-tighter leading-none">${flight.price}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Starting from</p>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-center">
                          <p className="font-black text-xl leading-none">{flight.departureAirport}</p>
                          <p className="text-[10px] font-bold text-muted-foreground">{flight.departureCity}</p>
                        </div>
                        <div className="flex-1 px-8">
                          <div className="h-px bg-border relative">
                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={14} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-black text-xl leading-none">{flight.arrivalAirport}</p>
                          <p className="text-[10px] font-bold text-muted-foreground font-black">{flight.arrivalCity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : <p className="italic text-muted-foreground">No flights found at the moment.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
