import { Context, Effect, Layer } from "effect";
import { ExamRepository } from "../../infrastructure/exam/repository";

const make = Effect.gen(function* () {
  const repo = yield* ExamRepository;

  return Effect.gen(function* () {
    return yield* repo.getAll;
  });
});

export class ListExamsWorkflow extends Context.Tag("ListExamsWorkflow")<
  ListExamsWorkflow,
  Effect.Effect.Success<typeof make>
>() {}

export const WorkflowLive = Layer.effect(ListExamsWorkflow, make);
