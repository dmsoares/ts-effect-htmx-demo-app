import { Layer, Effect, Runtime } from "effect";
import { Request, Response } from "express-serve-static-core";
import { Handler } from "./types";
import { Express } from "./express";
import * as Browser from "./browser/handlers";
import * as Api from "./api/handlers";

const setupHandler = (handler: Handler) =>
  Effect.gen(function* () {
    const runFork = Runtime.runFork(yield* Effect.runtime<never>());
    return (req: Request, res: Response) =>
      runFork(
        Effect.mapError(handler(req, res), (e) =>
          res.status(500).send(JSON.stringify({ error: e.message }))
        )
      );
  });

const browserHandler = (handler: Handler) =>
  setupHandler((req, res) =>
    Effect.gen(function* () {
      res.locals.useLayout = req.headers["hx-request"] !== "true";
      return yield* handler(req, res);
    })
  );

const BrowserRoutesLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* Express;

    app.get("/", yield* browserHandler(Browser.home));
    app.get("/exams", yield* browserHandler(Browser.exams));
    app.get("/exams/create", yield* browserHandler(Browser.examCreate));
    app.get("/exams/:id", yield* browserHandler(Browser.examDetail));
    app.get("/exams/:id/edit", yield* browserHandler(Browser.examEdit));
    // partials
    app.get("/partials/exams", yield* browserHandler(Browser.listExams));
    app.post("/partials/exams", yield* browserHandler(Browser.createExam));
    app.put("/partials/exams/:id", yield* browserHandler(Browser.updateExam));
  })
);

const ApiRoutesLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* Express;

    app.get("/api/exams", yield* setupHandler(Api.listExams));
    app.get("/api/exams/:id", yield* setupHandler(Api.getExam));
    app.post("/api/exams", yield* setupHandler(Api.createExam));
  })
);

export const RoutesLive = Layer.merge(BrowserRoutesLive, ApiRoutesLive);
