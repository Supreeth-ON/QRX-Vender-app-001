import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VendorSidebar } from "@/components/VendorSidebar";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import CategoryDetails from "./pages/CategoryDetails";
import MasterPause from "./pages/MasterPause";
import OrdersAnalytics from "./pages/OrdersAnalytics";
import HotelSettings from "./pages/HotelSettings";
import AccountProfile from "./pages/AccountProfile";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";
import MyDishes from "./pages/MyDishes";
import OffersSliders from "./pages/OffersSliders";
import PausedDishes from "./pages/PausedDishes";
import KitchenManagement from "./pages/KitchenManagement";
import StaffManagement from "./pages/StaffManagement";
import StaffProfile from "./pages/StaffProfile";
import NewStaff from "./pages/NewStaff";
import CounterDetails from "./pages/CounterDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full flex-col">
          <VendorSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/my-dishes" element={<MyDishes />} />
          <Route path="/offers-sliders" element={<OffersSliders />} />
          <Route path="/paused-dishes" element={<PausedDishes />} />
              <Route path="/category/:category" element={<CategoryDetails />} />
              <Route path="/kitchen-management" element={<KitchenManagement />} />
              <Route path="/counter/:counterName" element={<CounterDetails />} />
              <Route path="/staff-management" element={<StaffManagement />} />
              <Route path="/staff-management/profile/:staffId" element={<StaffProfile />} />
              <Route path="/staff-management/new" element={<NewStaff />} />
              <Route path="/master-pause" element={<MasterPause />} />
              <Route path="/orders-analytics" element={<OrdersAnalytics />} />
              <Route path="/hotel-settings" element={<HotelSettings />} />
              <Route path="/account-profile" element={<AccountProfile />} />
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/logout" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
