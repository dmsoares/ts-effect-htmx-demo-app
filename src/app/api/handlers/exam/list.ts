import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { ListExamsWorkflow } from "../../../../core/workflows/list-exams";

export const handler = (_: Request, res: Response) =>
  Effect.gen(function* () {
    const exams = yield* yield* ListExamsWorkflow;
    return res.send(
      JSON.stringify(
        exams.map(({ id, name }) => ({ id: id.id, name: name.name }))
      )
    );
  });
