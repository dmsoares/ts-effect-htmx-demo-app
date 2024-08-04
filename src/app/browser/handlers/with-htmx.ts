import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";

export const withHtmx =
  <A, E, R>(handler: (req: Request, res: Response) => Effect.Effect<A, E, R>) =>
  (req: Request, res: Response) =>
    Effect.gen(function* () {
      res.locals.useLayout = req.headers["hx-request"] !== "true";
      return yield* handler(req, res);
    });
