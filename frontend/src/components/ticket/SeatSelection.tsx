
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Seat } from '@/types';
import { useApp } from '@/context/AppContext';
import { generateSeatData } from '@/utils/animations';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define zone data with updated prices to match the image
const zoneData = [
  { id: 'A', name: 'Zone A (Green)', price: 3000, color: 'bg-green-500' },
  { id: 'B', name: 'Zone B (Yellow)', price: 1500, color: 'bg-yellow-500' },
  { id: 'C', name: 'Zone C (Blue)', price: 1000, color: 'bg-blue-400' },
];

// Define layout data for the stage diagram - simplified to match the image
const zoneLayout = [
  // Zone A (Green) - Top row
  { id: 'A1', zone: 'A', position: 'left-[30%] top-[40%] rotate-[-10deg]', width: 'w-32', height: 'h-20' },
  { id: 'A2', zone: 'A', position: 'left-[50%] top-[35%] rotate-[0deg]', width: 'w-32', height: 'h-20' },
  { id: 'A3', zone: 'A', position: 'left-[70%] top-[40%] rotate-[10deg]', width: 'w-32', height: 'h-20' },
  
  // Zone B (Yellow) - Middle row
  { id: 'B1', zone: 'B', position: 'left-[30%] top-[55%] rotate-[-10deg]', width: 'w-32', height: 'h-20' },
  { id: 'B2', zone: 'B', position: 'left-[50%] top-[50%] rotate-[0deg]', width: 'w-32', height: 'h-20' },
  { id: 'B3', zone: 'B', position: 'left-[70%] top-[55%] rotate-[10deg]', width: 'w-32', height: 'h-20' },
  
  // Zone C (Blue) - Bottom row
  { id: 'C1', zone: 'C', position: 'left-[30%] top-[70%] rotate-[-10deg]', width: 'w-32', height: 'h-20' },
  { id: 'C2', zone: 'C', position: 'left-[50%] top-[65%] rotate-[0deg]', width: 'w-32', height: 'h-20' },
  { id: 'C3', zone: 'C', position: 'left-[70%] top-[70%] rotate-[10deg]', width: 'w-32', height: 'h-20' },
];

