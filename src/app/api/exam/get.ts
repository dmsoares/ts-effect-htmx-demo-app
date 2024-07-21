import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { GetExam } from "../../../core/workflows";

export const handler = (req: Request, res: Response) =>
  Effect.gen(function* () {
    res.send(JSON.stringify(yield* GetExam.workflow(req.params.id)));
  });
