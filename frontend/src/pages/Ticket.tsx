import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import client from '@/lib/graphqlClient';
import { GET_TICKETS_BY_USER } from '@/graphql/queries/booking';
import { Ticket } from '@/types';

const TicketPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const userId = state.auth.user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', userId],
    queryFn: async () => {
      const res = await client.request<{ getTicketsByUser: Ticket[] }>(
        GET_TICKETS_BY_USER,
        { userId }
      );
      return res.getTicketsByUser;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  if (isLoading) {
    return <div className="text-white text-center pt-24">Loading tickets...</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">YOUR TICKET</h1>

        <div className="grid gap-10">
          {data?.map((ticket) => (
            <div key={ticket.ticketId} className="max-w-3xl mx-auto">
              <div className="ticket-container relative overflow-hidden rounded-xl shadow-2xl">
                <div className="flex bg-black text-white">
                  {/* Left content */}
                  <div className="flex-1 p-4">
                    <img
                      src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                      alt="Concert"
                      className="w-full h-48 object-cover mb-4"
                    />
                    <div className="py-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
                      <h2 className="text-xl font-bold text-center">{ticket.concertName}</h2>
                    </div>
                  </div>

                  {/* Right content */}
                  <div className="bg-black w-36 border-l border-dashed border-gray-600 p-2 flex flex-col justify-between">
                    <div className="px-2">
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
                        <div className="font-bold text-sm">{ticket.showDate}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400">TICKET ID:</div>
                      <div className="text-xs">{ticket.ticketCode}</div>
                      <div className="mt-2 border-t border-gray-600 pt-2">
                        <div className="rotate-90 transform origin-top-left absolute bottom-0 right-2 text-xs tracking-widest">
                          {Array.from(ticket.ticketCode || '0000000000').map((char, i) => (
                            <span key={i} className="inline-block mx-0.5">{char}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-red-700 text-white rounded-lg font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
