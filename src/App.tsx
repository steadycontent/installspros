import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { UrlParamsProvider } from "@/contexts/UrlParamsContext";
import Analytics from "@/components/Analytics";
import Index from "./pages/Index";

// Lazy-loaded routes
const ThankYou = lazy(() => import("./pages/ThankYou"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Locations = lazy(() => import("./pages/Locations"));
const Blog = lazy(() => import("./pages/Blog"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const OptOutPreferences = lazy(() => import("./pages/OptOutPreferences"));
const Confirmed = lazy(() => import("./pages/Confirmed"));
const ScheduleCall = lazy(() => import("./pages/ScheduleCall"));
const ContactDetails = lazy(() => import("./pages/ContactDetails"));
const DesignSystem = lazy(() => import("./pages/DesignSystem"));
const SameDayQuote = lazy(() => import("./pages/SameDayQuote"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Frank = lazy(() => import("./pages/Frank"));
const Gus = lazy(() => import("./pages/Gus"));
const SmartHome = lazy(() => import("./pages/SmartHome"));
const Shop = lazy(() => import("./pages/Shop"));
const SmartThermostats = lazy(() => import("./pages/services/SmartThermostats"));
const SecuritySystems = lazy(() => import("./pages/services/SecuritySystems"));
const GarageOpeners = lazy(() => import("./pages/services/GarageOpeners"));
const PermanentLighting = lazy(() => import("./pages/PermanentLighting"));
const INeedStarlink = lazy(() => import("./pages/INeedStarlink"));
const ThankYouGus = lazy(() => import("./pages/ThankYouGus"));
const DynamicFunnel = lazy(() => import("./pages/DynamicFunnel"));
const RvResort70Unit = lazy(() => import("./pages/proposals/RvResort70Unit"));
// Admin pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));
const AdminOverview = lazy(() => import("./pages/admin/Overview"));
const AdminFunnel = lazy(() => import("./pages/admin/Funnel"));
const AdminVariants = lazy(() => import("./pages/admin/Variants"));
const AdminSubmissions = lazy(() => import("./pages/admin/Submissions"));
const AdminGoogleAds = lazy(() => import("./pages/admin/GoogleAds"));
const AdminGoogleAdsCampaignDetail = lazy(() => import("./pages/admin/GoogleAdsCampaignDetail"));
const AdminGoogleAdsSettings = lazy(() => import("./pages/admin/GoogleAdsSettings"));
const WebhooksLayout = lazy(() => import("./pages/admin/WebhooksLayout"));
const WebhooksPage = lazy(() => import("./pages/admin/Webhooks"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, navType]);
  return null;
};

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <UrlParamsProvider>
            
            <ScrollToTop />
            <Analytics />
            <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/opt-out-preferences" element={<OptOutPreferences />} />
              <Route path="/confirmed" element={<Confirmed />} />
              <Route path="/schedule-call" element={<ScheduleCall />} />
              <Route path="/contact-details" element={<ContactDetails />} />
              <Route path="/starlink-lp1" element={<Navigate to="/" replace />} />
              {/* Legacy admin shortcuts */}
              <Route path="/submissions" element={<Navigate to="/admin/submissions" replace />} />
              <Route path="/funnel" element={<Navigate to="/admin/funnel" replace />} />
              <Route path="/variants" element={<Navigate to="/admin/variants" replace />} />
              <Route path="/google-ads" element={<Navigate to="/admin/google-ads" replace />} />
              <Route path="/webhooks" element={<Navigate to="/admin/webhooks" replace />} />
              <Route path="/design-system" element={<DesignSystem />} />
              <Route path="/same-day-quote" element={<SameDayQuote />} />
              <Route path="/frank" element={<Frank />} />
              <Route path="/gus" element={<Gus />} />
              <Route path="/smart-home" element={<SmartHome />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/services/smart-thermostats" element={<SmartThermostats />} />
              <Route path="/services/security-systems" element={<SecuritySystems />} />
              <Route path="/services/garage-openers" element={<GarageOpeners />} />
              <Route path="/permanent-lighting" element={<PermanentLighting />} />
              <Route path="/i-need-starlink" element={<INeedStarlink />} />
              <Route path="/thank-you-gus" element={<ThankYouGus />} />
              <Route path="/f/:slug" element={<DynamicFunnel />} />
              <Route path="/proposals/JASON-70-unit" element={<RvResort70Unit />} />
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="funnel" element={<AdminFunnel />} />
                <Route path="variants" element={<AdminVariants />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="google-ads" element={<AdminGoogleAds />} />
                <Route path="google-ads/campaigns/:campaignId" element={<AdminGoogleAdsCampaignDetail />} />
              <Route path="google-ads/settings" element={<AdminGoogleAdsSettings />} />
              </Route>
              <Route path="/admin/webhooks" element={<WebhooksLayout />}>
                <Route index element={<WebhooksPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            
          </UrlParamsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
