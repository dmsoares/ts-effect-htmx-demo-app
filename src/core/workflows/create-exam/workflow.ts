import { Context, Effect, Layer } from "effect";
import { Exam, ExamId, ExamName } from "../../domain/exam";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { UnvalidatedExam } from "./types";
import { CanCreateOrUpdate } from "../../services/exam/can-create-or-update";

const make = Effect.gen(function* () {
  const repo = yield* ExamRepository.ExamRepository;
  const canCreateOrUpdate = yield* CanCreateOrUpdate;

  return (unvalidatedExam: UnvalidatedExam) =>
    Effect.gen(function* () {
      const exam = Exam.create(
        ExamId.generate(),
        yield* ExamName.create(unvalidatedExam.name)
      );
      yield* canCreateOrUpdate(exam);
      return yield* repo.createOrUpdate(exam);
    });
});

export class CreateExamWorkflow extends Context.Tag("CreateExamWorkflow")<
  CreateExamWorkflow,
  Effect.Effect.Success<typeof make>
>() {}

export const WorkflowLive = Layer.effect(CreateExamWorkflow, make);
