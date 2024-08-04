import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { GetExam } from "../../../../core/workflows";

export const handler = (req: Request, res: Response) =>
  Effect.gen(function* () {
    const { id, name } = yield* GetExam.workflow(req.params.id);
    return res.send(JSON.stringify({ id: id.id, name: name.name }));
  });
