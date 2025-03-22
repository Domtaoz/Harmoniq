
import React from 'react';
import { Link } from 'react-router-dom';
import { Concert } from '@/types';
import { motion } from 'framer-motion';

interface ConcertCardProps {
  concert: Concert;
  index: number;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="concert-card rounded-lg overflow-hidden shadow-md transition-card bg-white dark:bg-brand-darkGray"
    >
      <Link to={`/concert/${concert.id}`} className="block">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={concert.image}
            alt={concert.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3 text-center">
          <h3 className="font-bold uppercase tracking-wide text-lg">
            {concert.name}
          </h3>
          <p className="text-brand-gray text-sm mt-1">
            {concert.date}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ConcertCard;
