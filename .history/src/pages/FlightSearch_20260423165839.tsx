import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plane,
  Clock,
  ArrowRight,
  Star,
  ChevronDown,
  Calendar,
  Users,
  MapPin,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../contexts/CurrencyContext";
import { SafeImage } from "../components/SafeImage";
import { SkeletonFlightCard } from "../components/SkeletonLoaders";
import { WishlistButton } from "../components/WishlistButton";
import { ReviewSection } from "../components/ReviewSection";
import { API_URL } from "../App";
import { CategorySlider } from "../components/CategorySlider";

const routeCategories = [
  { name: "All Routes", from: "", to: "" },
  { name: "Cairo → Dubai", from: "Cairo", to: "Dubai" },
  { name: "Dubai → London", from: "Dubai", to: "London" },
  { name: "Paris → New York", from: "Paris", to: "New York" },
  { name: "Tokyo → Dubai", from: "Tokyo", to: "Dubai" },
  { name: "London → Cairo", from: "London", to: "Cairo" },
  { name: "New York → Tokyo", from: "New York", to: "Tokyo" },
  { name: "Paris → Tokyo", from: "Paris", to: "Tokyo" },
];

export default function FlightSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState(
    searchParams.get("from") && searchParams.get("to")
      ? `${searchParams.get("from")} → ${searchParams.get("to")}`
      : "All Routes",
  );

  const fetchFlights = useCallback(
    async (isLoadMore = false) => {
      const page = isLoadMore ? (pagination?.page || 1) + 1 : 1;
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      params.set("limit", "10");

      // Add explicit from/to filters if they don't exist but activeRoute does
      if (activeRoute && activeRoute !== "All Routes") {
        const parts = activeRoute.split(" → ");
        if (parts.length === 2) {
          params.set("from", parts[0]);
          params.set("to", parts[1]);
        }
      }

      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(`/api/flights?${params.toString()}`);
        const result = await res.json();

        if (isLoadMore) {
          setFlights((prev) => [...prev, ...result.data]);
        } else {
          setFlights(result.data);
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
    fetchFlights();
  }, [searchParams]);

  const handleRouteSelect = (routeName: string) => {
    setActiveRoute(routeName);
    const newParams = new URLSearchParams(searchParams);
    const route = routeCategories.find((r) => r.name === routeName);

    if (!route || route.from === "") {
      newParams.delete("from");
      newParams.delete("to");
    } else {
      newParams.set("from", route.from);
      newParams.set("to", route.to);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] mb-4 italic">
            SkyWay Elite Board
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-6">
            Global Wings
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl italic">
            Book premium routes across the globe with our real-time intelligent
            flight board.
          </p>
        </div>

        {/* Route Sliders */}
        <div className="w-full xl:w-[800px]">
          <CategorySlider
            categories={routeCategories.map((r) => r.name)}
            activeCategory={activeRoute}
            onCategoryChange={handleRouteSelect}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <SkeletonFlightCard key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {flights.map((flight, i) => (
              <motion.div
                key={flight._id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (i % 5) * 0.05 }}
              >
                <Card className="overflow-hidden border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] bg-card rounded-[40px] transition-all hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row items-stretch">
                      {/* Airline Section */}
                      <div className="lg:w-1/4 p-10 bg-muted/20 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border/50">
                        <SafeImage
                          src={flight.airlineLogo}
                          alt={flight.airline}
                          className="h-14 sm:h-20 w-auto object-contain filter dark:invert mb-6 transition-transform group-hover:scale-110"
                        />
                        <div className="text-center">
                          <h3 className="font-black text-2xl tracking-tighter uppercase italic leading-none mb-2">
                            {flight.airline}
                          </h3>
                          <Badge
                            variant="outline"
                            className="rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-widest border-primary/20 text-primary"
                          >
                            {flight.flightNumber}
                          </Badge>
                        </div>
                      </div>

                      {/* Flight Route */}
                      <div className="lg:w-2/4 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-12 flex-1">
                        <div className="text-center md:text-left min-w-[120px]">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3">
                            {flight.departureAirport}
                          </p>
                          <h4 className="text-5xl font-black tracking-tighter italic leading-none mb-2">
                            {new Date(flight.departureTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </h4>
                          <p className="font-black text-primary uppercase text-sm italic">
                            {flight.departureCity}
                          </p>
                        </div>

                        <div className="flex-1 w-full flex flex-col items-center gap-4">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            <Clock size={16} className="text-primary" />
                            <span>{flight.duration}</span>
                          </div>
                          <div className="w-full relative flex items-center justify-center py-4">
                            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                            <div className="relative bg-background border-2 border-border w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-45 transition-transform">
                              <Plane
                                size={16}
                                className="text-primary rotate-90"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest">
                              {flight.stops === 0
                                ? "NON-STOP"
                                : `${flight.stops} STOP`}
                            </Badge>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                              {flight.class} CLASS
                            </span>
                          </div>
                        </div>

                        <div className="text-center md:text-right min-w-[120px]">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3">
                            {flight.arrivalAirport}
                          </p>
                          <h4 className="text-5xl font-black tracking-tighter italic leading-none mb-2">
                            {new Date(flight.arrivalTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </h4>
                          <p className="font-black text-primary uppercase text-sm italic">
                            {flight.arrivalCity}
                          </p>
                        </div>
                      </div>

                      {/* Side Actions */}
                      <div className="lg:w-1/4 p-10 bg-primary/5 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end lg:border-l border-border/50">
                        <div className="text-left lg:text-right mb-6">
                          <div className="flex items-center lg:justify-end gap-2 text-primary font-black mb-3">
                            <Star size={18} fill="currentColor" />
                            <span className="text-xl italic">
                              {flight.rating?.toFixed(1) || "4.5"}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold italic ml-2">
                              ({flight.reviewCount || 0} REVIEWS)
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 lg:justify-end">
                            <span className="text-5xl font-black tracking-tighter italic">
                              {formatPrice(flight.price)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full max-w-[200px]">
                          <div className="flex gap-2">
                            <Button
                              className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                              onClick={() =>
                                navigate(`/checkout/flight/${flight._id}`)
                              }
                            >
                              Book
                            </Button>
                            <WishlistButton
                              itemType="flight"
                              itemId={flight._id}
                              className="h-14 w-14 rounded-2xl border-2 shadow-sm"
                            />
                          </div>
                          <Button
                            variant="outline"
                            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[9px] border-2 italic hover:bg-primary/5"
                            onClick={() =>
                              setExpandedReview(
                                expandedReview === flight._id
                                  ? null
                                  : flight._id,
                              )
                            }
                          >
                            {expandedReview === flight._id
                              ? "Close Records"
                              : "Rating Records"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedReview === flight._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border/50 bg-muted/10 overflow-hidden"
                        >
                          <div className="p-12">
                            <ReviewSection
                              targetType="flight"
                              targetId={flight._id}
                              onReviewAdded={(avg, count) => {
                                setFlights((prev) =>
                                  prev.map((f) =>
                                    f._id === flight._id
                                      ? {
                                          ...f,
                                          rating: avg,
                                          reviewCount: count,
                                        }
                                      : f,
                                  ),
                                );
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {pagination && pagination.page < pagination.pages && (
            <div className="mt-20 flex justify-center">
              <Button
                variant="ghost"
                size="lg"
                disabled={loadingMore}
                onClick={() => fetchFlights(true)}
                className="group relative px-12 h-20 rounded-full font-black uppercase tracking-[0.3em] text-xs transition-all hover:bg-primary hover:text-white"
              >
                {loadingMore ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    More Flights{" "}
                    <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          )}

          {flights.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center gap-8 bg-muted/20 rounded-[60px] border-2 border-dashed">
              <Plane size={80} className="text-muted-foreground/20" />
              <div className="max-w-md">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
                  Routes Busy
                </h2>
                <p className="text-muted-foreground italic mb-8">
                  No premium wings available for your current trajectory. Select
                  a different route or filter.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full px-8 font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => handleRouteSelect(routeCategories[0].name)}
                >
                  Clear Trajectory
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
