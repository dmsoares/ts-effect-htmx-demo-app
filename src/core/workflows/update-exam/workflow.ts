import { Context, Effect, Layer } from "effect";
import { Exam, ExamId, ExamName } from "../../domain/exam";
import { UnvalidatedExam } from "./types";
import { CanCreateOrUpdate } from "../../services/exam/can-create-or-update";
import { ExamRepository } from "../../infrastructure/exam/repository";

const make = Effect.gen(function* () {
  const repo = yield* ExamRepository;
  const canCreateOrUpdate = yield* CanCreateOrUpdate;

  return (unvalidatedExam: UnvalidatedExam) =>
    Effect.gen(function* () {
      const exam = Exam.create(
        yield* ExamId.create(unvalidatedExam.id),
        yield* ExamName.create(unvalidatedExam.name)
      );
      yield* canCreateOrUpdate(exam);
      return yield* repo.createOrUpdate(exam);
    });
});

export class UpdateExamWorkflow extends Context.Tag("CreateExamWorkflow")<
  UpdateExamWorkflow,
  Effect.Effect.Success<typeof make>
>() {}

export const WorkflowLive = Layer.effect(UpdateExamWorkflow, make);
