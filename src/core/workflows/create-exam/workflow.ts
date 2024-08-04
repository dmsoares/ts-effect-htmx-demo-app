import { Context, Effect, Layer } from "effect";
import { Exam, ExamId, ExamName } from "../../domain/exam";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { UnvalidatedExam } from "./types";
import { canCreateOrUpdate } from "../../services/exam/can-create-or-update";
import { UnknownException } from "effect/Cause";
import { ValidationError, WorkflowError } from "../../domain";

type Error = ValidationError | WorkflowError | UnknownException;

export class CreateExamWorkflow extends Context.Tag("CreateExamWorkflow")<
  CreateExamWorkflow,
  (exam: UnvalidatedExam) => Effect.Effect<Exam.Exam, Error, never>
>() {}

const validateExam = (exam: UnvalidatedExam) =>
  Effect.gen(function* () {
    return Exam.create(ExamId.generate(), yield* ExamName.create(exam.name));
  });

const saveExam = ExamRepository.createOrUpdate;

export const WorkflowLive = Layer.succeed(
  CreateExamWorkflow,
  (exam: UnvalidatedExam) =>
    Effect.succeed(exam).pipe(
      Effect.flatMap(validateExam),
      Effect.flatMap(canCreateOrUpdate),
      Effect.flatMap(saveExam)
    )
);
