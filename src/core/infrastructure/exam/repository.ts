import { Context, Effect, Layer } from "effect";
import { deserialize, serialize } from "./serialization";
import { Exam, ExamId, ExamName, NotFoundError } from "../../domain";
import { ExamsTableService } from "./db-client";

const make = Effect.gen(function* () {
  const { read, write } = yield* ExamsTableService;

  const createOrUpdate = (exam: Exam.Exam) =>
    Effect.gen(function* () {
      const exams = yield* read;

      const examIndex = exams.findIndex((e) => e.id === exam.id.id);

      const updatedExams =
        examIndex === -1
          ? [...exams, serialize(exam)]
          : exams.map((e) => (e.id === exam.id.id ? serialize(exam) : e));

      yield* write(updatedExams);

      return exam;
    });

  const getAll = Effect.gen(function* () {
    const exams = yield* read;

    return yield* Effect.all(exams.map((exam) => deserialize(exam)));
  });

  const getById = (id: ExamId.ExamId) =>
    Effect.gen(function* () {
      const exam = (yield* read).find((exam) => exam.id === id.id);

      return exam
        ? yield* deserialize(exam)
        : yield* Effect.fail(new NotFoundError("Exam not found"));
    });

  const getByName = (name: ExamName) =>
    Effect.gen(function* () {
      const exams = yield* read;

      return yield* Effect.all(
        exams.filter((exam) => exam.name === name.name).map(deserialize)
      );
    });

  return { createOrUpdate, getAll, getById, getByName };
});

export class ExamRepository extends Context.Tag("ExamRepository")<
  ExamRepository,
  Effect.Effect.Success<typeof make>
>() {}

export const ExamRepositoryLive = Layer.effect(ExamRepository, make);
