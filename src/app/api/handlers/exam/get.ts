import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { GetExamWorkflow } from "../../../../core/workflows/get-exam";

export const handler = (req: Request, res: Response) =>
  Effect.gen(function* () {
    const { id, name } = yield* (yield* GetExamWorkflow)(req.params.id);
    return res.send(JSON.stringify({ id: id.id, name: name.name }));
  });
