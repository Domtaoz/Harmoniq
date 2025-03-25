import React from 'react';
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

  // คำนวณราคารวม
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // สร้างข้อมูลสำหรับ QR Code
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

  // ฟังก์ชันเมื่อการชำระเงินสำเร็จ
  const handlePaySuccess = async () => {
    try {
      // เรียก mutation เพื่อยืนยันการชำระเงินและสร้างตั๋ว
      await client.request(CONFIRM_PAYMENT_AND_GENERATE_TICKETS, { bookingId: state.bookingId });
      // นำทางไปยังหน้าตั๋ว
      navigate('/ticket');
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  // ฟังก์ชันเมื่อยกเลิกการชำระเงิน
  const handleBackToCheckout = async () => {
    try {
      // เรียก mutation เพื่ออัปเดตสถานะการจองเป็น 'cancelled'
      await client.request(UPDATE_BOOKING_STATUS, { bookingId: state.bookingId, newStatus: 'cancelled' });
      // นำทางกลับไปยังหน้าก่อนหน้า
      navigate(-1);
    } catch (error) {
      console.error('Cancel booking error:', error);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-brand-black min-h-screen">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-6">Confirm Your Payment</h2>

        {/* แสดง QR Code สำหรับการชำระเงิน */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-4 rounded-lg">
            <QRCode value={JSON.stringify(qrData)} size={200} />
          </div>
        </div>

        {/* แสดงรายละเอียดการจอง */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b border-gray-700 py-2">Seat</th>
                <th className="border-b border-gray-700 py-2">Zone</th>
                <th className="border-b border-gray-700 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedSeats.map((seat, index) => (
                <tr key={index}>
                  <td className="border-b border-gray-800 py-2">{seat.seatNumber}</td>
                  <td className="border-b border-gray-800 py-2">{seat.zoneName}</td>
                  <td className="border-b border-gray-800 py-2">{seat.price.toLocaleString()} BATH</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="text-right font-bold py-2">Total:</td>
                <td className="font-bold py-2">{totalPrice.toLocaleString()} BATH</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ปุ่มสำหรับยืนยันหรือยกเลิกการชำระเงิน */}
        <div className="space-x-4">
          <button
            onClick={handlePaySuccess}
            className="bg-green-600 px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Pay Success
          </button>
          <button
            onClick={handleBackToCheckout}
            className="bg-red-600 px-6 py-3 rounded-full hover:bg-red-700 transition"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

