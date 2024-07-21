import { Effect } from "effect";
import { ListExams } from "../../../core/workflows";
import { Request, Response } from "express-serve-static-core";

export const handler = (_: Request, res: Response) =>
  Effect.gen(function* () {
    res.send(JSON.stringify(yield* ListExams.workflow));
  });
