import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import EarlyAccessAdmin from "./pages/admin/EarlyAccessAdmin";

function Router() {
  // During early access period, only Home page and Admin panel are accessible
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Admin routes are always accessible */}
      <Route path={"/admin/early-access"} component={EarlyAccessAdmin} />
      {/* All other routes redirect to home during early access */}
      <Route component={Home} />
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
