import { Effect, FiberSet } from "effect";
import { Request, Response } from "express-serve-static-core";
import { Express } from "./express";

export const get = <A, E, R>(
  path: string,
  body: (req: Request, res: Response) => Effect.Effect<A, E, R>
) =>
  Effect.gen(function* () {
    const app = yield* Express;
    const run = yield* FiberSet.makeRuntime<R>();
    app.get(path, (req, res) => run(body(req, res)));
  });

export const post = <A, E, R>(
  path: string,
  body: (req: Request, res: Response) => Effect.Effect<A, E, R>
) =>
  Effect.gen(function* () {
    const app = yield* Express;
    const run = yield* FiberSet.makeRuntime<R>();
    app.post(path, (req, res) => run(body(req, res)));
  });

export const put = <A, E, R>(
  path: string,
  body: (req: Request, res: Response) => Effect.Effect<A, E, R>
) =>
  Effect.gen(function* () {
    const app = yield* Express;
    const run = yield* FiberSet.makeRuntime<R>();
    app.put(path, (req, res) => run(body(req, res)));
  });
