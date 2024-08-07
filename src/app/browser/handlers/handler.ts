import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";

export const handler =
  <A, R>(
    handler: (req: Request, res: Response) => Effect.Effect<A, Error, R>
  ) =>
  (req: Request, res: Response) =>
    Effect.gen(function* () {
      return yield* handler(req, res).pipe(
        Effect.catchAll((e) => Effect.succeed(res.status(500).send(e.message)))
      );
    });

export const withHtmx =
  <A, E, R>(handler: (req: Request, res: Response) => Effect.Effect<A, E, R>) =>
  (req: Request, res: Response) =>
    Effect.gen(function* () {
      res.locals.useLayout = req.headers["hx-request"] !== "true";
      return yield* handler(req, res);
    });
