import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import ConcertDetail from "@/pages/ConcertDetail";
import SeatSelection from "@/pages/SeatSelection";
import Payment from "@/pages/Payment";
import Ticket from "@/pages/Ticket";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { LazyMotion, domAnimation } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LazyMotion features={domAnimation}>
        <AppProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/concert/:id"
                element={
                  <ProtectedRoute>
                    <ConcertDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/concert/:id/seats"
                element={
                  <ProtectedRoute>
                    <SeatSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ticket"
                element={
                  <ProtectedRoute>
                    <Ticket />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </LazyMotion>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;