import { Context, Effect, Layer } from "effect";
import { ExamRepository } from "../../infrastructure/exam/repository";
import { Exam, ValidationError } from "../../domain";
import { UnknownException } from "effect/Cause";

type Error = ValidationError | UnknownException;

export class ListExamsWorkflow extends Context.Tag("ListExamsWorkflow")<
  ListExamsWorkflow,
  Effect.Effect<Exam.Exam[], Error, ExamRepository>
>() {}

export const WorkflowLive = Layer.succeed(
  ListExamsWorkflow,
  Effect.gen(function* () {
    return yield* (yield* ExamRepository).getAll;
  })
);
