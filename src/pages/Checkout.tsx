import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { ShieldCheck, Loader2, Plane, Hotel, Star, MapPin, Clock } from 'lucide-react';
import { StripeCardElement } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ amount, bookingData }: any) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as unknown as StripeCardElement,
          billing_details: { name: 'Customer' },
        }
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          await fetch('/api/bookings', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              type: bookingData.type,
              flightId: bookingData.type === 'flight' ? bookingData.id : undefined,
              hotelId: bookingData.type === 'hotel' ? bookingData.id : undefined,
              totalAmount: amount,
              paymentIntentId: result.paymentIntent.id
            })
          });
          navigate('/my-bookings');
        }
      }
    } catch (err) {
      setError('An error occurred. Using mock success for demo.');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 border-2 border-border/50 rounded-3xl bg-muted/20">
        <CardElement options={{
          style: {
            base: {
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>
      {error && <div className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-xl">{error}</div>}
      <Button 
        type="submit" 
        className="w-full h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-lg shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all"
        disabled={!stripe || processing}
      >
        {processing ? <Loader2 className="animate-spin mr-3" /> : <ShieldCheck className="mr-3" />}
        {t('pay_securely')} {formatPrice(amount)}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { type, id } = useParams();
  const { formatPrice } = useCurrency();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const endpoint = type === 'hotel' ? `/api/hotels/${id}` : `/api/flights/${id}`;
        const res = await fetch(endpoint).then(r => r.json());
        setItem(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (type && id) fetchItem();
  }, [type, id]);

  if (loading) return (
    <div className="container mx-auto p-20 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-black italic uppercase tracking-widest text-xs">Preparing secure gateway...</p>
    </div>
  );

  if (!item) return <div className="p-20 text-center font-bold">Item not found.</div>;

  const price = type === 'hotel' ? item.pricePerNight : item.price;
  const totalAmount = price + 45; // Adding taxes/fees

  return (
    <div className="container mx-auto px-4 sm:px-10 py-12 sm:py-20 flex flex-col lg:flex-row gap-12 sm:gap-20 justify-center">
      {/* Booking Summary */}
      <div className="w-full lg:w-1/2 space-y-10">
        <div className="space-y-6">
           <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] italic">Review Selection</span>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">Final Confirmation</h1>
        </div>

        <Card className="rounded-[40px] border-none shadow-2xl bg-card overflow-hidden">
          <div className="aspect-[21/9] relative overflow-hidden">
             {type === 'hotel' ? (
                <img src={item.images?.[0]} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                   <Plane size={80} className="text-primary/20 -rotate-12" />
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <div className="absolute bottom-10 left-10">
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{type === 'hotel' ? item.name : item.airline}</h2>
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                   {type === 'hotel' ? <MapPin size={14} /> : <Plane size={14} />}
                   {type === 'hotel' ? `${item.city}, ${item.country}` : `${item.departureCity} → ${item.arrivalCity}`}
                </p>
             </div>
          </div>
          <CardContent className="p-10 space-y-8">
             <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block italic">Service Level</span>
                  <div className="flex items-center gap-2 font-black italic uppercase">
                    <Star size={16} className="text-primary" fill="currentColor" />
                    <span>{type === 'hotel' ? `${item.rating} Stars` : `${item.class} Elite`}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block italic">Reference</span>
                  <p className="font-black italic uppercase italic">{type === 'hotel' ? 'Luxe Property' : item.flightNumber}</p>
                </div>
             </div>

             <div className="pt-8 border-t border-border/50">
               <h4 className="font-black uppercase italic tracking-tighter text-xl mb-6">Pricing Distribution</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm italic font-medium">
                    <span className="text-muted-foreground">Standard Rate</span>
                    <span>{formatPrice(price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm italic font-medium">
                    <span className="text-muted-foreground">Premium Surcharge & Taxes</span>
                    <span>{formatPrice(45)}</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <span className="text-xl font-black uppercase tracking-tighter italic">Total Investment</span>
                    <span className="text-4xl font-black italic tracking-tighter text-primary underline underline-offset-8 decoration-4">{formatPrice(totalAmount)}</span>
                  </div>
               </div>
             </div>

             <div className="p-8 bg-primary/5 rounded-[30px] border-2 border-dashed border-primary/20 space-y-4">
                <h5 className="font-black uppercase italic tracking-tighter text-primary">SkyWay Protection Included</h5>
                <p className="text-[10px] leading-relaxed italic text-muted-foreground font-medium">This transaction is covered by our elite travel insurance, guaranteeing 100% reimbursement in case of institutional cancellations.</p>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Form */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-32">
        <Card className="rounded-[40px] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.5)] border-none overflow-hidden bg-card">
          <CardHeader className="p-12 text-center space-y-4">
            <CardTitle className="text-4xl font-black uppercase italic tracking-tighter">Cipher Payment</CardTitle>
            <p className="text-muted-foreground italic text-sm">Enter your payment credentials into our encrypted gateway for instant processing.</p>
          </CardHeader>
          <CardContent className="p-12 pt-0">
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={totalAmount} bookingData={{ type, id, item }} />
            </Elements>
            
            <div className="mt-12 flex flex-col items-center gap-6">
               <div className="flex gap-4 grayscale opacity-30">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6 w-auto" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8 w-auto" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6 w-auto" />
               </div>
               <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 italic">
                <ShieldCheck size={14} className="text-primary" /> End-to-End Encrypted Gateway
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
