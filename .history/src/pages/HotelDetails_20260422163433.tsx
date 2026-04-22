import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Wifi, Droplets, Dumbbell, Coffee, Utensils, Sparkles, User, Calendar, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { WishlistButton } from '../components/WishlistButton';
import { SafeImage } from '../components/SafeImage';
import { ReviewSection } from '../components/ReviewSection';

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Pool': Droplets,
  'Gym': Dumbbell,
  'Spa': Sparkles,
  'Butler Service': User,
  'Fine Dining': Utensils,
  'Coffee': Coffee,
  'Luxury Spa': Sparkles,
  'Helipad': Plane,
  'Wine Cellar': GlassWater,
  'Personal Butler': User,
  'Private Beach': Droplets,
};

import { Plane, GlassWater } from 'lucide-react';

export default function HotelDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelRes = await fetch(`/api/hotels/${id}`).then(res => res.json());
        setHotel(hotelRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !hotel) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-black italic uppercase tracking-widest text-xs animate-pulse">Designing your exclusive retreat...</p>
    </div>
  );

  const images = hotel.images || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20 h-auto md:h-[600px]">
        <div className="md:col-span-2 relative overflow-hidden rounded-[24px] sm:rounded-[40px] shadow-2xl group min-h-[300px]">
          <SafeImage src={images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6 col-span-1 md:col-span-1">
          <div className="rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-xl group aspect-square md:aspect-auto">
            <SafeImage src={images[1] || images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          </div>
          <div className="rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-xl group aspect-square md:aspect-auto">
            <SafeImage src={images[2] || images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          </div>
        </div>
        <div className="hidden md:block col-span-1 relative rounded-[40px] overflow-hidden shadow-xl group">
          <SafeImage src={images[3] || images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <Button variant="outline" className="bg-white/20 border-white text-white font-black uppercase tracking-widest text-[10px] backdrop-blur-xl rounded-full px-8 h-12">Capture the Full View</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-20">
        <div className="lg:col-span-2 space-y-12 sm:space-y-20">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-primary/10 text-primary font-black px-4 sm:px-6 py-2 rounded-full border-none uppercase tracking-widest text-[9px] sm:text-[10px] italic">Prestige Platinum</Badge>
                <div className="flex items-center gap-2 text-primary font-black text-xl sm:text-2xl italic leading-none">
                  <Star size={20} fill="currentColor" />
                  <span>{hotel.rating?.toFixed(1)}</span>
                  <span className="text-muted-foreground text-[10px] sm:text-xs font-black uppercase tracking-widest not-italic opacity-40 ml-2 sm:ml-4">{hotel.reviewCount} GLOBAL REVIEWS</span>
                </div>
              </div>
              <WishlistButton itemType="hotel" itemId={id!} className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border-2 shadow-xl hover:shadow-primary/20 transition-all self-end sm:self-auto" />
            </div>
            
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.9] mb-4 sm:mb-8">{hotel.name}</h1>
              <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-lg sm:text-xl md:text-2xl font-black italic">
                <MapPin size={24} className="text-primary shrink-0" />
                <span className="opacity-80">{hotel.location ? `${hotel.location}, ` : ''}{hotel.city}, {hotel.country}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-lg sm:prose-2xl max-w-none dark:prose-invert italic text-muted-foreground/80 leading-relaxed font-medium">
             {hotel.description || "A sanctuary of unparalleled luxury where every detail is meticulously crafted to produce an atmosphere of absolute distinction and comfort."}
          </div>

          <div className="pt-12 sm:pt-20 border-t border-border/50">
            <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter mb-8 sm:mb-12">Curated Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {hotel.amenities?.map((amenity: string) => {
                const Icon = amenityIcons[amenity] || Sparkles;
                return (
                  <motion.div 
                    key={amenity} 
                    whileHover={{ y: -5, backgroundColor: 'var(--primary-10)' }}
                    className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-10 bg-muted/20 rounded-[24px] sm:rounded-[40px] border border-border/50 transition-all group"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[24px] bg-background flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform">
                      <Icon size={24} className="sm:size-[32px]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center line-clamp-1">{amenity}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Reviews Section */}
          <section className="pt-12 sm:pt-20 border-t border-border/50">
            <div className="mb-8 sm:mb-12">
               <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-4 italic">Social Proof</span>
               <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">Guest Testimonials</h3>
            </div>
            <ReviewSection 
              targetType="hotel" 
              targetId={id!} 
              onReviewAdded={(avg, count) => setHotel((h: any) => ({ ...h, rating: avg, reviewCount: count }))} 
            />
          </section>
        </div>

        <div className="space-y-10">
          <Card className="rounded-[40px] sm:rounded-[60px] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.5)] border-none sticky top-32 overflow-hidden bg-card">
            <CardContent className="p-8 sm:p-12 space-y-8 sm:space-y-12">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 sm:gap-0">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic mb-2 sm:mb-3 block opacity-60">Premier Rate</span>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl sm:text-6xl font-black italic tracking-tighter leading-none">{formatPrice(hotel.pricePerNight)}</p>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-widest opacity-40 italic">/ night</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <Badge variant="outline" className="rounded-full border-primary/40 text-primary font-black px-4 py-1 text-[8px] sm:text-[9px] uppercase tracking-widest italic mb-2">Elite Priority</Badge>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground italic opacity-50">Inclusive of VAT</p>
                </div>
              </div>

              <div className="space-y-6">
                <Button 
                  className="w-full h-16 sm:h-20 rounded-[20px] sm:rounded-[30px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-base sm:text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] active:scale-95"
                  onClick={() => navigate(`/checkout/hotel/${hotel._id}`)}
                >
                  Secure Reservation
                </Button>
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                  <ShieldCheck size={14} className="text-primary" /> Transparent Pricing
                </div>
              </div>

              <div className="pt-6 sm:pt-10 border-t border-border/50 grid grid-cols-2 gap-4 sm:gap-10">
                <div className="space-y-2 text-center py-4 sm:py-6 bg-muted/20 rounded-[20px] sm:rounded-[30px] border border-border/30">
                  <Calendar size={18} className="mx-auto text-primary mb-1 sm:mb-2" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Arrival</span>
                  <span className="text-[10px] sm:text-xs font-black italic uppercase">15:00 HRS</span>
                </div>
                <div className="space-y-2 text-center py-4 sm:py-6 bg-muted/20 rounded-[20px] sm:rounded-[30px] border border-border/30">
                  <Calendar size={18} className="mx-auto text-primary mb-1 sm:mb-2" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Departure</span>
                  <span className="text-[10px] sm:text-xs font-black italic uppercase">11:00 HRS</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-primary/5 rounded-[24px] sm:rounded-[40px] border-2 border-dashed border-primary/20 space-y-3 sm:space-y-4">
                <h4 className="font-black uppercase italic tracking-tighter text-primary text-base sm:text-lg">VIP Concierge</h4>
                <p className="text-[9px] sm:text-[10px] leading-relaxed italic text-muted-foreground font-medium">As a SkyWay traveler, gain exclusive access to our 24/7 personal concierge for bespoke arrangements.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
