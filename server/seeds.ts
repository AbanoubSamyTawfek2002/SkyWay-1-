// Helper to generate multiple hotels for a city
const generateHotels = (city: string, country: string, basePrice: number, count: number, startIdIndex: number) => {
  const hotelNames = [
    "Grand Regency", "Royal Palace", "Elite Suites", "Skyline Hotel", "Serene Resort",
    "Ocean View", "Mountain Retreat", "Urban Oasis", "Garden Villa", "Crystal Tower",
    "Golden Sands", "Emerald Bay", "Sapphire Heights", "Diamond Plaza", "Pearl Harbor Inn",
    "Ivory Coast", "Marble Arch", "Platinum Suites", "Velvet Rose", "Silk Road Hotel"
  ];

  const amenityPool = ["Spa", "Gym", "Pool", "WiFi", "fine Dining", "Butler", "24h Service", "Concierge"];

  return Array.from({ length: count }).map((_, i) => {
    // Unique signature for Unsplash to get different images
    const sig = `${city.replace(/\s+/g, '')}${i}${startIdIndex}`;
    return {
      name: `${city} ${hotelNames[i % hotelNames.length]} ${startIdIndex + i}`,
      city,
      country,
      location: `${['Central', 'Downtown', 'Old Town', 'Harbor', 'Riverside', 'Sky', 'Mountain', 'Beach'][i % 8]} Area`,
      description: `A stunning property in the heart of ${city}, offering world-class luxury and unparalleled comfort for discerning travelers.`,
      images: [
        `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80&sig=${sig}1`,
        `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80&sig=${sig}2`
      ],
      pricePerNight: basePrice + (Math.random() * 200),
      rating: +(4 + (Math.random() * 1)).toFixed(1),
      reviewCount: Math.floor(Math.random() * 5000) + 100,
      amenities: amenityPool.sort(() => 0.5 - Math.random()).slice(0, 5)
    };
  });
};

