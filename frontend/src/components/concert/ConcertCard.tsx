
import React from 'react';
import { Link } from 'react-router-dom';
import { Concert } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, Music } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ConcertCardProps {
  concert: Concert;
  index: number;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert, index }) => {
  // Format the date if it's a valid date string
  const formattedDate = concert.date ? 
    (() => {
      try {
        return format(parseISO(concert.date), 'MMM dd, yyyy');
      } catch (error) {
        return concert.date;
      }
    })() : 
    'Date TBA';




    
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="concert-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl bg-white dark:bg-brand-darkGray hover:translate-y-[-5px]"
    >
      <Link to={`/concert/${concert.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden group">
          <img
            src={concert.image}
            alt={concert.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 text-white">
              {concert.genre && (
                <span className="inline-block px-2 py-1 bg-brand-pink/80 text-white text-xs rounded-full mb-2">
                  {concert.genre}
                </span>
              )}
            </div>
          </div>
          {concert.price && (
            <div className="absolute top-2 right-2 bg-brand-yellow/90 text-brand-black px-2 py-1 rounded font-medium text-sm">
              ฿{concert.price}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold tracking-wide text-lg line-clamp-1">
            {concert.title}
          </h3>
          <div className="flex items-center space-x-1 text-brand-gray text-sm mt-2">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          {concert.venue && (
            <div className="flex items-center space-x-1 text-brand-gray text-sm mt-1">
              <Music size={14} />
              <span className="line-clamp-1">{concert.venue}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ConcertCard;
