import React, { useEffect, useState } from 'react';
import ConcertCard from '@/components/concert/ConcertCard';
import { concertData } from '@/utils/animations';
import { Concert } from '@/types';
import { motion } from 'framer-motion';
import { useSearchParams } from "react-router-dom";



const Home: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  

  useEffect(() => {
   
    setTimeout(() => {
      setConcerts(concertData);
      setLoading(false);
    }, 800);
  }, []);

  const filteredConcerts = concerts.filter((concert) =>
    concert.title.toLowerCase().includes(searchQuery.toLowerCase())
  );




  
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
        {/* 🪩 Display Filtered Concerts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredConcerts.length > 0 ? (
            filteredConcerts.map((concert, index) => (
              <ConcertCard key={concert.id} concert={concert} index={index} />
            ))
          ) : (
            <p className="text-white col-span-full">No concerts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
