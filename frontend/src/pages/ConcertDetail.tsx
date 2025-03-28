
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConcertDetailComponent from '@/components/concert/ConcertDetail';
import { concertData } from '@/utils/animations';
import { Concert } from '@/types';

const ConcertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      const foundConcert = concertData.find(c => c.id === id);
      
      if (foundConcert) {
        setConcert(foundConcert);
      } else {
        navigate('/not-found');
      }
      
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id, navigate]);




  
  if (loading) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[3/4]"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!concert) {
    return null;
  }

  return <ConcertDetailComponent concert={concert} />;
};

export default ConcertDetail;
