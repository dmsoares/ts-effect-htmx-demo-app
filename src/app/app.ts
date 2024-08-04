import { Effect, Layer } from "effect";
import { ServerLive } from "./server";
import { ExpressLive } from "./express";
import { RoutesLive } from "./routes";
import { BrowserWorkflows } from "./browser/workflows/exams";
import { ExamRepository } from "../core/infrastructure/exam/repository";
import { CoreWorkflowsLive } from "../core/workflows";

// Build the application
export const AppLive = Layer.merge(ServerLive, RoutesLive).pipe(
  Layer.provide(
    ExpressLive.pipe(
      Layer.merge(BrowserWorkflows.Live),
      Layer.merge(CoreWorkflowsLive),
      Layer.merge(ExamRepository.Live)
    )
  )
);

// Run the program
Effect.runFork(Layer.launch(AppLive));
