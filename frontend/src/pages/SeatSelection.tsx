import type React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import type { Seat, Zone } from "@/types"
import { useQuery } from "@tanstack/react-query"
import client from "@/lib/graphqlClient"
import { GET_SEATS_BY_CONCERT_ZONE, GET_ZONES_BY_CONCERT } from "@/graphql/queries"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { CREATE_BOOKING } from "@/graphql/mutations/booking";


const SeatSelection: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const concertId = Number(id)
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  // Fetch zones (for price & zoneName)
  const { data: zones = [] } = useQuery({
    queryKey: ["zones", concertId],
    queryFn: async () => {
      const res = await client.request<{ getZonesByConcert: Zone[] }>(
        GET_ZONES_BY_CONCERT,
        { concertId }
      )
      return res.getZonesByConcert
    },
    enabled: !!concertId,
  })

  // Fetch seats by section
  const { data: seats = [], isLoading } = useQuery({
    queryKey: ["seats", concertId, selectedSection],
    queryFn: async () => {
      if (!selectedSection || !concertId) return []
      const res = await client.request<{ getSeatsByConcertZone: Seat[] }>(
        GET_SEATS_BY_CONCERT_ZONE,
        { concertId, zoneName: selectedSection }
      )
      return res.getSeatsByConcertZone
    },
    enabled: !!concertId && !!selectedSection,
  })

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section)
    dispatch({ type: "CLEAR_SEATS" })
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.seatStatus === "SeatStatus.booked") return;
  
    const isSelected = state.selectedSeats.some((s) => s.seatId === seat.seatId);
  
    if (isSelected) {

      dispatch({ type: 'REMOVE_SEAT', payload: seat.seatId.toString() })

    } else {
      const zone = zones.find((z) => z.zoneName === seat.zoneName);
      const price = zone?.price ?? 0;
      dispatch({ type: "ADD_SEAT", payload: { ...seat, price } as any });
    }
  };
  

  const handleSubmit = async () => {
    const seatIds = state.selectedSeats.map((s) => s.seatId);
    const concertId = state.selectedSeats[0]?.concertId;
    const zoneName = state.selectedSeats[0]?.zoneName;
    const seatCount = seatIds.length;
    const userId = state.auth.user?.id;
  
    const zone = zones.find((z) => z.zoneName === zoneName);
    const zoneId = zone?.zoneId;
  
    try {
      const res: { createBooking: { bookingId: number } } = await client.request(CREATE_BOOKING, {
        userId,
        concertId,
        zoneId,
        seatCount,
        seatIds,
      });
  
      const bookingId = res.createBooking.bookingId;
      dispatch({ type: "SET_BOOKING_ID", payload: bookingId.toString() });
      navigate("/payment");
    } catch (error) {
      console.error("Booking error:", error);
    }
  };
  
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.seatNumber?.charAt(0) ?? ""
    if (!acc[row]) acc[row] = []
    acc[row].push(seat)
    return acc
  }, {} as Record<string, Seat[]>)

  const totalPrice = state.selectedSeats.reduce((sum, s) => sum + (s as any).price, 0)

  return (
    <div className="pt-24 pb-16 bg-brand-black min-h-screen">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          Select Seats {selectedSection && `in Section ${selectedSection}`}
        </h2>

        {!selectedSection ? (
          <>
            <div className="mb-8 flex justify-center">
              <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 text-center">STAGE</div>
            </div>

            {["A", "B", "C"].map((zoneLetter) => (
              <div key={zoneLetter} className="flex justify-center gap-6 mb-4">
                {zones
                  .filter((z) => z.zoneName.startsWith(zoneLetter))
                  .map((zone) => (
                    <div
                      key={zone.zoneName}
                      onClick={() => handleSectionSelect(zone.zoneName)}
                      className="cursor-pointer w-20 h-16 rounded-lg bg-gray-600 text-white font-bold flex items-center justify-center"
                    >
                      {zone.zoneName}
                    </div>
                  ))}
              </div>
            ))}

            <div className="mt-8 border border-red-600 p-4 rounded-lg w-fit mx-auto space-y-2">
              {zones.map((zone) => (
                <div key={zone.zoneName} className="flex items-center gap-4 text-white">
                  <div className="w-5 h-5 rounded-full bg-white" />
                  <span className="font-bold">
                    {zone.zoneName} - {zone.price.toLocaleString()} BATH
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedSection(null)}
              className="text-white mb-4 block text-left"
            >
              &larr; Back to Sections
            </button>

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
                        const isSelected = state.selectedSeats.some((s) => s.seatId === seat.seatId)
                        const isBooked = seat.seatStatus === "SeatStatus.booked"
                        return (
                          <div
                            key={seat.seatId}
                            onClick={() => handleSeatClick(seat)}
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
                        )
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
              Selected: <strong>{state.selectedSeats.length}</strong> seat(s) <br />
              Total Price: <strong>{totalPrice.toLocaleString()} BATH</strong>
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
          </>
        )}
      </div>
    </div>
  )
}

export default SeatSelection
