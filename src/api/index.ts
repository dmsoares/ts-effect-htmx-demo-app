import { Context, Layer, Effect, Runtime } from "effect";
import express from "express";
import bodyParser from "body-parser";
import { handler as createExam } from "./exam/create-exam";
import { handler as listExams } from "./exam/list-exams";
import { handler as getExam } from "./exam/get-exam";
import { handler as home } from "./exam/home";

import { Request, Response } from "express-serve-static-core";

type Handler = (req: Request, res: Response) => Effect.Effect<unknown, Error>;
type Method = "get" | "post";
type Path = string;

type Route = [Method, Path, Handler];

const routes: Route[] = [
  ["get", "/", home],
  ["get", "/exams", listExams],
  ["get", "/exams/:id", getExam],
  ["post", "/exams", createExam],
];

// Define Express as a service
class Express extends Context.Tag("Express")<
  Express,
  ReturnType<typeof express>
>() {}

// Define the main route, IndexRouteLive, as a Layer
const IndexRouteLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const app = yield* Express;
    const runFork = Runtime.runFork(yield* Effect.runtime<never>());

    routes.forEach(([method, path, handler]) => {
      app[method](path, (req, res) => {
        console.log(`Request: ${method.toUpperCase()} ${path}`);
        runFork(
          Effect.mapError(handler(req, res), (e) =>
            res.status(500).send(e.message)
          )
        );
      });
    });
  })
);

// Server Setup
const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 3001;
    const app = yield* Express;
    yield* Effect.acquireRelease(
      Effect.sync(() =>
        app.listen(port, () =>
          console.log(`Example app listening on port ${port}`)
        )
      ),
      (server) => Effect.sync(() => server.close())
    );
  })
);

// Setting Up Express
const ExpressLive = Layer.sync(Express, () => express().use(bodyParser.json()));

// Combine the layers
export const AppLive = ServerLive.pipe(
  Layer.provide(IndexRouteLive),
  Layer.provide(ExpressLive)
);
