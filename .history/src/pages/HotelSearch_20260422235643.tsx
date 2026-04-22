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

export default function HotelSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // 🔥 API
  const url =
    "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=-2092174&search_type=CITY&adults=1&children_age=0%2C17&room_qty=1&page_number=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=AED&location=US";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
      "x-rapidapi-host": "booking-com15.p.rapidapi.com",
    },
  };

  useEffect(() => {
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    setActiveCategory(country || city || "All");
  }, [searchParams]);

  // 🔥 fetch
  const fetchHotels = async () => {
    try {
      setLoading(true);

      const response = await fetch(url, options);

      if (!response.ok) {
        const err = await response.text();
        console.log("API ERROR:", err);
        return;
      }

      const result = await response.json();

      console.log("API RESULT:", result);

      const hotelsData = result?.data?.hotels || [];

      const hotelsWithImages = hotelsData.map((hotel: any) => ({
        _id: hotel.hotel_id || Math.random(),
        name: hotel.property?.name || "Hotel",
        city: hotel.property?.wishlistName || "City",
        country: hotel.property?.countryCode || "Country",
        rating: hotel.property?.reviewScore || 4,
        description: hotel.property?.reviewScoreWord || "Luxury stay",
        pricePerNight:
          hotel.property?.priceBreakdown?.grossPrice?.value || 1000,
        imageUrl:
          hotel.property?.photoUrls?.[0] ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      }));

      setHotels(hotelsWithImages);
    } catch (error) {
      console.error("FETCH ERROR:", error);
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
      newParams.set("city", val);
    }

    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-6">Luxe Stays</h1>

      <CategorySlider
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategorySelect}
      />

      {loading ? (
        <div className="grid grid-cols-4 gap-4 mt-10">
          {[...Array(8)].map((_, i) => (
            <SkeletonHotelCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mt-10">
          <AnimatePresence>
            {hotels.map((hotel, i) => (
              <motion.div key={hotel._id || i}>
                <Card>
                  <div className="h-[200px]">
                    <SafeImage src={hotel.imageUrl} />
                  </div>

                  <CardContent>
                    <h3 className="font-bold">{hotel.name}</h3>

                    <p className="text-sm text-gray-500">
                      {hotel.city}, {hotel.country}
                    </p>

                    <div className="flex justify-between mt-2">
                      <span>{formatPrice(hotel.pricePerNight)}</span>

                      <span className="flex items-center gap-1">
                        <Star size={14} /> {hotel.rating}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => navigate(`/hotels/${hotel._id}`)}>
                        Explore
                      </Button>

                      <Button
                        onClick={() => navigate(`/checkout/hotel/${hotel._id}`)}
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && hotels.length === 0 && (
        <div className="text-center mt-20">
          <HotelIcon size={60} />
          <p>No hotels found</p>
        </div>
      )}
    </div>
  );
}
