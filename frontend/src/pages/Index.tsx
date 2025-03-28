
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-black to-gray-900 flex items-center justify-center">
      <div className="container px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-yellow-400">
            CONCERT TICKETS
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xl text-gray-300 mb-10"
          >
            Experience live music like never before. Book your tickets today and create memories that last a lifetime.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleExplore} 
              size="lg" 
              className="bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-6 text-lg rounded-full"
            >
              View Concerts
            </Button>
            
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              size="lg" 
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg rounded-full"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[1, 2, 3, 4].map((img) => (
            <div key={img} className="relative overflow-hidden rounded-lg aspect-square">
              <img 
                src={`https://source.unsplash.com/random/300x300?concert,music&sig=${img}`}
                alt="Concert" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