const SeatSelection: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [step, setStep] = useState<'zone' | 'section' | 'seats'>('zone');

  useEffect(() => {
    if (!state.selectedConcert) {
      navigate('/');
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      const generatedSeats = generateSeatData();
      setSeats(generatedSeats);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.selectedConcert, navigate]);

  // Filter seats based on selected zone
  const filteredSeats = seats.filter(seat => {
    if (!selectedZone) return true;
    
    const zone = selectedZone.charAt(0);
    // Update the prices to match our new zone data
    if (zone === 'A') return seat.price === 3000;
    if (zone === 'B') return seat.price === 1500;
    if (zone === 'C') return seat.price === 1000;
    return true;
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'unavailable') return;

    if (seat.status === 'available') {
      const updatedSeat: Seat = { ...seat, status: 'selected' as const };
      setSeats(seats.map(s => (s.id === seat.id ? updatedSeat : s)));
      dispatch({ type: 'ADD_SEAT', payload: updatedSeat });
    } else {
      const updatedSeat: Seat = { ...seat, status: 'available' as const };
      setSeats(seats.map(s => (s.id === seat.id ? updatedSeat : s)));
      dispatch({ type: 'REMOVE_SEAT', payload: seat.id });
    }
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setStep('section');
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    setStep('seats');
  };

  const handleBackToZones = () => {
    setSelectedZone(null);
    setSelectedSection(null);
    setStep('zone');
    // Clear selected seats when going back
    dispatch({ type: 'CLEAR_SEATS' });
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setStep('section');
    // Clear selected seats when going back
    dispatch({ type: 'CLEAR_SEATS' });
  };

  const handleSubmit = () => {
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto"></div>
          <div className="h-64 w-80 bg-gray-200 rounded mx-auto"></div>
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // Group seats by row
  const seatsByRow = filteredSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Get price categories
  const priceCategories = [...new Set(seats.map(seat => seat.price))].sort((a, b) => b - a);

  // Filter sections based on selected zone
  const filteredSections = zoneLayout.filter(
    section => selectedZone === null || section.zone === selectedZone
  );

  return (
    <div className="pt-16 pb-16 bg-[#1A1A1A] min-h-screen">
      <div className="container mx-auto px-4">
        {/* Price Legend - Updated to match the design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-red-400 rounded-lg p-4 mb-8 bg-[#222]"
        >
          <div className="flex justify-center gap-10 flex-wrap">
            {zoneData.map((zone) => (
              <div key={zone.id} className="flex items-center space-x-4">
                <div 
                  className={`w-12 h-12 rounded-full ${zone.color} flex items-center justify-center text-white font-bold`}
                />
                <span className="text-white font-bold">{zone.price.toLocaleString()} BATH</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 1: Zone Selection - Updated to match the design */}
        {step === 'zone' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Select Your Zone</h2>
            
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] mb-8">
              {/* Stage - Updated to match the design */}
              <div className="absolute left-1/2 top-[20%] transform -translate-x-1/2 py-6 px-12 bg-red-500 text-white font-bold uppercase text-2xl z-10 w-40 text-center">
                STAGE
              </div>
              
              {/* Zone Sections - Updated to match the design */}
              {zoneLayout.map((section) => (
                <div 
                  key={section.id}
                  onClick={() => handleZoneSelect(section.zone)}
                  className={`absolute ${section.position} ${section.width} ${section.height} 
                    ${section.zone === 'A' ? 'bg-green-500' : section.zone === 'B' ? 'bg-yellow-500' : 'bg-blue-400'} 
                    opacity-90 hover:opacity-100 cursor-pointer rounded-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-3xl">{section.id}</span>
                </div>
              ))}
            </div>
            
            {/* Zone Selection Buttons - Updated to match the design */}
            <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto">
              <button
                onClick={() => handleZoneSelect('A')}
                className="px-6 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-all"
              >
                Zone A (3,000฿)
              </button>
              <button
                onClick={() => handleZoneSelect('B')}
                className="px-6 py-3 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-all"
              >
                Zone B (1,500฿)
              </button>
              <button
                onClick={() => handleZoneSelect('C')}
                className="px-6 py-3 rounded-full bg-blue-400 text-white font-medium hover:bg-blue-500 transition-all"
              >
                Zone C (1,000฿)
              </button>
            </div>
          </motion.div>
        )}

        {/* Section Selection */}
        {step === 'section' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={handleBackToZones}
                className="mr-4 text-white hover:text-brand-pink transition-colors"
              >
                &larr; Back to Zones
              </button>
              <h2 className="text-2xl font-bold text-white">
                Select Section in Zone {selectedZone} 
                ({selectedZone === 'A' ? '3,000' : selectedZone === 'B' ? '1,500' : '1,000'} BATH)
              </h2>
            </div>
            
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] mb-8">
              {/* Stage */}
              <div className="absolute left-1/2 top-[20%] transform -translate-x-1/2 py-6 px-12 bg-red-500 text-white font-bold uppercase text-2xl z-10 w-40 text-center">
                STAGE
              </div>
              
              {/* Section Blocks - Only show sections for the selected zone */}
              {zoneLayout
                .filter(section => section.zone === selectedZone)
                .map((section) => (
                  <div 
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className={`absolute ${section.position} ${section.width} ${section.height} 
                      ${selectedZone === 'A' ? 'bg-green-500' : selectedZone === 'B' ? 'bg-yellow-500' : 'bg-blue-400'} 
                      opacity-90 hover:opacity-100 cursor-pointer rounded-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-3xl">{section.id}</span>
                  </div>
                ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {zoneLayout
                .filter(section => section.zone === selectedZone)
                .map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className={`px-6 py-3 rounded-full text-white font-medium 
                      ${selectedZone === 'A' ? 'bg-green-500 hover:bg-green-600' : 
                        selectedZone === 'B' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                        'bg-blue-400 hover:bg-blue-500'} 
                      transition-all`}
                  >
                    Section {section.id}
                  </button>
                ))}
            </div>
          </motion.div>
        )}

        {/* Seat Selection */}
        {step === 'seats' && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center mb-6"
            >
              <button 
                onClick={handleBackToSections}
                className="mr-4 text-white hover:text-brand-pink transition-colors"
              >
                &larr; Back to Sections
              </button>
              <h2 className="text-2xl font-bold text-white">
                Select Seats in Section {selectedSection}
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="py-6 px-12 bg-red-500 text-white font-bold uppercase text-2xl inline-block mx-auto w-40">
                STAGE
              </div>
              <div className="w-full h-0.5 bg-red-500 mt-2 rounded-full" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-10 max-w-3xl mx-auto"
            >
              {Object.entries(seatsByRow).length > 0 ? (
                Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center mb-4">
                    <div className="text-white font-bold mr-4">{row}</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {rowSeats.map((seat) => (
                        <div
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            seat.status === 'available'
                              ? selectedZone === 'A'
                                ? 'bg-green-500 hover:bg-green-600'
                                : selectedZone === 'B'
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-blue-400 hover:bg-blue-500'
                              : seat.status === 'selected'
                              ? 'bg-white text-black'
                              : 'bg-red-500'
                          } cursor-pointer transition-all`}
                        >
                          {seat.status === 'selected' ? (
                            <Check size={18} className="text-black" />
                          ) : seat.status === 'unavailable' ? (
                            <X size={18} className="text-white" />
                          ) : (
                            seat.number
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white text-center py-8">
                  No seats available in this section. Please try another section.
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 border border-red-500 rounded-lg flex justify-between items-center mb-8 bg-[#222]"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold">
                  <Check size={18} className="text-black" />
                </div>
                <span className="text-white font-medium">Selected seat</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <X size={18} className="text-white" />
                </div>
                <span className="text-white font-medium">Unavailable seat</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-center mt-8"
            >
              <button
                onClick={handleSubmit}
                disabled={state.selectedSeats.length === 0}
                className={`px-8 py-3 rounded-full text-white font-bold ${
                  state.selectedSeats.length > 0
                    ? 'bg-brand-pink hover:bg-opacity-90 hover:shadow-lg active:scale-95'
                    : 'bg-gray-500 cursor-not-allowed'
                } transition-all`}
              >
                {state.selectedSeats.length > 0 
                  ? 'Proceed to Payment' 
                  : 'Please select at least one seat'}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