export const HOTELS = [
  ...generateHotels("Cairo", "Egypt", 120, 25, 100),
  ...generateHotels("Alexandria", "Egypt", 100, 15, 150),
  ...generateHotels("Dubai", "UAE", 450, 30, 200),
  ...generateHotels("Abu Dhabi", "UAE", 350, 15, 250),
  ...generateHotels("London", "UK", 500, 25, 300),
  ...generateHotels("Paris", "France", 550, 25, 400),
  ...generateHotels("New York", "USA", 600, 25, 500),
  ...generateHotels("Tokyo", "Japan", 480, 25, 600),
  ...generateHotels("Rome", "Italy", 420, 20, 700),
  ...generateHotels("Singapore", "Singapore", 520, 20, 800),
  // Original high-profile hotels with user-requested names
  {
    name: "Marriott Mena House",
    city: "Cairo",
    country: "Egypt",
    location: "Giza Pyramids",
    description: "Historic hotel with stunning views of the Great Pyramids of Giza.",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 350,
    rating: 4.8,
    reviewCount: 2240,
    amenities: ["Pyramid View", "Pool", "Spa", "Fine Dining"]
  },
  {
    name: "Four Seasons Cairo at Nile Plaza",
    city: "Cairo",
    country: "Egypt",
    location: "Garden City",
    description: "Luxury living overlooking the iconic Nile river.",
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 550,
    rating: 4.9,
    reviewCount: 1840,
    amenities: ["Nile View", "Spa", "Fitness Center", "Gourmet Restaurants"]
  },
  {
    name: "Steigenberger Hotel Tahrir Square",
    city: "Cairo",
    country: "Egypt",
    location: "Downtown",
    description: "Contemporary hotel in the heart of historic Cairo.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 220,
    rating: 4.7,
    reviewCount: 3100,
    amenities: ["Central Location", "Pool", "WiFi", "Bar"]
  },
  {
    name: "Burj Al Arab Jumeirah",
    city: "Dubai",
    country: "UAE",
    location: "Jumeirah Beach",
    description: "The world's most luxurious hotel, an iconic sail-shaped silhouette.",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 1200,
    rating: 5.0,
    reviewCount: 3500,
    amenities: ["Private Beach", "Helipad", "9 Restaurants", "Butler Service"]
  },
  {
    name: "Atlantis The Palm",
    city: "Dubai",
    country: "UAE",
    location: "Palm Jumeirah",
    description: "Ocean-themed luxury resort on the majestic Palm Jumeirah island.",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 650,
    rating: 4.8,
    reviewCount: 8900,
    amenities: ["Waterpark", "Aquarium", "Private Beach", "Dolphin Bay"]
  },
  {
    name: "Jumeirah Beach Hotel",
    city: "Dubai",
    country: "UAE",
    location: "Jumeirah",
    description: "Family-oriented luxury hotel with a unique wave-inspired design.",
    images: ["https://images.unsplash.com/photo-1551882547-ff43c63faf76?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 450,
    rating: 4.7,
    reviewCount: 5200,
    amenities: ["Pools", "Kids Club", "Beach Access", "Spa"]
  },
  {
    name: "The Savoy",
    city: "London",
    country: "UK",
    location: "The Strand",
    description: "The only luxury hotel on the river Thames and the most famous hotel in the world.",
    images: ["https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 720,
    rating: 4.8,
    reviewCount: 3100,
    amenities: ["Butler Service", "Afternoon Tea", "History Tour", "River View"]
  },
  {
    name: "The Ritz London",
    city: "London",
    country: "UK",
    location: "Piccadilly",
    description: "World-renowned hotel delivering unparalleled service and timeless elegance.",
    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 850,
    rating: 4.9,
    reviewCount: 4200,
    amenities: ["Royal Warrant", "Afternoon Tea", "Fine Dining", "Casino"]
  },
  {
    name: "The Ritz-Carlton Paris",
    city: "Paris",
    country: "France",
    location: "Place Vendôme",
    description: "Experience ultimate luxury in the heart of Paris with unparalleled service and history.",
    images: ["https://images.unsplash.com/photo-1551882547-ff43c63faf76?auto=format&fit=crop&w=1200&q=80"],
    pricePerNight: 950,
    rating: 5.0,
    reviewCount: 1500,
    amenities: ["Spa", "Michelin Star Dining", "Fitness Center", "Pool"]
  }
];

export const BLOGS = [
  {
    title: "10 Essential Tips for Solo Travelers",
    content: "Solo travel can be one of the most rewarding experiences of your life. It offers freedom, self-discovery, and the chance to meet incredible people. However, it also requires careful planning and safety precautions. Here are our top 10 tips for making the most of your solo journey...",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80",
    category: "Travel Tips",
    slug: "solo-travel-tips"
  },
  {
    title: "Finding the Best Budget Stays in Japan",
    content: "Japan is known for its high-end luxury, but it's also entirely possible to explore this beautiful country on a budget. From capsule hotels to traditional minshukus, we've compiled a list of the best affordable accommodations that don't compromise on experience...",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80",
    category: "Budget Travel",
    slug: "budget-japan-accommodation"
  },
  {
    title: "Hidden Gems of the Amalfi Coast",
    content: "While Positano and Amalfi get all the glory, there are dozens of tiny villages and secluded beaches tucked away along the coastline that offer a more authentic Italian experience. Join us as we venture off the beaten path to discover the coast's best-kept secrets...",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    category: "Destinations",
    slug: "amalfi-coast-hidden-gems"
  },
  {
    title: "The Ultimate Guide to Digital Nomadism",
    content: "Working from anywhere in the world sounds like a dream, but it comes with its own set of challenges. Stability, internet access, and community are key. We look at the best cities for digital nomads in 2026 and how to set yourself up for success...",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80",
    category: "Lifestyle",
    slug: "digital-nomad-guide"
  },
  {
    title: "Foodie Paradise: A Culinary Tour of Bangkok",
    content: "Bangkok's food scene is a sensory explosion. From Michelin-starred street food stalls to high-end rooftop restaurants, the flavors are bold, spicy, and unforgettable. Here's your itinerary for the ultimate 48-hour foodie tour of the Thai capital...",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    category: "Food & Drink",
    slug: "bangkok-culinary-tour"
  }
];

// Helper for flights
const generateFlights = (from: string, arrivalCity: string, airline: string, basePrice: number, count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const departureTime = new Date(Date.now() + (Math.random() * 86400000 * 7));
    const arrivalTime = new Date(departureTime.getTime() + (Math.random() * 32400000 + 7200000));
    return {
      airline,
      airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
      departureCity: from,
      departureAirport: from.substring(0, 3).toUpperCase(),
      arrivalCity,
      arrivalAirport: arrivalCity.substring(0, 3).toUpperCase(),
      departureTime,
      arrivalTime,
      duration: `${Math.floor((arrivalTime.getTime() - departureTime.getTime()) / 3600000)}h ${Math.floor(((arrivalTime.getTime() - departureTime.getTime()) % 3600000) / 60000)}m`,
      stops: Math.floor(Math.random() * 2),
      price: basePrice + (Math.random() * 150),
      availableSeats: Math.floor(Math.random() * 200) + 10,
      class: ["Economy", "Business", "First"][i % 3]
    };
  });
};

