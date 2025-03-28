import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/context/AppContext';
import client from '@/lib/graphqlClient';
import { GET_TICKETS_BY_USER } from '@/graphql/queries/booking';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Ticket as TicketType } from '@/types';

const Ticket: React.FC = () => {
  const { state } = useApp();
  const userId = state.auth.user?.id;

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets', userId],
    queryFn: async () => {
      const res = await client.request<{ getTicketsByUser: TicketType[] }>(
        GET_TICKETS_BY_USER,
        { userId }
      );
      return res.getTicketsByUser;
    },
    enabled: !!userId,
  });

  const handleDownload = async (ticketId: string) => {
    const element = document.getElementById(`ticket-${ticketId}`);
    if (!element) return;
    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = `ticket-${ticketId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };





  return (
    <div className="pt-24 pb-16 bg-white min-h-screen px-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-10">YOUR TICKET</h1>

      <div className="grid gap-10">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticketId}
            id={`ticket-${ticket.ticketId}`}
            className="flex flex-row bg-black text-white rounded-xl shadow-2xl overflow-hidden w-full max-w-6xl mx-auto"
          >
            {/* Left: Image & Concert Info */}
            <div className="flex-1 p-4">
              <img
                src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="Concert"
                className="w-full h-56 object-cover mb-4 rounded-lg"
              />
              <div className="bg-white/10 backdrop-blur-sm rounded-lg py-2 text-center mb-4">
                <h2 className="text-xl font-bold">{ticket.concertName}</h2>
              </div>
              <div className="mt-6 px-6">
                <div className="text-xs text-gray-400">ZONE</div>
                <div className="text-xl font-bold mb-3">{ticket.zoneName}</div>

                <div className="text-xs text-gray-400">SEAT</div>
                <div className="text-xl font-bold mb-3">{ticket.seatNumber}</div>

                <div className="text-xs text-gray-400">DATE</div>
                <div className="text-sm font-bold">18 APR 2013</div>
              </div>
            </div>

            {/* Right: QR + Ticket ID + Download */}
            <div className="w-72 border-l border-dashed border-gray-600 p-4 flex flex-col items-center justify-between">
              <QRCode
                value={JSON.stringify({
                concertName: ticket.concertName,
                zoneName: ticket.zoneName,
                seatNumber: ticket.seatNumber,
                ticketId: ticket.ticketId,
              })}
              size={140}
              bgColor="#fff"
              />

              <button
                onClick={() => handleDownload(ticket.ticketId.toString())}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-700 transition"
              >
                Download Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticket;
