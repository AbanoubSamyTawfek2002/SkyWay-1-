import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Star, Hotel as HotelIcon } from "lucide-react";
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

// 🏨 قاعدة بيانات موسعة ومنظمة حسب الدول
const mockHotelsDb = [
  // --- مصر (EGYPT) - أسعار منطقية بالجنيه المصري للفنادق الفاخرة ---
  {
    _id: "egy-1",
    name: "Marriott Mena House",
    city: "Cairo",
    country: "Egypt",
    rating: 4.9,
    pricePerNight: 5500,
    imageUrl:
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1000",
    description: "إقامة ملكية تحت أقدام الأهرامات العظيمة مع خدمة 5 نجوم.",
  },
  {
    _id: "egy-2",
    name: "Four Seasons At The First Residence",
    city: "Cairo",
    country: "Egypt",
    rating: 4.8,
    pricePerNight: 7200,
    imageUrl:
      "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1000",
    description: "إطلالة بانورامية ساحرة على النيل في قلب العاصمة.",
  },
  {
    _id: "egy-3",
    name: "Rixos Premium Magawish",
    city: "Hurghada",
    country: "Egypt",
    rating: 4.9,
    pricePerNight: 8500,
    imageUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000",
    description: "منتجع فاخر على شاطئ البحر الأحمر مع تجربة شاملة كلياً.",
  },
  {
    _id: "egy-4",
    name: "Steigenberger Nile Palace",
    city: "Luxor",
    country: "Egypt",
    rating: 4.7,
    pricePerNight: 3800,
    imageUrl:
      "https://images.unsplash.com/photo-1541943181603-d8fe267a5dcf?q=80&w=1000",
    description: "استمتع بعبق التاريخ المصري القديم من شرفتك المطلة على النيل.",
  },

  // --- دبي والإمارات (UAE) ---
  {
    _id: "uae-1",
    name: "Burj Al Arab Jumeirah",
    city: "Dubai",
    country: "UAE",
    rating: 5.0,
    pricePerNight: 15000,
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000",
    description: "أيقونة الفخامة العالمية وتجربة الضيافة العربية الأصيلة.",
  },
  {
    _id: "uae-2",
    name: "Address Beach Resort",
    city: "Dubai",
    country: "UAE",
    rating: 4.9,
    pricePerNight: 9000,
    imageUrl:
      "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=1000",
    description: "يضم أعلى مسبح لامتناهي في العالم مع إطلالة على عين دبي.",
  },

  // --- فرنسا (FRANCE) ---
  {
    _id: "fra-1",
    name: "Hôtel Ritz Paris",
    city: "Paris",
    country: "France",
    rating: 4.9,
    pricePerNight: 12000,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40eb0d1b73?q=80&w=1000",
    description: "عنوان الأناقة الباريسية والرفاهية التاريخية.",
  },
  {
    _id: "fra-2",
    name: "Hôtel Martinez",
    city: "Cannes",
    country: "France",
    rating: 4.7,
    pricePerNight: 8800,
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000",
    description: "سحر الشاطئ الفرنسي وتجربة مشاهير مهرجان كان.",
  },

  // --- لندن (UK) ---
  {
    _id: "uk-1",
    name: "The Savoy",
    city: "London",
    country: "UK",
    rating: 4.8,
    pricePerNight: 9500,
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000",
    description: "أشهر فنادق لندن الكلاسيكية بتصميم يجمع بين الأصالة والحداثة.",
  },

  // --- اليابان (JAPAN) ---
  {
    _id: "jp-1",
    name: "Aman Tokyo",
    city: "Tokyo",
    country: "Japan",
    rating: 4.9,
    pricePerNight: 11000,
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000",
    description: "ملاذ هادئ فوق ناطحات سحاب طوكيو بتصميم ياباني بسيط.",
  },
];

export default function HotelSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    setActiveCategory(country || city || "All");
  }, [searchParams]);

  const fetchHotels = async () => {
    setLoading(true);
    // محاكاة تحميل البيانات
    await new Promise((resolve) => setTimeout(resolve, 800));

    const countryFilter = searchParams.get("country");
    const cityFilter = searchParams.get("city");

    let filtered = mockHotelsDb;

    if (countryFilter) {
      filtered = mockHotelsDb.filter(
        (h) =>
          h.country.toLowerCase() === countryFilter.toLowerCase() ||
          (countryFilter === "UAE" && h.country === "UAE"),
      );
    } else if (cityFilter) {
      filtered = mockHotelsDb.filter(
        (h) => h.city.toLowerCase() === cityFilter.toLowerCase(),
      );
    }

    setHotels(filtered);
    setLoading(false);
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
            اختيارات حصرية
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">
            Luxe Stays
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl italic">
            نختار لك أرقى الوجهات العالمية لتجربة إقامة لا تُنسى.
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
                    <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                      <SafeImage src={hotel.imageUrl} />

                      {/* Badge السعر */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-primary/95 text-white font-black px-3 py-1 rounded-lg shadow-lg text-[11px] uppercase tracking-tighter italic">
                          {formatPrice(hotel.pricePerNight)}
                          <span className="text-[8px] ml-1 opacity-70 not-italic font-bold">
                            / ليلة
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
                          استكشف
                        </Button>
                        <Button
                          size="sm"
                          className="h-10 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-md transition-all"
                          onClick={() =>
                            navigate(`/checkout/hotel/${hotel._id}`)
                          }
                        >
                          احجز الآن
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
                  لا توجد فنادق
                </h2>
                <p className="text-muted-foreground italic mb-8">
                  نحن نقوم حالياً بإضافة المزيد من الفنادق الفاخرة في{" "}
                  {activeCategory}.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => handleCategorySelect("All")}
                >
                  عرض كل الوجهات
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
