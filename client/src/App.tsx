import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import EarlyAccess from "./pages/EarlyAccess";
import EarlyAccessAdmin from "./pages/admin/EarlyAccessAdmin";

function Router() {
  // During early access period, show EarlyAccess page as main page (updated)
  return (
    <Switch>
      <Route path={"/"} component={EarlyAccess} />
      {/* Admin routes are always accessible */}
      <Route path={"/admin/early-access"} component={EarlyAccessAdmin} />
      {/* All other routes redirect to early access page */}
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
