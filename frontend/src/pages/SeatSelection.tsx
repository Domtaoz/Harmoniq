import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import client from "@/lib/graphqlClient"
import { GET_SEATS_BY_CONCERT_ZONE } from "@/graphql/queries"
import type { Seat } from "@/types"
import { useQuery } from "@tanstack/react-query"

const zoneData = [
  { id: "A", name: "Zone A (Green)", price: 3000, color: "bg-green-500" },
  { id: "B", name: "Zone B (Yellow)", price: 1500, color: "bg-yellow-500" },
  { id: "C", name: "Zone C (Blue)", price: 1000, color: "bg-blue-500" },
]

const sectionData = [
  { id: "A1", zone: "A", position: "left" },
  { id: "A2", zone: "A", position: "center" },
  { id: "A3", zone: "A", position: "right" },
  { id: "B1", zone: "B", position: "left" },
  { id: "B2", zone: "B", position: "center" },
  { id: "B3", zone: "B", position: "right" },
  { id: "C1", zone: "C", position: "left" },
  { id: "C2", zone: "C", position: "center" },
  { id: "C3", zone: "C", position: "right" },
]

const SeatSelection: React.FC = () => {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const concertId = Number(id)

  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [step, setStep] = useState<"zone" | "section" | "seats">("zone")

  const { data: seats = [], isLoading } = useQuery({
    queryKey: ["seats", concertId, selectedSection],
    queryFn: async () => {
      if (!concertId || !selectedSection) return []
      const res = await client.request<{ getSeatsByConcertZone: Seat[] }>(
        GET_SEATS_BY_CONCERT_ZONE,
        { concertId, zoneName: selectedSection }
      )
      return res.getSeatsByConcertZone
    },
    enabled: !!concertId && !!selectedSection,
  })

  const handleSeatClick = (seat: Seat) => {
    if (seat.seatStatus === "booked") return

    const isSelected = state.selectedSeats.some((s) => s.seatId === seat.seatId)
    if (isSelected) {
      dispatch({ type: "REMOVE_SEAT", payload: seat.seatId.toString() })
    } else {
      dispatch({ type: "ADD_SEAT", payload: seat })
    }
  }

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone)
    setStep("section")
  }

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section)
    setStep("seats")
  }

  const handleBackToZones = () => {
    setSelectedZone(null)
    setSelectedSection(null)
    setStep("zone")
    dispatch({ type: "CLEAR_SEATS" })
  }

  const handleBackToSections = () => {
    setSelectedSection(null)
    setStep("section")
    dispatch({ type: "CLEAR_SEATS" })
  }

  const handleSubmit = () => {
    navigate("/payment")
  }

  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = []
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>
  )

  const filteredSections = sectionData.filter(
    (section) => selectedZone === null || section.zone === selectedZone
  )

  return (
    <div className="pt-24 pb-16 bg-brand-black min-h-screen">
      <div className="container mx-auto px-4">
        {step === "zone" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Select Your Zone
            </h2>
            <div className="relative w-full max-w-3xl mx-auto mb-8">
              <div className="mb-8">
                <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 mx-auto text-center">
                  STAGE
                </div>
              </div>
              <div className="venue-container">
                {sectionData.map((section) => (
                  section.zone === selectedZone || !selectedZone ? (
                    <div
                      key={section.id}
                      onClick={() => handleZoneSelect(section.zone)}
                      className={`venue-section venue-section-${section.position.toLowerCase()} venue-section-${section.zone.toLowerCase()}`}
                    >
                      <span className="text-white font-bold text-2xl">{section.id}</span>
                    </div>
                  ) : null
                ))}
              </div>
              <div className="absolute top-0 right-0 border border-red-600 rounded-lg p-4">
                <div className="space-y-4">
                  {zoneData.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full ${zone.color}`} />
                      <span className="text-white font-bold">
                        {zone.price.toLocaleString()} BATH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "section" && (
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
                Select Section in Zone {selectedZone} (
                {
                  zoneData.find((z) => z.id === selectedZone)?.price.toLocaleString()
                } BATH)
              </h2>
            </div>
            <div className="relative w-full max-w-3xl mx-auto mb-8">
              <div className="mb-8">
                <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 mx-auto text-center">
                  STAGE
                </div>
              </div>
              <div className="venue-container">
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className={`venue-section venue-section-${section.position.toLowerCase()} venue-section-${section.zone.toLowerCase()}`}
                  >
                    <span className="text-white font-bold text-2xl">{section.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "seats" && (
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
              <div className="py-4 px-16 bg-red-500 text-white font-bold uppercase text-xl inline-block mx-auto">
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
              {Object.keys(seatsByRow).length > 0 ? (
                Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center mb-4">
                    <div className="text-white font-bold mr-4">{row}</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {rowSeats.map((seat) => (
                        <div
                          key={seat.seatId}
                          onClick={() => handleSeatClick(seat)}
                          className={`seat w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer
                            ${seat.seatStatus === "booked"
                              ? "bg-red-500"
                              : state.selectedSeats.some((s) => s.seatId === seat.seatId)
                              ? "bg-green-500"
                              : selectedZone === "A"
                                ? "bg-green-500"
                                : selectedZone === "B"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                        >
                          {state.selectedSeats.some((s) => s.seatId === seat.seatId) ? (
                            <Check size={18} className="text-white" />
                          ) : (
                            <>{seat.seatNumber}</>
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
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex justify-center mt-8"
            >
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
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default SeatSelection
