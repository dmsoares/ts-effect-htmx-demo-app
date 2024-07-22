import { Effect as E } from "effect";
import { Exam, ExamId, ExamName } from "../../domain/exam";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { IncomingExamDto, UnvalidatedExam } from "./types";
import { canCreateOrUpdate } from "../../services/exam/can-create-or-update";

const validateExam = (exam: UnvalidatedExam) =>
  E.gen(function* () {
    return Exam.create(
      yield* ExamId.create(exam.id),
      yield* ExamName.create(exam.name)
    );
  });

const saveExam = ExamRepository.createOrUpdate;

export const workflow = (exam: IncomingExamDto) =>
  E.succeed(exam).pipe(
    E.flatMap(validateExam),
    E.flatMap(canCreateOrUpdate),
    E.flatMap(saveExam)
  );
