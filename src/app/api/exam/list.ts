import { Effect } from "effect";
import { ListExams } from "../../../core/workflows";
import { Request, Response } from "express-serve-static-core";

export const handler = (_: Request, res: Response) =>
  Effect.gen(function* () {
    const exams = yield* ListExams.workflow;
    return res.send(
      JSON.stringify(
        exams.map(({ id, name }) => ({ id: id.id, name: name.name }))
      )
    );
  });
