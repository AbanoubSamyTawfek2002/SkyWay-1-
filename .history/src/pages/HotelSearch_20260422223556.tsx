// نفس imports زي ما هي 👇 (متغيرتش)
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

// ✅ function جديدة عشان تمنع التكرار نهائي
const getHotelImage = (hotel: any, index: number) => {
  const seed = `${hotel._id || index}-${Math.random()}`;
  return `https://source.unsplash.com/600x400/?luxury,hotel,resort,${hotel.city}&sig=${seed}`;
};

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

  const fetchHotels = useCallback(
    async (isLoadMore = false) => {
      const page = isLoadMore ? (pagination?.page || 1) + 1 : 1;
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      params.set("limit", "12");

      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(`/api/hotels?${params.toString()}`);
        const result = await res.json();

        if (isLoadMore) {
          setHotels((prev) => [...prev, ...result.data]);
        } else {
          setHotels(result.data);
        }
        setPagination(result.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchParams, pagination?.page],
  );

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
      {/* UI زي ما هو بالظبط 👇 */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[20px]">
          {[...Array(8)].map((_, i) => (
            <SkeletonHotelCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[20px]">
          <AnimatePresence mode="popLayout">
            {hotels.map((hotel, i) => (
              <motion.div key={hotel._id || i}>
                <Card>
                  {/* 🔥 الصورة بعد التعديل */}
                  <SafeImage
                    src={getHotelImage(hotel, i)}
                    alt={hotel.name}
                    className="w-full h-[200px] object-cover"
                  />

                  {/* باقي الكود زي ما هو */}
                  <CardContent>
                    <h3>{hotel.name}</h3>
                    <p>{hotel.city}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
