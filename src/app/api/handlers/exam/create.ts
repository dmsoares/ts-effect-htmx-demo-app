import { Effect } from "effect";
import { Request, Response } from "express-serve-static-core";
import { z } from "zod";
import { validateBody } from "../../validators";
import { CreateExam } from "../../../../core/workflows";

const zIncomingExamDto = z.object({
  name: z.string(),
});

export const handler = (req: Request, res: Response) =>
  Effect.gen(function* () {
    const incomingExamDto = yield* validateBody(zIncomingExamDto, req.body);

    const { id, name } = yield* CreateExam.workflow({
      name: incomingExamDto.name,
    });

    return res.send(JSON.stringify({ id: id.id, name: name.name }));
  });