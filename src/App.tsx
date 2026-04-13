import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";

// Screens
import Home from "@/components/screens/Home";
import StateCapture from "@/components/screens/StateCapture";
import ClassificationLoading from "@/components/screens/ClassificationLoading";
import StateDisplay from "@/components/screens/StateDisplay";
import SecondRank from "@/components/screens/SecondRank";
import BehaviourSurface from "@/components/screens/BehaviourSurface";
import ObserverStrength from "@/components/screens/ObserverStrength";
import LoopProgress from "@/components/screens/LoopProgress";
import DecisionCapture from "@/components/screens/DecisionCapture";
import TechniqueSelection from "@/components/screens/TechniqueSelection";
import Stabilisation from "@/components/screens/Stabilisation";
import MicroAction from "@/components/screens/MicroAction";
import ReCheck from "@/components/screens/ReCheck";
import SessionClose from "@/components/screens/SessionClose";
import HighPressure from "@/components/screens/HighPressure";
import OutcomeSignal from "@/components/screens/OutcomeSignal";
import OutcomeNotification from "@/components/screens/OutcomeNotification";
import OutcomeConfirmation from "@/components/screens/OutcomeConfirmation";
import ReflectionA from "@/components/screens/ReflectionA";
import ReflectionB from "@/components/screens/ReflectionB";
import Dashboard from "@/components/screens/Dashboard";
import History from "@/components/screens/History";
import Profile from "@/components/screens/Profile";
import Waitlist from "@/components/screens/Waitlist";
import Onboarding from "@/components/screens/Onboarding";
import Disclaimer from "@/components/screens/Disclaimer";
import Privacy from "@/components/screens/Privacy";
import Auth from "@/components/screens/Auth";
import ReEntry from "@/components/screens/ReEntry";
import NotFound from "@/pages/NotFound";
import GlobalLayout from "@/components/shared/GlobalLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <BrowserRouter>
          <GlobalLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/state-capture" element={<StateCapture />} />
            <Route path="/classification-loading" element={<ClassificationLoading />} />
            <Route path="/state-display" element={<StateDisplay />} />
            <Route path="/second-rank" element={<SecondRank />} />
            <Route path="/behaviour-surface" element={<BehaviourSurface />} />
            <Route path="/observer-strength" element={<ObserverStrength />} />
            <Route path="/loop-progress" element={<LoopProgress />} />
            <Route path="/decision-capture" element={<DecisionCapture />} />
            <Route path="/technique-selection" element={<TechniqueSelection />} />
            <Route path="/stabilisation" element={<Stabilisation />} />
            <Route path="/micro-action" element={<MicroAction />} />
            <Route path="/recheck" element={<ReCheck />} />
            <Route path="/session-close" element={<SessionClose />} />
            <Route path="/high-pressure" element={<HighPressure />} />
            <Route path="/outcome-signal" element={<OutcomeSignal />} />
            <Route path="/outcome-notification" element={<OutcomeNotification />} />
            <Route path="/outcome-confirmation" element={<OutcomeConfirmation />} />
            <Route path="/reflection-a" element={<ReflectionA />} />
            <Route path="/reflection-b" element={<ReflectionB />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/re-entry" element={<ReEntry />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </GlobalLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
