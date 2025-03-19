
import React, { useEffect, useState } from 'react';
import ConcertCard from '@/components/concert/ConcertCard';
import { concertData } from '@/utils/animations';
import { Concert } from '@/types';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConcerts(concertData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="animate-pulse mb-10">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 w-1/4 rounded mb-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-[3/4] rounded-lg mb-3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-10 text-yellow-400"
        >
          CONCERT
        </motion.h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {concerts.map((concert, index) => (
            <ConcertCard key={concert.id} concert={concert} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
