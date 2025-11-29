import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ideasRouter } from "./routers/ideas";
import { projectsRouter } from "./routers/projects";
import { communityRouter } from "./routers/community";
import { negotiationsRouter } from "./routers/negotiations";
import { usersRouter } from "./routers/users";
import { authRouter } from "./authRouter";
import { earlyAccessRouter } from "./earlyAccessRouter";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: authRouter,
  earlyAccess: earlyAccessRouter,

  // Feature routers
  users: usersRouter,
  ideas: ideasRouter,
  projects: projectsRouter,
  community: communityRouter,
  negotiations: negotiationsRouter,
});

export type AppRouter = typeof appRouter;
