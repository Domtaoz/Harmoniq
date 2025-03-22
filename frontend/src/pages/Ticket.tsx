
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TicketViewComponent from '@/components/ticket/TicketView';
import { useApp } from '@/context/AppContext';

const Ticket: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  if (state.tickets.length === 0) {
    navigate('/');
    return null;
  }

  // Show the most recently added ticket
  const latestTicket = state.tickets[state.tickets.length - 1];

  return <TicketViewComponent ticket={latestTicket} />;
};

export default Ticket;
