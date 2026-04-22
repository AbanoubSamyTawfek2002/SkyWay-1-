import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  role: { 
    type: String, 
    enum: ['user', 'support', 'admin'], 
    default: 'user' 
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  googleId: { type: String },
  languagePreference: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', UserSchema);

// ... (Flight and Hotel models remain)

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['flight', 'hotel'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model('Review', ReviewSchema);

const FlightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  airlineLogo: { type: String },
  flightNumber: { type: String, required: true },
  departureCity: { type: String, required: true },
  departureAirport: { type: String },
  arrivalCity: { type: String, required: true },
  arrivalAirport: { type: String },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: String }, // e.g., "7h 30m"
  stops: { type: Number, default: 0 },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});

export const Flight = mongoose.model('Flight', FlightSchema);

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  pricePerNight: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  amenities: [{ type: String }],
});

export const Hotel = mongoose.model('Hotel', HotelSchema);

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['flight', 'hotel', 'package'], required: true },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  checkIn: { type: Date },
  checkOut: { type: Date },
  passengers: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model('Booking', BookingSchema);

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String, default: 'SkyWay Editor' },
  category: { type: String },
  date: { type: Date, default: Date.now },
  slug: { type: String, unique: true },
});

export const Blog = mongoose.model('Blog', BlogSchema);

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, enum: ['flight', 'hotel'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicates
WishlistSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', WishlistSchema);
