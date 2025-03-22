
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Ticket } from '@/types';

interface TicketViewProps {
  ticket: Ticket;
}

const TicketView: React.FC<TicketViewProps> = ({ ticket }) => {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">YOUR TICKET</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="ticket-container relative overflow-hidden rounded-xl shadow-2xl">
            <div className="flex bg-black text-white">
              {/* Left part of the ticket - Main content */}
              <div className="flex-1 p-4">
                <img 
                  src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Concert" 
                  className="w-full h-48 object-cover mb-4"
                />
                <div className="py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
                  <h2 className="text-xl font-bold text-center">music concerts</h2>
                </div>
              </div>
              
              {/* Right part of the ticket - Details */}
              <div className="bg-black w-36 border-l border-dashed border-gray-600 p-2 flex flex-col justify-between">
                <div className="px-2">
                  <div className="mb-3">
                    <div className="text-xs text-gray-400">SEAT</div>
                    <div className="font-bold text-xl">A4</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-400">ROW</div>
                    <div className="font-bold text-xl">02</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-400">DATE</div>
                    <div className="font-bold text-sm">18 APR 2013</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400">TICKET ID:</div>
                  <div className="text-xs">123456789</div>
                  <div className="mt-2 border-t border-gray-600 pt-2">
                    <div className="rotate-90 transform origin-top-left absolute bottom-0 right-2 text-xs tracking-widest">
                      {Array.from('0123456789').map((char, i) => (
                        <span key={i} className="inline-block mx-0.5">{char}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link 
              to="/"
              className="px-8 py-3 bg-red-700 text-white rounded-lg font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
