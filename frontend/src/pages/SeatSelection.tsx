import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useApp } from "@/context/AppContext"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import client from "@/lib/graphqlClient"
import { GET_ZONES_BY_CONCERT } from "@/graphql/queries"
import type { Seat, Zone } from "@/types"

const SeatSelection: React.FC = () => {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const concertId = Number(id)

  const { data: zones, isLoading: loadingZones } = useQuery({
    queryKey: ['zones', concertId],
    queryFn: async () => {
      const res = await client.request<{ getZonesByConcert: Zone[] }>(GET_ZONES_BY_CONCERT, { concertId });
      return res.getZonesByConcert;

    },
    enabled: !!concertId,
  })

  const handleZoneClick = (zone: Zone) => {
    dispatch({ type: 'SELECT_CONCERT', payload: state.selectedConcert }); // ไม่ต้องเพิ่ม selectedZone
    navigate(`/concert/${concertId}/seats?zone=${zone.zoneName}`);
  }

  if (loadingZones) {
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

  return (
    <div className="pt-24 pb-16 bg-brand-black min-h-screen">
      <div className="container mx-auto px-4">
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

            <div className="grid grid-cols-3 gap-4 justify-items-center">
              {zones?.map((zone) => (
                <button
                  key={zone.zoneId}
                  onClick={() => handleZoneClick(zone)}
                  className={`w-24 h-16 flex items-center justify-center text-white font-bold text-lg rounded-lg shadow-md transition-all ${
                    zone.price === 3000 ? 'bg-green-500' :
                    zone.price === 1500 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                >
                  {zone.zoneName}
                </button>
              ))}
            </div>

            {/* Price Legend */}
            <div className="absolute top-0 right-0 border border-red-600 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-green-500" />
                  <span className="text-white font-bold">3,000 BATH</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-yellow-500" />
                  <span className="text-white font-bold">1,500 BATH</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500" />
                  <span className="text-white font-bold">1,000 BATH</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SeatSelection
