import { Context, Layer, Effect, Runtime } from "effect";
import express from "express";
import bodyParser from "body-parser";
import nunjucks from "nunjucks";
import api from "./api/routes";
import browser from "./browser/routes";
import { Route } from "./types";

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

    const setupRoutes = (routes: Route[], baseUrl: string | undefined = "") =>
      routes.forEach(([method, path, handler]) => {
        app[method](`${baseUrl}${path}`, (req, res) => {
          runFork(
            Effect.gen(function* () {
              yield* Effect.log(`Request: ${method.toUpperCase()} ${path}`);
              return yield* Effect.mapError(handler(req, res), (e) =>
                res.status(500).send(JSON.stringify({ error: e.message }))
              );
            })
          );
        });
      });

    setupRoutes(browser);
    setupRoutes(api, "/api");
  })
);

// Server Setup
const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 3001;
    const app = yield* Express;

    nunjucks.configure("src/app/browser/views", {
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
