import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./authRouter";
import { ideasRouter } from "./routers/ideas";
import { projectsRouter } from "./routers/projects";
import { communityRouter } from "./routers/community";
import { negotiationsRouter } from "./routers/negotiations";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,

  // Feature routers
  users: usersRouter,
  ideas: ideasRouter,
  projects: projectsRouter,
  community: communityRouter,
  negotiations: negotiationsRouter,
});

export type AppRouter = typeof appRouter;
