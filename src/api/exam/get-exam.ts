import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { GetExam } from "../../core/workflows";
import { ExamId } from "../../core/domain";

export const handler = (req: Request, res: Response) =>
  Effect.gen(function* () {
    const examId = yield* ExamId.create(req.params.id);
    res.send(JSON.stringify(yield* GetExam.workflow(examId)));
  });
