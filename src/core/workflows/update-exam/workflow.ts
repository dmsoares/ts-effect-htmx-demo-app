import { Context, Effect, Layer } from "effect";
import { UnknownException } from "effect/Cause";
import { Exam, ExamId, ExamName } from "../../domain/exam";
import { UnvalidatedExam } from "./types";
import { canCreateOrUpdate } from "../../services/exam/can-create-or-update";
import { ValidationError, WorkflowError } from "../../domain";
import { ExamRepository } from "../../infrastructure/exam/repository";

type Error = ValidationError | WorkflowError | UnknownException;

export class UpdateExamWorkflow extends Context.Tag("CreateExamWorkflow")<
  UpdateExamWorkflow,
  (exam: UnvalidatedExam) => Effect.Effect<Exam.Exam, Error, ExamRepository>
>() {}

const validateExam = (exam: UnvalidatedExam) =>
  Effect.gen(function* () {
    return Exam.create(
      yield* ExamId.create(exam.id),
      yield* ExamName.create(exam.name)
    );
  });

const saveExam = (exam: Exam.Exam) =>
  ExamRepository.pipe(Effect.flatMap((repo) => repo.createOrUpdate(exam)));

export const WorkflowLive = Layer.succeed(
  UpdateExamWorkflow,
  (exam: UnvalidatedExam) =>
    Effect.succeed(exam).pipe(
      Effect.flatMap(validateExam),
      Effect.flatMap(canCreateOrUpdate),
      Effect.flatMap(saveExam)
    )
);
