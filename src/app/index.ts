import { Effect, Layer } from "effect";
import { AppLive } from "./server";

// Run the program
Effect.runFork(Layer.launch(AppLive));
