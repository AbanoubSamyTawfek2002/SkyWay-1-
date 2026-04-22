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

// ✅ get image from Unsplash API
const getHotelImage = async (hotel: any) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${hotel.name}+luxury+hotel+${hotel.city}&per_page=5&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`,
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const random =
        data.results[Math.floor(Math.random() * data.results.length)];
      return random.urls.regular;
    }

    return null;
  } catch (err) {
    console.error("Image error:", err);
    return null;
  }
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

        // ✅ add dynamic images
        const hotelsWithImages = await Promise.all(
          result.data.map(async (hotel: any) => {
            const image = await getHotelImage(hotel);
            return {
              ...hotel,
              dynamicImage: image,
            };
          }),
        );

        if (isLoadMore) {
          setHotels((prev) => [...prev, ...hotelsWithImages]);
        } else {
          setHotels(hotelsWithImages);
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black mb-6">Luxe Stays</h1>
        </div>

        <CategorySlider
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategorySelect}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[20px]">
          {[...Array(8)].map((_, i) => (
            <SkeletonHotelCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[20px]">
          {hotels.map((hotel, i) => (
            <Card key={hotel._id || i}>
              <SafeImage
                src={
                  hotel.images?.[0] ||
                  hotel.dynamicImage ||
                  "https://via.placeholder.com/400"
                }
                alt={hotel.name}
                className="w-full h-[200px] object-cover"
              />

              <CardContent>
                <h3>{hotel.name}</h3>
                <p>
                  {hotel.city}, {hotel.country}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
