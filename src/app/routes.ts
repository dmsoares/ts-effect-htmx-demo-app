import { Layer, Effect, Runtime } from "effect";
import { Request, Response } from "express-serve-static-core";
import { Handler } from "./types";
import { Express } from "./express";
import * as Browser from "./browser/handlers";
import * as Api from "./api/handlers";

const handler = (h: Handler) =>
  Effect.gen(function* () {
    const runFork = Runtime.runFork(yield* Effect.runtime<never>());
    return (req: Request, res: Response) => runFork(h(req, res));
  });

const BrowserRoutesLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* Express;

    app.get("/", yield* handler(Browser.home));
    app.get("/exams", yield* handler(Browser.exams));
    app.get("/exams/create", yield* handler(Browser.examCreate));
    app.get("/exams/:id", yield* handler(Browser.examDetail));
    app.get("/exams/:id/edit", yield* handler(Browser.examEdit));
    // partials
    app.get("/partials/exams", yield* handler(Browser.listExams));
    app.post("/partials/exams", yield* handler(Browser.createExam));
    app.put("/partials/exams/:id", yield* handler(Browser.updateExam));
  })
);

const ApiRoutesLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* Express;

    app.get("/api/exams", yield* handler(Api.listExams));
    app.get("/api/exams/:id", yield* handler(Api.getExam));
    app.post("/api/exams", yield* handler(Api.createExam));
  })
);

export const RoutesLive = Layer.merge(BrowserRoutesLive, ApiRoutesLive);
