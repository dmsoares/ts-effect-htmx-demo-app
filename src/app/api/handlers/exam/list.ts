import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { ListExams } from "../../../../core/workflows";

export const handler = (_: Request, res: Response) =>
  Effect.gen(function* () {
    const exams = yield* ListExams.workflow;
    return res.send(
      JSON.stringify(
        exams.map(({ id, name }) => ({ id: id.id, name: name.name }))
      )
    );
  });