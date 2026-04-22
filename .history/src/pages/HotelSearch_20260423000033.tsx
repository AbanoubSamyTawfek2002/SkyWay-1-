import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

export default function HotelSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 API URL (زي ما هو)
  const url =
    "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=-2092174&search_type=CITY&adults=1&children_age=0%2C17&room_qty=1&page_number=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=AED&location=US";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
      "x-rapidapi-host": "booking-com15.p.rapidapi.com",
    },
  };

  // 🔥 fetch function
  const fetchHotels = async () => {
    try {
      setLoading(true);

      const response = await fetch(url, options);

      // 👇 مهم جدا
      if (!response.ok) {
        const errorText = await response.text();
        console.log("API ERROR:", errorText);
        return;
      }

      const result = await response.json(); // ✅ مرة واحدة بس

      console.log("API RESULT:", result);

      // 👇 حماية من undefined
      const hotelsData = result?.data?.hotels || [];

      const mappedHotels = hotelsData.map((hotel: any) => ({
        id: hotel.hotel_id || Math.random(),
        name: hotel.property?.name || "Hotel",
        city: hotel.property?.wishlistName || "City",
        country: hotel.property?.countryCode || "Country",
        rating: hotel.property?.reviewScore || 4,
        price: hotel.property?.priceBreakdown?.grossPrice?.value || 1000,
        image:
          hotel.property?.photoUrls?.[0] ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      }));

      setHotels(mappedHotels);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>Luxe Stays</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
          }}
        >
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "15px" }}>
                <h3>{hotel.name}</h3>

                <p style={{ color: "#777" }}>
                  {hotel.city}, {hotel.country}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <span>{hotel.price} EGP</span>

                  <span style={{ display: "flex", gap: "5px" }}>
                    <Star size={14} /> {hotel.rating}
                  </span>
                </div>

                <div
                  style={{ marginTop: "15px", display: "flex", gap: "10px" }}
                >
                  <button onClick={() => navigate(`/hotels/${hotel.id}`)}>
                    Explore
                  </button>

                  <button
                    onClick={() => navigate(`/checkout/hotel/${hotel.id}`)}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
