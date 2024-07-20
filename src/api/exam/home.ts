import { Effect } from "effect";
import pug from "pug";
import { Request, Response } from "express-serve-static-core";

export const handler = (_: Request, res: Response) =>
  Effect.gen(function* () {
    res.send(pug.renderFile("src/api/views/index.pug"));
  });
