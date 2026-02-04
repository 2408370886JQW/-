import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import MeetPage from "@/pages/MeetPage";
import AppointmentDetailPage from "@/pages/AppointmentDetailPage";
import CreateAppointmentPage from "@/pages/CreateAppointmentPage";
import CirclesPage from "./pages/CirclesPage";
import PublishPage from "./pages/PublishPage";
import ProfilePage from "./pages/ProfilePage";
import RelationshipPage from "./pages/RelationshipPage";
import NotificationPage from "./pages/NotificationPage";
import ChatPage from "./pages/ChatPage";
import FriendsPage from "./pages/FriendsPage";
import MerchantDetailPage from "./pages/MerchantDetailPage";
import PlanDetailPage from "./pages/PlanDetailPage";
import StoreLoginPage from "./pages/StoreLoginPage";
import StoreHomePage from "./pages/StoreHomePage";
import StoreScenarioPage from "./pages/StoreScenarioPage";
import StorePackageDetailPage from "./pages/StorePackageDetailPage";
import StorePaymentSuccessPage from "./pages/StorePaymentSuccessPage";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchResults} />
      <Route path="/meet" component={MeetPage} />
      <Route path="/appointment/create" component={CreateAppointmentPage} />
      <Route path="/appointment/:id" component={AppointmentDetailPage} />
      <Route path="/merchant/:id" component={MerchantDetailPage} />
      <Route path="/plan/:id" component={PlanDetailPage} />
      <Route path="/store/login" component={StoreLoginPage} />
      <Route path="/store/home" component={StoreHomePage} />
      <Route path="/store/scenario" component={StoreScenarioPage} />
      <Route path="/store/package/:id" component={StorePackageDetailPage} />
      <Route path="/store/payment/success" component={StorePaymentSuccessPage} />
      <Route path="/circles" component={CirclesPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/publish" component={PublishPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/relations/:type" component={RelationshipPage} />
      <Route path="/notifications" component={NotificationPage} />
      <Route path="/friends" component={FriendsPage} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
