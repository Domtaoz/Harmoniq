import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import client from '@/lib/graphqlClient';
import QRCode from 'react-qr-code';
import { CONFIRM_PAYMENT_AND_GENERATE_TICKETS, UPDATE_BOOKING_STATUS } from '@/graphql/mutations/booking';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { selectedSeats, auth } = state;
  const userId = auth.user?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const qrData = {
    userId,
    seats: selectedSeats.map(seat => ({
      seatId: seat.seatId,
      concertId: seat.concertId,
      zoneName: seat.zoneName,
      seatNumber: seat.seatNumber,
      price: seat.price,
    })),
    totalPrice,
  };

  const handlePaySuccess = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Loading spinner
      await client.request(CONFIRM_PAYMENT_AND_GENERATE_TICKETS, {
        bookingId: parseInt(state.bookingId),
      });

      setIsLoading(false);
      setIsSuccess(true); // Show success animation

      await new Promise(resolve => setTimeout(resolve, 1200)); // Wait before navigating
      navigate('/ticket');
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
    }
  };

  const handleBackToCheckout = async () => {
    try {
      await client.request(UPDATE_BOOKING_STATUS, {
        bookingId: parseInt(state.bookingId),
        newStatus: 'cancelled',
      });
      navigate(-1);
    } catch (error) {
      console.error('Cancel booking error:', error);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-brand-black min-h-screen text-white relative">
      {/* 🔄 Overlay Loader or Success */}
      {(isLoading || isSuccess) && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          {isLoading && (
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSuccess && (
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-green-400 animate-scaleCheck" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="mt-2 text-lg text-green-300 font-semibold">Payment Successful</p>
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">Confirm Your Payment</h2>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Left: Ticket Details */}
          <div className="bg-white rounded-lg shadow-md p-6 w-full lg:w-[420px] text-black">
            <h3 className="text-xl font-bold text-red-600 mb-4">Ticket Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Seat</span><span>{selectedSeats.map(seat => seat.seatNumber).join(', ')}</span></div>
              <div className="flex justify-between"><span>Zone</span><span>{selectedSeats[0]?.zoneName}</span></div>
              <div className="flex justify-between"><span>Ticket Price per Seat</span><span>{selectedSeats[0]?.price.toLocaleString()} THB</span></div>
              <div className="flex justify-between"><span>Quantity</span><span>{selectedSeats.length}</span></div>
              <div className="flex justify-between font-bold mt-2"><span>Total Amount</span><span>{totalPrice.toLocaleString()} THB</span></div>
            </div>
          </div>

          {/* Right: QR Code & Payment */}
          <div className="bg-white rounded-lg shadow-md p-6 w-full lg:w-[500px] text-black text-center">
            <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border w-fit">
                <QRCode value={JSON.stringify(qrData)} size={200} />
              </div>
            </div>

            <h4 className="text-pink-500 font-bold text-lg mt-4">Concert Tickets</h4>
            <p className="font-bold text-xl mb-4">{totalPrice.toLocaleString()} THB</p>

            <div className="text-left text-sm text-gray-700">
              <p className="font-bold text-pink-500 mb-2">How to pay with QR Code</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Open your Mobile Banking app or any QR Code scanner</li>
                <li>Tap "Scan QR Code"</li>
                <li>Point your camera at the QR Code</li>
                <li>Review the details before proceeding</li>
                <li>Confirm the transaction</li>
              </ol>
            </div>

            <div className="flex justify-between mt-6 gap-4">
              <button
                onClick={handleBackToCheckout}
                disabled={isLoading || isSuccess}
                className="bg-gray-200 text-black py-2 px-4 rounded-full w-full"
              >
                Back to Checkout
              </button>
              <button
                onClick={handlePaySuccess}
                disabled={isLoading || isSuccess}
                className={`bg-green-600 text-white py-2 px-4 rounded-full w-full transition-all ${
                  (isLoading || isSuccess) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processing...' : 'Pay Success'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Add this style animation in global CSS or Tailwind config */}
      <style>
        {`
          @keyframes scaleCheck {
            0% { transform: scale(0.5); opacity: 0 }
            50% { transform: scale(1.2); opacity: 1 }
            100% { transform: scale(1); opacity: 1 }
          }
          .animate-scaleCheck {
            animation: scaleCheck 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default PaymentPage;
