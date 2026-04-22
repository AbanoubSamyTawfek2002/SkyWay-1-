import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Star, Hotel as HotelIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../contexts/CurrencyContext";
import { SafeImage } from "../components/SafeImage";
import { SkeletonHotelCard } from "../components/SkeletonLoaders";
import { WishlistButton } from "../components/WishlistButton";
import { CategorySlider } from "../components/CategorySlider";

// 🖼️ قائمة بصور فنادق عالمية فخمة لضمان التنوع وعدم التكرار
const hotelImageIds = [
  "1566073771259-6a8506099945", // Resort 1
  "1582719478250-c89cae4dc85b", // Suite 1
  "1542314831-c6a4d14d8c85", // Classic 1
  "1571896349842-33c89424de2d", // Beach 1
  "1566665797739-1674de7a421a", // Interior 1
  "1520250497591-112f2f40a3f4", // Pool 1
  "1596394516093-501ba68a0ba6", // City 1
  "1611892440504-42a792e24d32", // Boutique 1
  "1551882547-ff40eb0d1b73", // Interior 2
  "1618773928121-c32242e63f39", // Modern 1
];

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

// 🏨 قاعدة بيانات محلية (Mock Data) بأسعار منطقية (بالدولار ليتم تحويلها لـ EGP صح)
const mockHotelsDb = [
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d1",
    name: "Marriott Mena House",
    city: "Cairo",
    country: "Egypt",
    rating: 4.9,
    pricePerNight: 120,
    description: "إقامة ملكية تاريخية بجوار أهرامات الجيزة مباشرة.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d2",
    name: "Four Seasons Nile Plaza",
    city: "Cairo",
    country: "Egypt",
    rating: 4.8,
    pricePerNight: 160,
    description: "فخامة بلا حدود على ضفاف النيل في قلب القاهرة.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d3",
    name: "Burj Al Arab Jumeirah",
    city: "Dubai",
    country: "UAE",
    rating: 5.0,
    pricePerNight: 450,
    description: "أيقونة الضيافة العالمية في قلب مدينة دبي.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d4",
    name: "Rixos Premium Magawish",
    city: "Hurghada",
    country: "Egypt",
    rating: 4.9,
    pricePerNight: 180,
    description: "منتجع عائلي فاخر على سواحل البحر الأحمر الساحرة.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d5",
    name: "The Savoy London",
    city: "London",
    country: "UK",
    rating: 4.8,
    pricePerNight: 350,
    description: "التاريخ الإنجليزي العريق يمتزج بالرفاهية الحديثة.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d6",
    name: "Ritz Paris",
    city: "Paris",
    country: "France",
    rating: 4.9,
    pricePerNight: 420,
    description: "عنوان الأناقة في باريس مع تجربة إقامة استثنائية.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d7",
    name: "Aman Tokyo",
    city: "Tokyo",
    country: "Japan",
    rating: 4.9,
    pricePerNight: 380,
    description: "ملاذ هادئ بتصميم ياباني أصيل فوق سماء طوكيو.",
  },
  {
    _id: "65f1a2b3c4d5e6f7a1b2c3d8",
    name: "The Plaza",
    city: "New York",
    country: "USA",
    rating: 4.7,
    pricePerNight: 320,
    description: "الفخامة الكلاسيكية في قلب مانهاتن بجوار سنترال بارك.",
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

  const fetchHotels = useCallback(
    async (isLoadMore = false) => {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      try {
        // محاكاة طلب API
        await new Promise((resolve) => setTimeout(resolve, 800));

        const countryParam = searchParams.get("country");
        const cityParam = searchParams.get("city");

        let data = mockHotelsDb;

        if (countryParam) {
          data = mockHotelsDb.filter(
            (h) => h.country.toLowerCase() === countryParam.toLowerCase(),
          );
        } else if (cityParam) {
          data = mockHotelsDb.filter(
            (h) => h.city.toLowerCase() === cityParam.toLowerCase(),
          );
        }

        setHotels(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchParams],
  );

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleCategorySelect = (val: string) => {
    setActiveCategory(val);
    const newParams = new URLSearchParams(searchParams);
    if (val === "All") {
      newParams.delete("country");
      newParams.delete("city");
    } else {
      const countries = [
        "Egypt",
        "UAE",
        "France",
        "UK",
        "USA",
        "Japan",
        "Italy",
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
                  key={hotel._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
                  className="group h-full"
                >
                  <Card className="h-full flex flex-col border border-border/50 bg-card overflow-hidden rounded-[20px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative h-[200px] w-full overflow-hidden shrink-0">
                      <SafeImage
                        src={`https://images.unsplash.com/photo-${hotelImageIds[i % hotelImageIds.length]}?q=80&w=1000&auto=format&fit=crop`}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
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

          {hotels.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center gap-8 bg-muted/20 rounded-[60px] border-2 border-dashed">
              <HotelIcon size={80} className="text-muted-foreground/20" />
              <div className="max-w-md">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  No Stays Found
                </h2>
                <p className="text-muted-foreground italic mb-8">
                  We couldn't find any premium properties in {activeCategory}.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => handleCategorySelect("All")}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
