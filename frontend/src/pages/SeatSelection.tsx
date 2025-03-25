import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import type { Seat } from "@/types"
import { generateSeatData } from "@/utils/animations"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

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
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [step, setStep] = useState<"zone" | "section" | "seats">("zone")

  useEffect(() => {
    if (!state.selectedConcert) {
      navigate("/")
      return
    }
    const timer = setTimeout(() => {
      const generatedSeats = generateSeatData()
      setSeats(generatedSeats)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [state.selectedConcert, navigate])

  const filteredSeats = seats.filter((seat) => {
    if (!selectedZone || !selectedSection) return false
    const zone = selectedZone.charAt(0)
    if (zone === "A") return seat.price === 3000 && seat.section === selectedSection
    if (zone === "B") return seat.price === 1500 && seat.section === selectedSection
    if (zone === "C") return seat.price === 1000 && seat.section === selectedSection
    return false
  })

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "unavailable") return
    if (seat.status === "available") {
      const updatedSeat: Seat = { ...seat, status: "selected" }
      setSeats(seats.map((s) => (s.id === seat.id ? updatedSeat : s)))
      dispatch({ type: "ADD_SEAT", payload: updatedSeat })
    } else {
      const updatedSeat: Seat = { ...seat, status: "available" }
      setSeats(seats.map((s) => (s.id === seat.id ? updatedSeat : s)))
      dispatch({ type: "REMOVE_SEAT", payload: seat.id })
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto"></div>
          <div className="h-64 w-80 bg-gray-200 rounded mx-auto"></div>
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  const seatsByRow = filteredSeats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = []
      }
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  const filteredSections = sectionData.filter((section) => selectedZone === null || section.zone === selectedZone)

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
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Your Zone</h2>

            <div className="relative w-full max-w-3xl mx-auto mb-8">
              {/* Stage */}
              <div className="mb-8">
                <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 mx-auto text-center">
                  STAGE
                </div>
              </div>

              <div className="venue-container">
                {/* Zone A - Green Zone */}
                <div className="venue-row">
                  <div
                    onClick={() => handleZoneSelect("A")}
                    className="venue-section venue-section-left venue-section-a"
                  >
                    <span className="text-white font-bold text-2xl">A1</span>
                  </div>
                  <div
                    onClick={() => handleZoneSelect("A")}
                    className="venue-section venue-section-center venue-section-a"
                  >
                    <span className="text-white font-bold text-2xl">A2</span>
                  </div>
                  <div
                    onClick={() => handleZoneSelect("A")}
                    className="venue-section venue-section-right venue-section-a"
                  >
                    <span className="text-white font-bold text-2xl">A3</span>
                  </div>
                </div>

                {/* Zone B - Yellow Zone */}
                <div className="venue-row">
                  <div
                    onClick={() => handleZoneSelect("B")}
                    className="venue-section venue-section-left venue-section-b"
                  >
                    <span className="text-white font-bold text-2xl">B1</span>
                  </div>
                  <div
                    onClick={() => handleZoneSelect("B")}
                    className="venue-section venue-section-center venue-section-b"
                  >
                    <span className="text-white font-bold text-2xl">B2</span>
                  </div>
                  <div
                    onClick={() => handleZoneSelect("B")}
                    className="venue-section venue-section-right venue-section-b"
                  >
                    <span className="text-white font-bold text-2xl">B3</span>
                  </div>
                </div>

                {/* Zone C - Blue Zone */}
                <div className="venue-row">
                  <div
                    onClick={() => handleZoneSelect("C")}
                    className="venue-section venue-section-left venue-section-c"
                  >
                    <span className="text-white font-bold text-2xl">C1</span>
                  </div>
                  <div
                    onClick={() => handleZoneSelect("C")}
                    className="venue-section venue-section-center venue-section-c"
                  >
                    <span className="text-white font-bold text-2xl">C2</span>
                  </div>
                  <div
                    onClick={() => handleZoneSelect("C")}
                    className="venue-section venue-section-right venue-section-c"
                  >
                    <span className="text-white font-bold text-2xl">C3</span>
                  </div>
                </div>
              </div>

              {/* Price Legend */}
              <div className="absolute top-0 right-0 border border-red-600 rounded-lg p-4">
                <div className="space-y-4">
                  {zoneData.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full ${zone.color}`} />
                      <span className="text-white font-bold">{zone.price.toLocaleString()} BATH</span>
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
              <button onClick={handleBackToZones} className="mr-4 text-white hover:text-brand-pink transition-colors">
                &larr; Back to Zones
              </button>
              <h2 className="text-2xl font-bold text-white">
                Select Section in Zone {selectedZone} (
                {zoneData.find((z) => z.id === selectedZone)?.price.toLocaleString()} BATH)
              </h2>
            </div>

            <div className="relative w-full max-w-3xl mx-auto mb-8">
              {/* Stage */}
              <div className="mb-8">
                <div className="bg-red-500 text-white font-bold uppercase text-xl py-4 w-64 mx-auto text-center">
                  STAGE
                </div>
              </div>

              <div className="venue-container">
                {/* Zone A - Green Zone */}
                <div className="venue-row">
                  <div
                    onClick={() => selectedZone === "A" && handleSectionSelect("A1")}
                    className={`venue-section venue-section-left ${selectedZone === "A" ? "venue-section-a" : "venue-section-a-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">A1</span>
                  </div>
                  <div
                    onClick={() => selectedZone === "A" && handleSectionSelect("A2")}
                    className={`venue-section venue-section-center ${selectedZone === "A" ? "venue-section-a" : "venue-section-a-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">A2</span>
                  </div>
                  <div
                    onClick={() => selectedZone === "A" && handleSectionSelect("A3")}
                    className={`venue-section venue-section-right ${selectedZone === "A" ? "venue-section-a" : "venue-section-a-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">A3</span>
                  </div>
                </div>

                {/* Zone B - Yellow Zone */}
                <div className="venue-row">
                  <div
                    onClick={() => selectedZone === "B" && handleSectionSelect("B1")}
                    className={`venue-section venue-section-left ${selectedZone === "B" ? "venue-section-b" : "venue-section-b-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">B1</span>
                  </div>
                  <div
                    onClick={() => selectedZone === "B" && handleSectionSelect("B2")}
                    className={`venue-section venue-section-center ${selectedZone === "B" ? "venue-section-b" : "venue-section-b-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">B2</span>
                  </div>
                  <div
                    onClick={() => selectedZone === "B" && handleSectionSelect("B3")}
                    className={`venue-section venue-section-right ${selectedZone === "B" ? "venue-section-b" : "venue-section-b-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">B3</span>
                  </div>
                </div>

                {/* Zone C - Blue Zone */}
                <div className="venue-row">
                  <div
                    onClick={() => selectedZone === "C" && handleSectionSelect("C1")}
                    className={`venue-section venue-section-left ${selectedZone === "C" ? "venue-section-c" : "venue-section-c-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">C1</span>
                  </div>
                  <div
                    onClick={() => selectedZone === "C" && handleSectionSelect("C2")}
                    className={`venue-section venue-section-center ${selectedZone === "C" ? "venue-section-c" : "venue-section-c-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">C2</span>
                  </div>
                  <div
                    onClick={() => selectedZone === "C" && handleSectionSelect("C3")}
                    className={`venue-section venue-section-right ${selectedZone === "C" ? "venue-section-c" : "venue-section-c-disabled"}`}
                  >
                    <span className="text-white font-bold text-2xl">C3</span>
                  </div>
                </div>
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
              <h2 className="text-2xl font-bold text-white">Select Seats in Section {selectedSection}</h2>
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
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`seat w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer
                            ${
                              seat.status === "available"
                                ? selectedZone === "A"
                                  ? "bg-green-500"
                                  : selectedZone === "B"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                : seat.status === "selected"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                            }`}
                        >
                          {seat.status === "selected" ? (
                            <Check size={18} className="text-white" />
                          ) : seat.status === "unavailable" ? (
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
              className="p-6 border border-red-600 rounded-lg flex justify-between items-center mb-8"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  <Check size={18} className="text-white" />
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
                className={`px-8 py-3 rounded-full text-white font-medium ${
                  state.selectedSeats.length > 0
                    ? "bg-brand-pink hover:bg-opacity-90 hover:shadow-lg active:scale-95"
                    : "bg-gray-400 cursor-not-allowed"
                } transition-all`}
              >
                {state.selectedSeats.length > 0 ? "Proceed to Payment" : "Please select at least one seat"}
              </button>
            </motion.div>

            {/* แสดงรายละเอียดของที่เลือก */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="p-6 border border-gray-600 rounded-lg bg-gray-900 text-white mb-8"
            >
            <h3 className="text-lg font-bold mb-4">Selected Details</h3>
  
            <p><strong>Zone:</strong> {selectedZone}</p>
            <p><strong>Section:</strong> {selectedSection}</p>
  
            <p className="mt-2"><strong>Seats:</strong>  
            {state.selectedSeats.length > 0
              ? state.selectedSeats.map(seat => ` ${seat.number}`).join(", ")
            : " No seats selected"}
            </p>

  <p className="mt-2 font-bold text-green-400">
    Total Price: {state.selectedSeats.reduce((total, seat) => total + seat.price, 0).toLocaleString()} BATH
  </p>
</motion.div>

          </>
        )}
      </div>
    </div>
  )
}

export default SeatSelection

