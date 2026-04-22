import React, { useState, useEffect, useCallback } from "react";
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

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Pool: Droplets,
  Gym: Dumbbell,
  Spa: Sparkles,
  "Butler Service": User,
  "fine Dining": Utensils,
  Coffee: Coffee,
};

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

export default function HotelSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    setActiveCategory(country || city || "All");
  }, [searchParams]);
  const fetchHotels = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const url =
        "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=-2092174&search_type=CITY&adults=1&children_age=0%2C17&room_qty=1&page_number=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=AED&location=US";

      const res = await fetch(url, {
        method: "GET",
        headers: {
          // حطيت الـ Key بتاعك مؤقتاً للتجربة (ابقى انقله في .env بعدين)
          "x-rapidapi-key":
            "acf0d045edmsh3e2c6767325c2b7p126f7fjsna92c42c0181f",
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      // 🚨 السطر ده هيطبع الداتا في الكونسول عشان نعرف المشكلة فين
      console.log("API Response:", result);

      // بنحاول نجيب الداتا، ولو مش موجودة بنخليها مصفوفة فاضية
      const hotelsData = result?.data?.hotels || [];

      if (hotelsData.length === 0) {
        console.warn(
          "⚠️ مفيش فنادق رجعت من الـ API! تأكد من الرابط أو الباقة.",
        );
      }

      const formattedHotels = hotelsData.map((item: any) => {
        const property = item.property || {};
        return {
          _id: item.hotel_id || Math.random().toString(),
          name: property.name || "Unknown Hotel",
          imageUrl:
            property.photoUrls?.[0] ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          city: property.wishlistName || "City",
          country: property.countryCode || "UAE",
          rating: property.reviewScore ? property.reviewScore / 2 : 0,
          pricePerNight: property.priceBreakdown?.grossPrice?.value || 0,
          description:
            "Exclusive prestige property offering world-class amenities and breathtaking views.",
        };
      });

      if (isLoadMore) {
        setHotels((prev) => [...prev, ...formattedHotels]);
      } else {
        setHotels(formattedHotels);
      }
    } catch (err) {
      console.error("Error Fetching Hotels:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
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
          {[...Array(8)].map((_, i) => (
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
                      <SafeImage
                        src={
                          hotel.imageUrl ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                        }
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

          {pagination && pagination.page < pagination.pages && (
            <div className="mt-20 flex justify-center">
              <Button
                variant="ghost"
                size="lg"
                disabled={loadingMore}
                onClick={() => fetchHotels(true)}
                className="group relative px-12 h-20 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-all hover:bg-primary hover:text-white"
              >
                {loadingMore ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Explore More{" "}
                    <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          )}

          {hotels.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center gap-8 bg-muted/20 rounded-[60px] border-2 border-dashed">
              <HotelIcon size={80} className="text-muted-foreground/20" />
              <div className="max-w-md">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  No Stays Found
                </h2>
                <p className="text-muted-foreground italic mb-8">
                  We couldn't find any premium properties matching your current
                  filters. Try refining your selection.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => handleCategorySelect("")}
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
