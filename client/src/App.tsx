import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import EarlyAccess from "./pages/EarlyAccess";
import EarlyAccessAdmin from "./pages/admin/EarlyAccessAdmin";
import About from "./pages/static/About";
import FAQ from "./pages/static/FAQ";
import Contact from "./pages/static/Contact";
import Terms from "./pages/static/Terms";
import Privacy from "./pages/static/Privacy";
import IPProtection from "./pages/IPProtection";
import Projects from "./pages/Projects";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";

function Router() {
  return (
    <Switch>
      {/* Main page - Early Access */}
      <Route path={"/"} component={EarlyAccess} />
      <Route path={"/early-access"} component={EarlyAccess} />
      
      {/* Static pages */}
      <Route path={"/about"} component={About} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/ip-protection"} component={IPProtection} />
      
      {/* Feature pages */}
      <Route path={"/projects"} component={Projects} />
      <Route path={"/community"} component={Community} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      
      {/* Admin routes */}
      <Route path={"/admin/early-access"} component={EarlyAccessAdmin} />
      
      {/* 404 - redirect to early access */}
      <Route component={EarlyAccess} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
