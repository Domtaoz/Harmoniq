import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/context/AppContext';
import client from '@/lib/graphqlClient';
import { GET_TICKETS_BY_USER } from '@/graphql/queries/booking';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';
import type { Ticket } from '@/types';

const TicketPage: React.FC = () => {
  const { state } = useApp();
  const userId = state.auth.user?.id;
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['tickets', userId],
    queryFn: async () => {
      const res = await client.request<{ getTicketsByUser: Ticket[] }>(GET_TICKETS_BY_USER, { userId });
      return res.getTicketsByUser;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) navigate('/');
  }, [userId, navigate]);

  const handleDownload = async (ticketId: number) => {
    const node = document.getElementById(`ticket-${ticketId}`);
    if (node) {
      const dataUrl = await htmlToImage.toPng(node);
      const link = document.createElement('a');
      link.download = `ticket-${ticketId}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white text-black">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-yellow-500">YOUR TICKET</h1>
        <div className="grid gap-10">
          {data?.map((ticket) => (
            <div key={ticket.ticketId} className="max-w-3xl mx-auto">
              <div
                id={`ticket-${ticket.ticketId}`}
                className="ticket-container relative overflow-hidden rounded-xl shadow-2xl bg-black text-white"
              >
                <div className="flex">
                  {/* Left Content */}
                  <div className="flex-1 p-4">
                    <img
                      src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                      alt="Concert"
                      className="w-full h-48 object-cover mb-4 rounded-md"
                    />
                    <div className="py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
                      <h2 className="text-xl font-bold text-center">{ticket.concertName}</h2>
                    </div>
                    <div className="flex justify-center">
                      <QRCode value={ticket.ticketCode} size={80} bgColor="#ffffff" fgColor="#000000" />
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="bg-black w-48 border-l border-dashed border-gray-600 p-4 flex flex-col justify-between">
                    <div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400">SEAT</div>
                        <div className="font-bold text-xl">{ticket.zoneName}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400">ROW</div>
                        <div className="font-bold text-xl">{ticket.seatNumber}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400">DATE</div>
                        <div className="font-bold text-sm">18 APR 2013</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400">TICKET ID:</div>
                      <div className="text-xs">{ticket.ticketCode}</div>
                      <div className="mt-2 border-t border-gray-600 pt-2">
                        <div className="rotate-90 transform origin-top-left absolute bottom-0 right-2 text-xs tracking-widest">
                          {ticket.ticketCode.split('').map((char, i) => (
                            <span key={i} className="inline-block mx-0.5">
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handleDownload(ticket.ticketId)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Download Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
