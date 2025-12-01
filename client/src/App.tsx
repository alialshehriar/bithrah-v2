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
import VerifyEmail from "./pages/VerifyEmail";
import EarlyAccessSuccess from "./pages/EarlyAccessSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Evaluate from "./pages/Evaluate";

function Router() {
  return (
    <Switch>
      {/* Main page - Early Access */}
      <Route path={"/"} component={EarlyAccess} />
      <Route path={"/early-access"} component={EarlyAccess} />
      <Route path={"/evaluate"} component={Evaluate} />
      
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
      
      {/* Auth routes */}
      <Route path={"/verify-email"} component={VerifyEmail} />
      <Route path={"/early-access-success"} component={EarlyAccessSuccess} />
      
      {/* Admin routes */}
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin"} component={AdminDashboard} />
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
