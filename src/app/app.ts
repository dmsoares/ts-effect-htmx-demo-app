import { Effect, Layer } from "effect";
import { ServerLive } from "./server";
import { ExpressLive } from "./express";
import { RoutesLive } from "./routes";
import { BrowserWorkflowsLive } from "./browser/workflows/exams";
import { CoreWorkflowsLive } from "../core/workflows";
import { ExamsTableServiceLive } from "../core/infrastructure/exam/db-client";
import { CanCreateOrUpdateLive } from "../core/services/exam/can-create-or-update";
import { ExamRepositoryLive } from "../core/infrastructure/exam/repository";

const PersistenceLive = Layer.provide(
  ExamRepositoryLive,
  ExamsTableServiceLive
);

const CoreLive = Layer.empty.pipe(
  Layer.merge(BrowserWorkflowsLive),
  Layer.provideMerge(CoreWorkflowsLive),
  Layer.provide(CanCreateOrUpdateLive)
);

const AppLive = Layer.empty.pipe(
  Layer.merge(ServerLive),
  Layer.merge(RoutesLive),
  Layer.provide(ExpressLive),
  Layer.provide(CoreLive),
  Layer.provideMerge(PersistenceLive)
);

Effect.runFork(Layer.launch(AppLive));
