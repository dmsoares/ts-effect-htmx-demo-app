import { Effect, Layer } from "effect";
import { ServerLive } from "./server";
import { ExpressLive } from "./express";
import { RoutesLive } from "./routes";

// Build the application
export const AppLive = ServerLive.pipe(
  Layer.provide(RoutesLive),
  Layer.provide(ExpressLive)
);

// Run the program
Effect.runFork(Layer.launch(AppLive));
