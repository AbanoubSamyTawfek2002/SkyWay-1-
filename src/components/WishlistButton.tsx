import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface WishlistButtonProps {
  itemType: 'flight' | 'hotel';
  itemId: string;
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ itemType, itemId, className }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      checkWishlistStatus();
    }
  }, [user, token, itemId]);

  const checkWishlistStatus = async () => {
    try {
      // Use the specialized IDs endpoint for better performance and reliability
      const res = await fetch('/api/wishlist/ids', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        const found = data.find((i: any) => i.itemId === itemId);
        if (found) {
          setIsSaved(true);
          setWishlistId(found._id);
        } else {
          setIsSaved(false);
          setWishlistId(null);
        }
      }
    } catch (err: any) {
      console.error('Error checking wishlist status:', err.message || err);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save items');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        // If we don't have wishlistId, we can delete by itemId/type or fetch first
        // Let's fetch the specific item to get its _id if we don't have it
        let currentWishlistId = wishlistId;
        if (!currentWishlistId) {
          const res = await fetch('/api/wishlist', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const items = await res.json();
          const found = items.find((i: any) => i.itemId === itemId && i.itemType === itemType);
          if (found) currentWishlistId = found._id;
        }

        if (currentWishlistId) {
          const res = await fetch(`/api/wishlist/${currentWishlistId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setIsSaved(false);
            setWishlistId(null);
            toast.success('Removed from wishlist');
          }
        }
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ itemType, itemId })
        });
        if (res.ok) {
          const data = await res.json();
          setIsSaved(true);
          setWishlistId(data._id);
          toast.success('Added to wishlist');
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 transition-all ${className}`}
      onClick={toggleWishlist}
      disabled={loading}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isSaved ? 'saved' : 'unsaved'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
          />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};
