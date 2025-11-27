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
import IdeaDetails from "./pages/IdeaDetails";
import MyIdeas from "./pages/MyIdeas";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Community from "./pages/Community";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/settings"} component={Settings} />
        <Route path="/ideas/new" component={NewIdea} />
      <Route path="/ideas/my-ideas" component={MyIdeas} />
      <Route path="/ideas/:id" component={IdeaDetails} />
      <Route path="/projects/new" component={NewProject} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/projects" component={Projects} />
      <Route path="/community" component={Community} />
      <Route path={"/404"} component={NotFound} />
      {/* TODO: Add more routes here as we build pages */}
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
