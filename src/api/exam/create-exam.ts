import { Effect } from "effect";
import { CreateExam } from "../../core/workflows";
import { MalformedDataError } from "../../core/domain";
import { Request, Response } from "express-serve-static-core";
import { IncomingExamDto } from "../../core/workflows/create-exam";

export const handler = (req: Request, res: Response) =>
  Effect.gen(function* () {
    const body = req.body as IncomingExamDto;

    if (!CreateExam.zIncomingExamDto.safeParse(body).success) {
      yield* Effect.fail(new MalformedDataError("Malformed body"));
    }

    const outgoingExamDto = yield* CreateExam.workflow(body);

    res.send(JSON.stringify(outgoingExamDto));
  });
