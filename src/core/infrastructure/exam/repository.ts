import { Context, Effect, Layer } from "effect";
import { deserialize, serialize } from "./serialization";
import { Exam, ExamId, ExamName, NotFoundError } from "../../domain";
import { examsTable } from "./db-client";

export const createOrUpdate = (exam: Exam.Exam) =>
  Effect.gen(function* () {
    const { read, write } = yield* examsTable;

    const exams = yield* read;

    const examIndex = exams.findIndex((e) => e.id === exam.id.id);

    const updatedExams =
      examIndex === -1
        ? [...exams, serialize(exam)]
        : exams.map((e) => (e.id === exam.id.id ? serialize(exam) : e));

    yield* write(updatedExams);

    return exam;
  });

export const getAll = Effect.gen(function* () {
  const { read } = yield* examsTable;

  const exams = yield* read;

  return yield* Effect.all(exams.map((exam) => deserialize(exam)));
});

export const getById = (id: ExamId.ExamId) =>
  Effect.gen(function* () {
    const { read } = yield* examsTable;

    const exam = (yield* read).find((exam) => exam.id === id.id);

    return exam
      ? yield* deserialize(exam)
      : yield* Effect.fail(new NotFoundError("Exam not found"));
  });

export const getByName = (name: ExamName.ExamName) =>
  Effect.gen(function* () {
    const { read } = yield* examsTable;

    const exams = yield* read;

    return yield* Effect.all(
      exams.filter((exam) => exam.name === name.name).map(deserialize)
    );
  });

const repository = {
  createOrUpdate,
  getAll,
  getById,
  getByName,
};

export class ExamRepository extends Context.Tag("ExamRepository")<
  ExamRepository,
  typeof repository
>() {
  static readonly Live = Layer.succeed(this, repository);
}
