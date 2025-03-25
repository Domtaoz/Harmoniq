import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import type { Seat } from "@/types";
import { useQuery } from "@tanstack/react-query";
import client from "@/lib/graphqlClient";
import { GET_SEATS_BY_CONCERT_ZONE } from "@/graphql/queries";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const SeatSelection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const concertId = Number(id);
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [step, setStep] = useState<"zone" | "section" | "seats">("zone");

  const zoneData = [
    { id: "A", name: "Zone A", price: 3000, color: "bg-green-500" },
    { id: "B", name: "Zone B", price: 1500, color: "bg-yellow-500" },
    { id: "C", name: "Zone C", price: 1000, color: "bg-blue-500" },
  ];

  const sectionData = [
    "A1", "A2", "A3",
    "B1", "B2", "B3",
    "C1", "C2", "C3"
  ];

  const { data: seats = [], isLoading } = useQuery({
    queryKey: ["seats", concertId, selectedSection],
    queryFn: async () => {
      if (!selectedSection || !concertId) return [];
      const res = await client.request<{ getSeatsByConcertZone: Seat[] }>(
        GET_SEATS_BY_CONCERT_ZONE,
        { concertId, zoneName: selectedSection }
      );
      return res.getSeatsByConcertZone;
    },
    enabled: !!concertId && !!selectedSection,
  });

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setStep("section");
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    setStep("seats");
  };

  const handleBackToZones = () => {
    setSelectedZone(null);
    setSelectedSection(null);
    setStep("zone");
    dispatch({ type: "CLEAR_SEATS" });
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setStep("section");
    dispatch({ type: "CLEAR_SEATS" });
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.seatStatus === "SeatStatus.booked") return;
    const isSelected = state.selectedSeats.some((s) => s.seatId === seat.seatId);
    if (isSelected) {
      dispatch({ type: "REMOVE_SEAT", payload: seat.seatId.toString() });
    } else {
      dispatch({ type: "ADD_SEAT", payload: seat });
    }
  };

  const handleSubmit = () => {
    navigate("/payment");
  };

  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const totalPrice = state.selectedSeats.reduce((sum, s) => {
    const zone = zoneData.find((z) => s.seatNumber?.startsWith(z.id));
    return sum + (zone?.price || 0);
  }, 0);

  return (
    <div className="pt-24 pb-16 bg-brand-black min-h-screen">
      <div className="container mx-auto px-4">
        {step === "zone" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Your Zone</h2>

            <div className="mb-8 flex justify-center">
              <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 text-center">STAGE</div>
            </div>

            <div className="space-y-6">
              {["A", "B", "C"].map((zoneLetter) => (
                <div key={zoneLetter} className="flex justify-center gap-6">
                  {sectionData
                    .filter((sec) => sec.startsWith(zoneLetter))
                    .map((section) => (
                      <div
                        key={section}
                        onClick={() => handleZoneSelect(zoneLetter)}
                        className={`cursor-pointer w-28 h-16 rounded-lg flex items-center justify-center text-white font-bold
                          ${
                            zoneLetter === "A"
                              ? "bg-green-500"
                              : zoneLetter === "B"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                      >
                        {section}
                      </div>
                    ))}
                </div>
              ))}
            </div>

            <div className="mt-8 border border-red-600 p-4 rounded-lg w-fit mx-auto space-y-2">
              {zoneData.map((zone) => (
                <div key={zone.id} className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full ${zone.color}`} />
                  <span className="text-white font-bold">{zone.price.toLocaleString()} BATH</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "section" && selectedZone && (
          <div>
            <button onClick={handleBackToZones} className="text-white mb-4">
              &larr; Back to Zones
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              Select Section in Zone {selectedZone}
            </h2>

            <div className="flex justify-center gap-6 flex-wrap">
              {sectionData
                .filter((s) => s.startsWith(selectedZone))
                .map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionSelect(section)}
                    className="bg-brand-pink text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600"
                  >
                    {section}
                  </button>
                ))}
            </div>
          </div>
        )}

        {step === "seats" && selectedSection && (
          <div className="mt-10">
            <button onClick={handleBackToSections} className="text-white mb-4">
              &larr; Back to Sections
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Select Seats in Section {selectedSection}
            </h2>

            <div className="mb-6 flex justify-center">
              <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 text-center">STAGE</div>
            </div>

            {isLoading ? (
              <div className="text-white text-center">Loading seats...</div>
            ) : (
              <div className="text-center">
                {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center mb-4">
                    <div className="text-white font-bold mr-4">{row}</div>
                    <div className="flex gap-2">
                      {rowSeats.map((seat) => {
                        const isSelected = state.selectedSeats.some((s) => s.seatId === seat.seatId);
                        const isBooked = seat.seatStatus === "SeatStatus.booked";
                        return (
                          <div
                            key={seat.seatId}
                            onClick={() => !isBooked && handleSeatClick(seat)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer
                              ${
                                isBooked
                                  ? "bg-red-500 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-green-500"
                                  : "bg-gray-600 hover:bg-green-400"
                              }`}
                          >
                            {isBooked ? <X size={18} className="text-white" /> : seat.seatNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-10 mt-10 border border-red-600 p-4 rounded-lg w-fit mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={18} className="text-white" />
                </div>
                <span className="text-white font-medium">Selected seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <X size={18} className="text-white" />
                </div>
                <span className="text-white font-medium">Unavailable seat</span>
              </div>
            </div>

            <div className="text-center text-white mt-6 text-xl">
              Total Price: <span className="font-bold">{totalPrice.toLocaleString()} BATH</span>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={state.selectedSeats.length === 0}
                className={`px-8 py-3 rounded-full text-white font-medium ${
                  state.selectedSeats.length > 0
                    ? "bg-brand-pink hover:bg-opacity-90 hover:shadow-lg active:scale-95"
                    : "bg-gray-400 cursor-not-allowed"
                } transition-all`}
              >
                {state.selectedSeats.length > 0
                  ? "Proceed to Payment"
                  : "Please select at least one seat"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
