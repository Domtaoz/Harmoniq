import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Calendar, Music } from 'lucide-react';
import { Concert } from '@/types';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

interface ConcertDetailProps {
  concert: Concert;
}

const ConcertDetail: React.FC<ConcertDetailProps> = ({ concert }) => {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleBookTicket = () => {
    dispatch({ type: 'SELECT_CONCERT', payload: concert });
    navigate(`/concert/${concert.id}/seats`);
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-brand-darkGray">
              <img 
                src={concert.image} 
                alt={concert.title} 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h5 className="text-brand-pink text-xl font-medium">{concert.date}</h5>
              <h2 className="text-4xl sm:text-5xl font-bold text-brand-red">{concert.title}</h2>
            </div>

            <div className="flex items-center space-x-2 text-brand-gray">
              <Music size={18} />
              <span>{concert.genre || 'Progressive Rock'}</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-brand-pink/10 rounded-full">
                  <Music className="h-6 w-6 text-brand-pink" />
                </div>
                <div>
                  <div className="text-sm text-brand-gray">Artist</div>
                  <div className="font-medium text-lg">{concert.artists?.map(a => a.name).join(', ')}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-brand-pink/10 rounded-full">
                  <Calendar className="h-6 w-6 text-brand-pink" />
                </div>
                <div>
                  <div className="text-sm text-brand-gray">Date</div>
                  <div className="font-medium text-lg">{concert.date}</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleBookTicket}
                className="px-8 py-3 bg-brand-pink text-white rounded-full font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-95"
              >
                Choose seat and time
              </button>

              <button className="p-3 bg-black/10 backdrop-blur-sm dark:bg-white/10 rounded-full transition-transform hover:scale-105">
                <PlayCircle className="h-6 w-6 text-brand-pink" />
              </button>
            </div>
          </motion.div>
        </div>

        {concert.artists && concert.artists.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-4">Artist</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {concert.artists.map((artist, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="overflow-hidden rounded-lg aspect-square shadow-md w-full">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="mt-3 text-base font-semibold text-center">{artist.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConcertDetail;
