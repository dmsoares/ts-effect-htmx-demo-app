import { Context, Effect, Layer } from "effect";
import { Exam, ExamId, NotFoundError, ValidationError } from "../../domain";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { UnknownException } from "effect/Cause";

type WorkflowError = ValidationError | UnknownException | NotFoundError;

export class GetExamWorkflow extends Context.Tag("GetExamWorkflow")<
  GetExamWorkflow,
  (id: string) => Effect.Effect<Exam.Exam, WorkflowError>
>() {}

export const WorkflowLive = Layer.succeed(GetExamWorkflow, (id: string) =>
  ExamId.create(id).pipe(Effect.flatMap(ExamRepository.getById))
);
