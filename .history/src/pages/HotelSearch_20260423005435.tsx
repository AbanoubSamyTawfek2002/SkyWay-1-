import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Star,
  Wifi,
  Droplets,
  Dumbbell,
  Coffee,
  Utensils,
  Sparkles,
  User,
  Hotel as HotelIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../contexts/CurrencyContext";
import { SafeImage } from "../components/SafeImage";
import { SkeletonHotelCard } from "../components/SkeletonLoaders";
import { WishlistButton } from "../components/WishlistButton";
import { CategorySlider } from "../components/CategorySlider";

const categories = [
  "All",
  "Egypt",
  "Dubai",
  "London",
  "Paris",
  "New York",
  "Tokyo",
  "Japan",
  "UAE",
  "Singapore",
  "Italy",
  "France",
];

// 💡 قاعدة البيانات الوهمية (Mock Database) بصور حقيقية ومطابقة للبلاد
const mockHotelsDb = [
  // --- EGYPT ---
  {
    _id: "egy-1",
    name: "Marriott Mena House",
    city: "Cairo",
    country: "Egypt",
    rating: 4.9,
    pricePerNight: 4500,
    imageUrl:
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=1000&auto=format&fit=crop", // صورة قريبة من ستايل الأهرامات/الشرق
    description:
      "Historic luxury hotel offering breathtaking views of the Great Pyramids.",
  },
  {
    _id: "egy-2",
    name: "Four Seasons Nile Plaza",
    city: "Cairo",
    country: "Egypt",
    rating: 4.8,
    pricePerNight: 5200,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40eb0d1b73?q=80&w=1000&auto=format&fit=crop", // صورة فخمة تليق بالنيل
    description:
      "Experience unparalleled luxury and panoramic views of the longest river in the world.",
  },
  {
    _id: "egy-3",
    name: "The Oberoi Beach Resort",
    city: "Sahl Hasheesh",
    country: "Egypt",
    rating: 4.9,
    pricePerNight: 6000,
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop", // ريزورت وبحر
    description:
      "Exclusive suite-only resort with private beach access and world-class diving.",
  },

  // --- DUBAI / UAE ---
  {
    _id: "dxb-1",
    name: "Burj Al Arab Jumeirah",
    city: "Dubai",
    country: "UAE",
    rating: 5.0,
    pricePerNight: 12000,
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop", // دبي ستايل
    description:
      "The world's most luxurious hotel, an architectural marvel on the Arabian Gulf.",
  },
  {
    _id: "dxb-2",
    name: "Atlantis The Royal",
    city: "Dubai",
    country: "UAE",
    rating: 4.9,
    pricePerNight: 8500,
    imageUrl:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000&auto=format&fit=crop", // تصميم حديث
    description:
      "A new iconic landmark offering a revolutionary stay experience.",
  },

  // --- PARIS / FRANCE ---
  {
    _id: "par-1",
    name: "Ritz Paris",
    city: "Paris",
    country: "France",
    rating: 4.9,
    pricePerNight: 9500,
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=1000&auto=format&fit=crop", // ستايل فرنسي كلاسيكي
    description:
      "Legendary elegance and timeless French luxury in the heart of the city.",
  },
  {
    _id: "par-2",
    name: "Shangri-La Paris",
    city: "Paris",
    country: "France",
    rating: 4.8,
    pricePerNight: 8200,
    imageUrl:
      "https://images.unsplash.com/photo-1553653924-39b70295f8da?q=80&w=1000&auto=format&fit=crop", // إطلالة فخمة
    description:
      "Former royal residence offering unmatched views of the Eiffel Tower.",
  },

  // --- LONDON / UK ---
  {
    _id: "lon-1",
    name: "The Savoy",
    city: "London",
    country: "UK",
    rating: 4.8,
    pricePerNight: 6800,
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000&auto=format&fit=crop", // ستايل إنجليزي
    description:
      "An iconic British hotel blending Edwardian and Art Deco styles.",
  },

  // --- TOKYO / JAPAN ---
  {
    _id: "tyo-1",
    name: "Aman Tokyo",
    city: "Tokyo",
    country: "Japan",
    rating: 4.9,
    pricePerNight: 7500,
    imageUrl:
      "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?q=80&w=1000&auto=format&fit=crop", // ستايل ياباني مودرن
    description: "A serene sanctuary rising above the Japanese capital.",
  },

  // --- NEW YORK / USA ---
  {
    _id: "nyc-1",
    name: "The Plaza",
    city: "New York",
    country: "USA",
    rating: 4.7,
    pricePerNight: 5800,
    imageUrl:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000&auto=format&fit=crop", // نيويورك ستايل
    description:
      "The ultimate New York luxury lifestyle destination at Central Park South.",
  },
];

