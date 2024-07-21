import { Context, Layer, Effect, Runtime } from "effect";
import express from "express";
import bodyParser from "body-parser";
import nunjucks from "nunjucks";
import api from "./api/routes";
import views from "./views/routes";

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

    api.forEach(([method, path, handler]) => {
      app[method](`/api${path}`, (req, res) => {
        console.log(`Request: ${method.toUpperCase()} ${path}`);
        runFork(
          Effect.mapError(handler(req, res), (e) =>
            res.status(500).send(e.message)
          )
        );
      });
    });

    views.forEach(([method, path, handler]) => {
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

    nunjucks.configure("src/app/views", {
      autoescape: true,
      express: app,
    });

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
const ExpressLive = Layer.sync(Express, () =>
  express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
);

// Combine the layers
export const AppLive = ServerLive.pipe(
  Layer.provide(IndexRouteLive),
  Layer.provide(ExpressLive)
);
