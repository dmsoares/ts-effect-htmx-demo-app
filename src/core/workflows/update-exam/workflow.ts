import { Effect as E } from "effect";
import { Exam, ExamId, ExamName } from "../../domain/exam";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { IncomingExamDto, OutgoingExamDto, UnvalidatedExam } from "./types";

const createUnvalidatedExam = (exam: IncomingExamDto): UnvalidatedExam => ({
  id: exam.id,
  name: exam.name,
});

const validateExam = (exam: UnvalidatedExam) =>
  E.gen(function* () {
    return Exam.create(
      yield* ExamId.create(exam.id),
      yield* ExamName.create(exam.name)
    );
  });

const saveExam = ExamRepository.createOrUpdate;

const createOutgoingExam = (exam: Exam.Exam): OutgoingExamDto => ({
  id: exam.id.id,
  name: exam.name.name,
});

export const workflow = (exam: IncomingExamDto) =>
  E.succeed(exam).pipe(
    E.map(createUnvalidatedExam),
    E.flatMap(validateExam),
    E.flatMap(saveExam),
    E.map(createOutgoingExam)
  );
