
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Building } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const PaymentOptions: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<string>('qr');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state.selectedConcert || state.selectedSeats.length === 0) {
    navigate('/');
    return null;
  }

  const totalAmount = state.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Create ticket
      const ticket = {
        id: uuidv4(),
        concertId: state.selectedConcert!.id,
        concertName: state.selectedConcert!.name,
        date: state.selectedConcert!.date,
        seat: {
          row: state.selectedSeats[0].row,
          number: state.selectedSeats[0].number
        },
        price: totalAmount,
        qrCode: 'data:image/png;base64,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'
      };
      
      dispatch({ type: 'ADD_TICKET', payload: ticket });
      dispatch({ type: 'CLEAR_SEATS' });
      
      setIsProcessing(false);
      navigate('/ticket');
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.h1 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold mb-8 text-center"
        >
          Payment Channel
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div 
                onClick={() => setSelectedPayment('qr')}
                className={`p-4 flex flex-col items-center cursor-pointer transition-all ${
                  selectedPayment === 'qr' 
                    ? 'bg-brand-pink/10 border-2 border-brand-pink rounded-lg' 
                    : 'bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md'
                }`}
              >
                <div className="p-3 bg-gray-100 dark:bg-black/30 rounded-lg mb-2">
                  <QrCode className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-center">Scan QR</p>
              </div>

              <div 
                onClick={() => setSelectedPayment('bank')}
                className={`p-4 flex flex-col items-center cursor-pointer transition-all ${
                  selectedPayment === 'bank' 
                    ? 'bg-brand-pink/10 border-2 border-brand-pink rounded-lg' 
                    : 'bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md'
                }`}
              >
                <div className="p-3 bg-gray-100 dark:bg-black/30 rounded-lg mb-2">
                  <Building className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-center">Bank Transfer</p>
              </div>

              <div 
                onClick={() => setSelectedPayment('card')}
                className={`p-4 flex flex-col items-center cursor-pointer transition-all ${
                  selectedPayment === 'card' 
                    ? 'bg-brand-pink/10 border-2 border-brand-pink rounded-lg' 
                    : 'bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md'
                }`}
              >
                <div className="p-3 bg-gray-100 dark:bg-black/30 rounded-lg mb-2">
                  <CreditCard className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-center">True Money Wallet</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4 text-red-700">Ticket Details</h2>
              <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-700">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Seat</span>
                  <span className="font-medium">
                    {state.selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Seat Number</span>
                  <span className="font-medium">
                    {state.selectedSeats[0]?.row}{state.selectedSeats[0]?.number}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Ticket Price per Seat</span>
                  <span className="font-medium">
                    {state.selectedSeats[0]?.price.toLocaleString()} THB
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Quantity</span>
                  <span className="font-medium">{state.selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-bold text-lg">{totalAmount.toLocaleString()} THB</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  !isProcessing
                    ? 'bg-brand-pink text-white hover:bg-opacity-90 hover:shadow-lg active:scale-99'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-2/5"
          >
            {selectedPayment === 'qr' && (
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-6 text-center">Scan QR Code</h2>
                <div className="flex justify-center mb-4">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-brand-pink">Concert Tickets</h3>
                  <p className="text-2xl font-bold">{totalAmount.toLocaleString()} THB</p>
                </div>
                <div className="space-y-2 mb-6">
                  <h3 className="font-medium text-brand-pink underline">How to pay with QR Code</h3>
                  <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>Open your Mobile Banking app or any QR Code scanner</li>
                    <li>Tap "Scan QR Code"</li>
                    <li>Point your camera at the QR Code</li>
                    <li>Review the details before proceeding</li>
                    <li>Confirm the transaction</li>
                  </ol>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Back to Checkout
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium transition-all hover:bg-green-700 active:scale-98"
                  >
                    Pay Success
                  </button>
                </div>
              </motion.div>
            )}

            {selectedPayment === 'bank' && (
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-4">Bank Transfer</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Please transfer the amount to the bank account below:
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bank Name:</span>
                    <span className="font-medium">Bangkok Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
                    <span className="font-medium">Concert Tickets Co., Ltd.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                    <span className="font-medium">123-4-56789-0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-bold">{totalAmount.toLocaleString()} THB</span>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-brand-pink text-white rounded-lg font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-99"
                >
                  I've Made The Transfer
                </button>
              </motion.div>
            )}

            {selectedPayment === 'card' && (
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-brand-darkGray border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-4">True Money Wallet</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Please scan the QR code with your True Money Wallet app:
                </p>
                <div className="flex justify-center mb-6">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="True Money QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  1. Open your True Money Wallet app<br />
                  2. Tap on "Scan QR"<br />
                  3. Point your camera at the QR code<br />
                  4. Confirm the payment of {totalAmount.toLocaleString()} THB
                </p>
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-brand-pink text-white rounded-lg font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-99"
                >
                  I've Completed the Payment
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
