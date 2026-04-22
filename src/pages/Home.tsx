import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plane, Hotel, Calendar, Users, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSearch = (type: 'flights' | 'hotels') => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    navigate(`/${type}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-110">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109ce05?auto=format&fit=crop&w=1920&q=80" 
            alt="Travel Hero" 
            className="w-full h-full object-cover brightness-75 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 py-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          {/* Background Decorative Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[110%] w-full pointer-events-none select-none overflow-hidden">
            <h1 className="text-[120px] md:text-[200px] lg:text-[250px] font-black opacity-10 text-white uppercase tracking-tighter italic leading-none whitespace-nowrap">
              SKYWAY
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center relative z-20"
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-8 leading-tight shadow-black drop-shadow-2xl italic break-words w-full max-w-4xl">
              Fly Higher with SkyWay
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-xl lg:text-2xl font-bold mb-8 sm:mb-16 max-w-2xl mx-auto drop-shadow-md italic">
              Redefining global exploration with premium selection and intelligent travel concierge.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-6xl mx-auto"
          >
            <Card className="border-none backdrop-blur-3xl bg-background/60 shadow-[0_48px_80px_-12px_rgba(0,0,0,0.4)] dark:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.8)] rounded-[20px] sm:rounded-[40px] overflow-visible">
              <CardContent className="p-4 sm:p-6 md:p-10">
                <Tabs defaultValue="flights" className="w-full">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <TabsList className="bg-muted/50 p-1 h-12 sm:h-14 rounded-full overflow-x-auto no-scrollbar max-w-full">
                      <TabsTrigger value="flights" className="rounded-full px-4 sm:px-8 h-full gap-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg whitespace-nowrap">
                        <Plane size={16} className="sm:size-[18px]" /> <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-nowrap">{t('flights')}</span>
                      </TabsTrigger>
                      <TabsTrigger value="hotels" className="rounded-full px-4 sm:px-8 h-full gap-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg whitespace-nowrap">
                        <Hotel size={16} className="sm:size-[18px]" /> <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-nowrap">{t('hotels')}</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="flights" className="mt-0 focus-visible:outline-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-1 sm:p-2">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <MapPin size={18} />
                        </div>
                        <Input 
                          placeholder={t('from')} 
                          className="pl-12 h-16 bg-muted/30 border-none rounded-2xl text-lg font-bold placeholder:font-normal" 
                          value={from} 
                          onChange={(e) => setFrom(e.target.value)} 
                        />
                        <span className="absolute right-4 top-2 text-[10px] font-bold uppercase text-muted-foreground pointer-events-none">Departure</span>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <MapPin size={18} />
                        </div>
                        <Input 
                          placeholder={t('to')} 
                          className="pl-12 h-16 bg-muted/30 border-none rounded-2xl text-lg font-bold placeholder:font-normal" 
                          value={to} 
                          onChange={(e) => setTo(e.target.value)} 
                        />
                        <span className="absolute right-4 top-2 text-[10px] font-bold uppercase text-muted-foreground pointer-events-none">Destination</span>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Calendar size={18} />
                        </div>
                        <Input type="date" className="pl-12 h-16 bg-muted/30 border-none rounded-2xl text-lg font-bold" />
                        <span className="absolute right-4 top-2 text-[10px] font-bold uppercase text-muted-foreground pointer-events-none">Date</span>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Users size={18} />
                        </div>
                        <Input placeholder={t('passengers')} type="number" className="pl-12 h-16 bg-muted/30 border-none rounded-2xl text-lg font-bold" defaultValue={1} />
                        <span className="absolute right-4 top-2 text-[10px] font-bold uppercase text-muted-foreground pointer-events-none">Travelers</span>
                      </div>
                    </div>
                    <div className="flex justify-end p-2">
                      <Button className="w-full md:w-auto px-12 h-16 rounded-2xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" onClick={() => handleSearch('flights')}>
                        <Search className="mr-2" size={20} /> {t('search')}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="hotels" className="mt-0 focus-visible:outline-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-1 sm:p-2">
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <MapPin size={18} />
                        </div>
                        <Input placeholder="Search worldwide destinations..." className="pl-12 h-14 sm:h-16 bg-muted/30 border-none rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold placeholder:font-normal" />
                        <span className="absolute right-4 top-2 text-[10px] font-bold uppercase text-muted-foreground pointer-events-none">Location</span>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                          <Calendar size={18} />
                        </div>
                        <Input type="date" className="pl-12 h-14 sm:h-16 bg-muted/30 border-none rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold" />
                        <span className="absolute right-4 top-2 text-[10px] font-bold uppercase text-muted-foreground pointer-events-none">Check-in</span>
                      </div>
                    </div>
                    <div className="flex justify-end p-2">
                      <Button className="w-full sm:w-auto px-12 h-14 sm:h-16 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" onClick={() => handleSearch('hotels')}>
                        <Search className="mr-2" size={20} /> {t('search')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20 sm:py-32 bg-background overflow-hidden px-4 sm:px-6 md:px-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-8">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">World Collection</span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none italic">Popular Destinations</h2>
              <p className="text-muted-foreground text-base sm:text-lg italic">Explore our hand-picked selection of the world's most breathtaking places.</p>
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-14 sm:h-auto font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105"
              onClick={() => navigate('/destinations')}
            >
              Explore All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { city: "Paris", country: "France", price: 450, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
              { city: "Tokyo", country: "Japan", price: 820, img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" },
              { city: "Dubai", country: "UAE", price: 610, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" },
              { city: "New York", country: "USA", price: 550, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" }
            ].map((dest, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/destinations/${dest.city}`)}
                className="group relative overflow-hidden rounded-[40px] shadow-2xl aspect-[4/6] cursor-pointer"
              >
                <img 
                  src={dest.img} 
                  alt={dest.city} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{dest.country}</span>
                  <h3 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">{dest.city}</h3>
                  <div className="flex items-center justify-between overflow-hidden">
                    <p className="text-white/60 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all delay-200 duration-500 translate-y-4 group-hover:translate-y-0">From <span className="text-white text-lg">${dest.price}</span></p>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all delay-300 scale-0 group-hover:scale-100">
                      <Search size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
