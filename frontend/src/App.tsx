import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Reserve from "./pages/Reserve";
import Confirmation from "./pages/Confirmation";
import Resend from "./pages/Resend";
import StaffLogin from "./pages/StaffLogin";
import StaffScanner from "./pages/StaffScanner";
import StaffDashboard from "./pages/StaffDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/resend" element={<Resend />} />
          <Route path="/staff" element={<StaffLogin />} />
          <Route path="/staff/scanner" element={<StaffScanner />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
