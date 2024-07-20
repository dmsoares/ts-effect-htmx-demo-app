import { Effect, Layer } from "effect";
import { AppLive } from "./api";

// Run the program
Effect.runFork(Layer.launch(AppLive));
