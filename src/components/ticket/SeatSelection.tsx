
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

// Define zone data
const zoneData = [
  { id: 'A', name: 'Zone A (Green)', price: 2000, color: 'bg-brand-green' },
  { id: 'B', name: 'Zone B (Yellow)', price: 1800, color: 'bg-brand-yellow' },
  { id: 'C', name: 'Zone C (Blue)', price: 1600, color: 'bg-brand-blue' },
];

// Define layout data for the stage diagram
const zoneLayout = [
  { id: 'A1', zone: 'A', position: 'left-[35%] top-[35%] rotate-[-20deg]', width: 'w-20', height: 'h-16' },
  { id: 'A2', zone: 'A', position: 'left-[44%] top-[30%] rotate-[-10deg]', width: 'w-20', height: 'h-16' },
  { id: 'A3', zone: 'A', position: 'left-[55%] top-[30%] rotate-[10deg]', width: 'w-20', height: 'h-16' },
  { id: 'A4', zone: 'A', position: 'left-[64%] top-[35%] rotate-[20deg]', width: 'w-20', height: 'h-16' },
  { id: 'A5', zone: 'A', position: 'left-[73%] top-[40%] rotate-[30deg]', width: 'w-20', height: 'h-16' },
  { id: 'A6', zone: 'A', position: 'left-[79%] top-[47%] rotate-[40deg]', width: 'w-20', height: 'h-16' },
  
  { id: 'B1', zone: 'B', position: 'left-[25%] top-[42%] rotate-[-30deg]', width: 'w-24', height: 'h-16' },
  { id: 'B2', zone: 'B', position: 'left-[35%] top-[50%] rotate-[-20deg]', width: 'w-24', height: 'h-16' },
  { id: 'B3', zone: 'B', position: 'left-[48%] top-[55%] rotate-[0deg]', width: 'w-24', height: 'h-16' },
  { id: 'B4', zone: 'B', position: 'left-[62%] top-[55%] rotate-[0deg]', width: 'w-24', height: 'h-16' },
  { id: 'B5', zone: 'B', position: 'left-[75%] top-[50%] rotate-[20deg]', width: 'w-24', height: 'h-16' },
  { id: 'B6', zone: 'B', position: 'left-[85%] top-[42%] rotate-[30deg]', width: 'w-24', height: 'h-16' },
  
  { id: 'C1', zone: 'C', position: 'left-[15%] top-[52%] rotate-[-30deg]', width: 'w-28', height: 'h-20' },
  { id: 'C2', zone: 'C', position: 'left-[28%] top-[65%] rotate-[-20deg]', width: 'w-28', height: 'h-20' },
  { id: 'C3', zone: 'C', position: 'left-[48%] top-[72%] rotate-[0deg]', width: 'w-28', height: 'h-20' },
  { id: 'C4', zone: 'C', position: 'left-[68%] top-[72%] rotate-[0deg]', width: 'w-28', height: 'h-20' },
  { id: 'C5', zone: 'C', position: 'left-[87%] top-[65%] rotate-[20deg]', width: 'w-28', height: 'h-20' },
  { id: 'C6', zone: 'C', position: 'left-[100%] top-[52%] rotate-[30deg]', width: 'w-28', height: 'h-20' },
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
    if (zone === 'A') return seat.price === 2000;
    if (zone === 'B') return seat.price === 1800;
    if (zone === 'C') return seat.price === 1600;
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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="pt-24 pb-16 bg-brand-black min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-red-600 rounded-lg p-4 mb-8 flex justify-between items-center flex-wrap gap-4"
        >
          {priceCategories.map((price) => (
            <div key={price} className="flex items-center space-x-4">
              <div 
                className={`w-12 h-12 rounded-full ${
                  price === 2000 ? 'bg-brand-green' : price === 1800 ? 'bg-brand-yellow' : 'bg-brand-blue'
                } flex items-center justify-center text-white font-bold`}
              />
              <span className="text-white font-bold">{price.toLocaleString()} BATH</span>
            </div>
          ))}
        </motion.div>

        {/* Step 1: Zone Selection */}
        {step === 'zone' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Your Zone</h2>
            
            <div className="relative w-full aspect-[16/9] mb-8">
              {/* Stage */}
              <div className="absolute left-1/2 top-[15%] transform -translate-x-1/2 py-6 px-12 bg-brand-red text-white font-bold uppercase text-2xl z-10">
                STAGE
              </div>
              
              {/* Curved Stage Line */}
              <div className="absolute left-1/2 top-[28%] w-[70%] h-1 bg-red-600 transform -translate-x-1/2 rounded-t-full"></div>
              
              {/* Zone Sections */}
              {zoneLayout.map((section) => (
                <div 
                  key={section.id}
                  onClick={() => handleZoneSelect(section.zone)}
                  className={`absolute ${section.position} ${section.width} ${section.height} 
                    ${section.zone === 'A' ? 'bg-brand-green' : section.zone === 'B' ? 'bg-brand-yellow' : 'bg-brand-blue'} 
                    opacity-80 hover:opacity-100 cursor-pointer rounded-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">{section.id}</span>
                </div>
              ))}
            </div>
            
            <div className="max-w-md mx-auto">
              <Tabs defaultValue="A" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="A" onClick={() => handleZoneSelect('A')}>Zone A (2,000฿)</TabsTrigger>
                  <TabsTrigger value="B" onClick={() => handleZoneSelect('B')}>Zone B (1,800฿)</TabsTrigger>
                  <TabsTrigger value="C" onClick={() => handleZoneSelect('C')}>Zone C (1,600฿)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        )}

        {/* Step 2: Section Selection */}
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
                Select Section in Zone {selectedZone} ({selectedZone === 'A' ? '2,000' : selectedZone === 'B' ? '1,800' : '1,600'} BATH)
              </h2>
            </div>
            
            <div className="relative w-full aspect-[16/9] mb-8">
              {/* Stage */}
              <div className="absolute left-1/2 top-[15%] transform -translate-x-1/2 py-6 px-12 bg-brand-red text-white font-bold uppercase text-2xl z-10">
                STAGE
              </div>
              
              {/* Curved Stage Line */}
              <div className="absolute left-1/2 top-[28%] w-[70%] h-1 bg-red-600 transform -translate-x-1/2 rounded-t-full"></div>
              
              {/* Section Blocks - Only show sections for the selected zone */}
              {filteredSections.map((section) => (
                <div 
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`absolute ${section.position} ${section.width} ${section.height} 
                    ${selectedZone === 'A' ? 'bg-brand-green' : selectedZone === 'B' ? 'bg-brand-yellow' : 'bg-brand-blue'} 
                    opacity-80 hover:opacity-100 cursor-pointer rounded-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">{section.id}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionSelect(section.id)}
                  className={`px-6 py-3 rounded-full text-white font-medium 
                    ${selectedZone === 'A' ? 'bg-brand-green' : selectedZone === 'B' ? 'bg-brand-yellow' : 'bg-brand-blue'} 
                    hover:bg-opacity-90 hover:shadow-lg active:scale-95 transition-all`}
                >
                  Section {section.id}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Seat Selection */}
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
              <div className="py-6 px-12 bg-brand-red text-white font-bold uppercase text-2xl inline-block mx-auto">
                STAGE
              </div>
              <div className="w-full h-0.5 bg-red-600 mt-2 rounded-full" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-10"
            >
              {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center justify-center mb-4">
                  <div className="text-white font-bold mr-4">{row}</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {rowSeats.map((seat) => (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        className={`seat w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          seat.status === 'available'
                            ? selectedZone === 'A'
                              ? 'bg-brand-green'
                              : selectedZone === 'B'
                              ? 'bg-brand-yellow'
                              : 'bg-brand-blue'
                            : seat.status === 'selected'
                            ? 'seat-selected'
                            : 'seat-unavailable'
                        }`}
                      >
                        {seat.status === 'selected' ? (
                          <Check size={18} className="text-brand-pink" />
                        ) : seat.status === 'unavailable' ? (
                          <X size={18} className="text-white" />
                        ) : (
                          seat.number
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 border border-red-600 rounded-lg flex justify-between items-center mb-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center text-white font-bold">
                  <Check size={18} className="text-white" />
                </div>
                <span className="text-white font-medium">Selected seat</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center">
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
                className={`px-8 py-3 rounded-full text-white font-medium ${
                  state.selectedSeats.length > 0
                    ? 'bg-brand-pink hover:bg-opacity-90 hover:shadow-lg active:scale-95'
                    : 'bg-gray-400 cursor-not-allowed'
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
