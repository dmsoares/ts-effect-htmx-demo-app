import * as fs from "node:fs/promises";
import { Effect } from "effect";
import { SerializedExam, deserialize, serialize } from "./serialization";
import { Exam, ExamId, NotFoundError } from "../../domain";

/**
 * Temporary json file storage for exams.
 */
const examsTable = Effect.gen(function* () {
  const filePath = "src/core/infrastructure/exam/exams.json";
  yield* Effect.tryPromise(async () => {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([]));
    }
  });

  return {
    write: (exams: SerializedExam[]) =>
      Effect.promise(() => fs.writeFile(filePath, JSON.stringify(exams))),
    read: Effect.promise<SerializedExam[]>(() =>
      fs.readFile(filePath, "utf-8").then((data) => JSON.parse(data))
    ),
  };
});

export const save = (exam: Exam.Exam) =>
  Effect.gen(function* () {
    const { read, write } = yield* examsTable;

    const exams = yield* read;

    yield* write([...exams, serialize(exam)]);

    return exam;
  });

export const getAll = () =>
  Effect.gen(function* () {
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