export default function HotelSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    setActiveCategory(country || city || "All");
  }, [searchParams]);

  const fetchHotels = async () => {
    setLoading(true);

    try {
      // محاكاة تأخير السيرفر عشان الـ Skeleton Loader يشتغل وشكل الموقع يبقى احترافي
      await new Promise((resolve) => setTimeout(resolve, 800));

      const countryFilter = searchParams.get("country");
      const cityFilter = searchParams.get("city");

      // فلترة الفنادق بناءً على الدولة أو المدينة
      let filteredHotels = mockHotelsDb;

      if (countryFilter) {
        // لو مختار Japan مثلاً يفلتر على أساسها
        filteredHotels = mockHotelsDb.filter(
          (h) => h.country.toLowerCase() === countryFilter.toLowerCase(),
        );
      } else if (cityFilter) {
        // لو مختار Dubai مثلاً
        filteredHotels = mockHotelsDb.filter(
          (h) => h.city.toLowerCase() === cityFilter.toLowerCase(),
        );
      }

      setHotels(filteredHotels);
    } catch (err) {
      console.error("Error loading hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const handleCategorySelect = (val: string) => {
    setActiveCategory(val);
    const newParams = new URLSearchParams(searchParams);
    if (val === "All") {
      newParams.delete("country");
      newParams.delete("city");
    } else {
      // دي قائمة الدول عشان نفرق بين الفلترة بالدولة أو المدينة
      const countries = [
        "Egypt",
        "UAE",
        "France",
        "UK",
        "USA",
        "Japan",
        "Italy",
        "Singapore",
      ];
      if (countries.includes(val)) {
        newParams.set("country", val);
        newParams.delete("city");
      } else {
        newParams.set("city", val);
        newParams.delete("country");
      }
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">
            Exclusive Selection
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">
            Luxe Stays
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl italic">
            Curating the world's most breathtaking accommodations for your
            prestige journey.
          </p>
        </div>

        {/* Categories Slider */}
        <div className="w-full lg:w-[600px] xl:w-[800px]">
          <CategorySlider
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategorySelect}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[20px]">
          {[...Array(6)].map((_, i) => (
            <SkeletonHotelCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[20px]">
            <AnimatePresence mode="popLayout">
              {hotels.map((hotel, i) => (
                <motion.div
                  key={hotel._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
                  className="group h-full"
                >
                  <Card className="h-full flex flex-col border border-border/50 bg-card overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative h-[200px] w-full overflow-hidden shrink-0">
                      <SafeImage src={hotel.imageUrl} />
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-primary/95 text-white font-black px-3 py-1 rounded-lg shadow-lg text-[11px] uppercase tracking-tighter italic">
                          {formatPrice(hotel.pricePerNight)}
                          <span className="text-[8px] ml-1 opacity-70 not-italic font-bold">
                            / NIGHT
                          </span>
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <WishlistButton
                          itemType="hotel"
                          itemId={hotel._id}
                          className="h-9 w-9 bg-black/20 backdrop-blur-md border-none text-white hover:bg-black/40"
                        />
                      </div>

                      {hotel.rating >= 4.8 && (
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge className="bg-yellow-500/90 text-black font-black px-2 py-0.5 rounded-md text-[9px] uppercase tracking-widest flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> PRESTIGE
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="min-w-0">
                          <h3 className="font-black text-xl tracking-tight uppercase italic leading-none mb-2 truncate group-hover:text-primary transition-colors">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-bold uppercase tracking-widest">
                            <MapPin
                              size={12}
                              className="text-primary shrink-0"
                            />
                            <span className="truncate italic">
                              {hotel.city}, {hotel.country}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg shrink-0">
                          <Star size={14} fill="currentColor" />
                          <span className="font-black text-sm italic">
                            {hotel.rating?.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-xs italic leading-relaxed mb-6 line-clamp-2">
                        {hotel.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all hover:bg-primary/5 italic"
                          onClick={() => navigate(`/hotels/${hotel._id}`)}
                        >
                          EXPLORE
                        </Button>
                        <Button
                          size="sm"
                          className="h-10 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-md transition-all"
                          onClick={() =>
                            navigate(`/checkout/hotel/${hotel._id}`)
                          }
                        >
                          BOOK
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* لو الفلتر مرجعش فنادق في البلد دي */}
          {hotels.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center gap-8 bg-muted/20 rounded-[60px] border-2 border-dashed">
              <HotelIcon size={80} className="text-muted-foreground/20" />
              <div className="max-w-md">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  No Stays Found
                </h2>
                <p className="text-muted-foreground italic mb-8">
                  We are currently expanding our prestige collection in{" "}
                  {activeCategory}. Please check back later or explore other
                  destinations.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => handleCategorySelect("All")}
                >
                  Explore All Destinations
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