export const FLIGHTS = [
  ...generateFlights("Cairo", "Dubai", "EgyptAir", 350, 10),
  ...generateFlights("Dubai", "London", "Emirates", 600, 10),
  ...generateFlights("Paris", "New York", "Air France", 550, 10),
  ...generateFlights("New York", "Tokyo", "Delta", 900, 10),
  ...generateFlights("London", "Cairo", "British Airways", 450, 10),
  ...generateFlights("Tokyo", "Dubai", "JAL", 850, 10),
  {
    airline: "Emirates",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
    flightNumber: "EK201",
    departureCity: "Dubai",
    departureAirport: "DXB",
    arrivalCity: "London",
    arrivalAirport: "LHR",
    departureTime: new Date(Date.now() + 86400000),
    arrivalTime: new Date(Date.now() + 86400000 + 27000000),
    duration: "7h 30m",
    stops: 0,
    price: 650,
    availableSeats: 45,
    class: "Economy"
  },
  {
    airline: "Lufthansa",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lufthansa_Logo_2018.svg",
    flightNumber: "LH401",
    departureCity: "Frankfurt",
    departureAirport: "FRA",
    arrivalCity: "New York",
    arrivalAirport: "JFK",
    departureTime: new Date(Date.now() + 172800000),
    arrivalTime: new Date(Date.now() + 172800000 + 32400000),
    duration: "9h 00m",
    stops: 1,
    price: 780,
    availableSeats: 22,
    class: "Business"
  },
  {
    airline: "Qatar Airways",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_Logo.svg",
    flightNumber: "QR101",
    departureCity: "Doha",
    departureAirport: "DOH",
    arrivalCity: "Paris",
    arrivalAirport: "CDG",
    departureTime: new Date(Date.now() + 259200000),
    arrivalTime: new Date(Date.now() + 259200000 + 23400000),
    duration: "6h 30m",
    stops: 0,
    price: 520,
    availableSeats: 80,
    class: "Economy"
  },
  {
    airline: "Singapore Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/en/6/6b/Singapore_Airlines_Logo_2.svg",
    flightNumber: "SQ22",
    departureCity: "Singapore",
    departureAirport: "SIN",
    arrivalCity: "New York",
    arrivalAirport: "EWR",
    departureTime: new Date(Date.now() + 345600000),
    arrivalTime: new Date(Date.now() + 345600000 + 68400000),
    duration: "19h 00m",
    stops: 0,
    price: 1200,
    availableSeats: 15,
    class: "First"
  },
  {
    airline: "British Airways",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/en/c/c5/British_Airways_Logo.svg",
    flightNumber: "BA2491",
    departureCity: "London",
    departureAirport: "LHR",
    arrivalCity: "Dubai",
    arrivalAirport: "DXB",
    departureTime: new Date(Date.now() + 432000000),
    arrivalTime: new Date(Date.now() + 432000000 + 25200000),
    duration: "7h 00m",
    stops: 0,
    price: 490,
    availableSeats: 110,
    class: "Economy"
  },
  {
    airline: "Air France",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Air_France_Logo.svg",
    flightNumber: "AF22",
    departureCity: "Paris",
    departureAirport: "CDG",
    arrivalCity: "Tokyo",
    arrivalAirport: "HND",
    departureTime: new Date(Date.now() + 518400000),
    arrivalTime: new Date(Date.now() + 518400000 + 46800000),
    duration: "13h 00m",
    stops: 0,
    price: 890,
    availableSeats: 35,
    class: "Economy"
  },
  {
    airline: "Turkish Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Turkish_Airlines_logo_2019.svg",
    flightNumber: "TK1822",
    departureCity: "Istanbul",
    departureAirport: "IST",
    arrivalCity: "Berlin",
    arrivalAirport: "BER",
    departureTime: new Date(Date.now() + 604800000),
    arrivalTime: new Date(Date.now() + 604800000 + 10800000),
    duration: "3h 00m",
    stops: 0,
    price: 220,
    availableSeats: 65,
    class: "Economy"
  },
  {
    airline: "Etihad Airways",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/0/06/Etihad-airways-logo.svg",
    flightNumber: "EY101",
    departureCity: "Abu Dhabi",
    departureAirport: "AUH",
    arrivalCity: "New York",
    arrivalAirport: "JFK",
    departureTime: new Date(Date.now() + 691200000),
    arrivalTime: new Date(Date.now() + 691200000 + 50400000),
    duration: "14h 00m",
    stops: 0,
    price: 1100,
    availableSeats: 40,
    class: "Business"
  },
  {
    airline: "ANA",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/d/da/ANA_logo.svg",
    flightNumber: "NH203",
    departureCity: "Tokyo",
    departureAirport: "HND",
    arrivalCity: "Frankfurt",
    arrivalAirport: "FRA",
    departureTime: new Date(Date.now() + 777600000),
    arrivalTime: new Date(Date.now() + 777600000 + 43200000),
    duration: "12h 00m",
    stops: 0,
    price: 950,
    availableSeats: 30,
    class: "Economy"
  }
];
