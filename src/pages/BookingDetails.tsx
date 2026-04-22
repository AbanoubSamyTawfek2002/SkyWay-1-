import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plane, Hotel, Calendar, Info, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

export default function BookingDetails() {
  const { t } = useTranslation();
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = type === 'flight' ? `/api/flights/${id}` : `/api/hotels/${id}`;
        const res = await fetch(endpoint);
        const item = await res.json();
        setData(item);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  if (loading) return <div className="container mx-auto p-20 text-center">Loading details...</div>;
  if (!data) return <div className="container mx-auto p-20 text-center">Item not found.</div>;

  const handleProceed = () => {
    // Store booking info in session/state and navigate to checkout
    const bookingInfo = {
      type,
      id,
      item: data,
      amount: type === 'flight' ? data.price : data.pricePerNight
    };
    sessionStorage.setItem('pending_booking', JSON.stringify(bookingInfo));
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">Step 02: Review Selection</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">Complete your booking</h1>
        <p className="text-muted-foreground italic text-lg leading-none">Almost there! Review your trip details before secure payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border-none shadow-2xl bg-background/50 backdrop-blur rounded-[40px]">
            <div className="bg-primary p-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-primary-foreground">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  {type === 'flight' ? <Plane size={24} /> : <Hotel size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{type === 'flight' ? 'SkyWay Airlines' : 'SkyWay Exclusive Stay'}</p>
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none italic">
                    {type === 'flight' ? t('flight_booking') : t('hotel_booking')}
                  </h2>
                </div>
              </div>
              <Badge className="bg-white text-primary font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full">Confirmed Availability</Badge>
            </div>
            <CardContent className="p-10">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-48 h-48 rounded-[30px] overflow-hidden shadow-xl shrink-0 group">
                    <img 
                      src={type === 'hotel' ? data.images[0] : (data.airlineLogo || 'https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=800&q=80')} 
                      alt={data.name || data.airline} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">
                        {type === 'flight' ? `${data.departureCity} to ${data.arrivalCity}` : data.name}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                        <MapPin size={14} />
                        <span>{type === 'flight' ? data.airline : `${data.city}, ${data.country}`}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                      <div className="p-5 bg-muted/20 rounded-[20px] border border-border/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Departure Date</p>
                        <p className="font-black text-lg tracking-tighter italic uppercase">{new Date(data.departureTime || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className="p-5 bg-muted/20 rounded-[20px] border border-border/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Selection</p>
                        <p className="font-black text-lg tracking-tighter italic uppercase">{type === 'flight' ? data.class : 'Luxury Suite'}</p>
                      </div>
                      <div className="p-5 bg-muted/20 rounded-[20px] border border-border/50 col-span-2 md:col-span-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Status</p>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black text-[10px] tracking-widest uppercase">Refundable</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 p-6 border-2 border-dashed border-primary/20 bg-primary/5 rounded-[30px]">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="font-black italic uppercase tracking-tighter text-primary">SkyWay Platinum Shield Insurance Included</p>
                    <p className="text-xs text-muted-foreground">Your booking is protected against unforeseen cancellations and medical emergencies.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-background/50 rounded-[40px] p-10">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-6">Cancellation Policy</h3>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <p className="text-muted-foreground text-sm italic">
                Free cancellation until <span className="font-bold text-foreground">24 hours</span> before your {type === 'flight' ? 'departure' : 'scheduled check-in'}. 
                Full refund will be credited to your original payment method within <span className="font-bold text-foreground">3-5 business days</span>.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="sticky top-24 border-none shadow-2xl bg-background/80 backdrop-blur rounded-[40px] overflow-hidden">
            <div className="p-10 bg-muted/20 border-b border-border/50">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Fare Summary</h3>
            </div>
            <CardContent className="p-10 space-y-6">
              <div className="flex justify-between items-center text-sm font-bold italic">
                <span className="text-muted-foreground uppercase tracking-widest">Base Amount</span>
                <span>${type === 'flight' ? data.price : data.pricePerNight}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold italic">
                <span className="text-muted-foreground uppercase tracking-widest">Service Fee</span>
                <span>$25.00</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold italic">
                <span className="text-muted-foreground uppercase tracking-widest">Taxes (VAT)</span>
                <span>$20.00</span>
              </div>
              <div className="h-px bg-border/50 my-6" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Total Price</span>
                  <span className="text-5xl font-black tracking-tighter leading-none italic">${(type === 'flight' ? data.price : data.pricePerNight) + 45}</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">USD</span>
              </div>
              <Button className="w-full h-16 rounded-full text-lg font-black uppercase tracking-widest mt-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" onClick={handleProceed}>
                PROCEED TO PAYMENT
              </Button>
              <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest mt-4">Safe & Secure 256-bit SSL encrypted</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
