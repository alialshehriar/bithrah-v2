import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NewIdea from "./pages/NewIdea";
import SubmitIdea from "./pages/SubmitIdea";
import InvestorDashboard from "./pages/InvestorDashboard";
import IdeaDetails from "./pages/IdeaDetails";
import MyIdeas from "./pages/MyIdeas";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Community from "./pages/Community";
import Negotiations from "./pages/Negotiations";
import MarketerDashboard from "./pages/MarketerDashboard";
import EarlyAccess from "./pages/EarlyAccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import About from "./pages/static/About";
import Contact from "./pages/static/Contact";
import FAQ from "./pages/static/FAQ";
import Terms from "./pages/static/Terms";
import Privacy from "./pages/static/Privacy";
import Wallet from "./pages/Wallet";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
       <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
        <Route path="/ideas/new" component={NewIdea} />
      <Route path="/ideas/submit" component={SubmitIdea} />
      <Route path="/investors/dashboard" component={InvestorDashboard} />
      <Route path="/ideas/my-ideas" component={MyIdeas} />
      <Route path="/ideas/:id" component={IdeaDetails} />
      <Route path="/projects/new" component={NewProject} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/projects" component={Projects} />
      <Route path="/community" component={Community} />
      <Route path="/negotiations" component={Negotiations} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/marketer" component={MarketerDashboard} />
      <Route path="/early-access" component={EarlyAccess} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
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
