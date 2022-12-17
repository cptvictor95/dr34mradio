import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { videosRouter } from "./videos";
import { ytRouter } from "./ytRouter";

export const appRouter = router({
  example: exampleRouter,
	auth: authRouter,
	videos: videosRouter,
	yt: ytRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
