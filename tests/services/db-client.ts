import * as fs from "node:fs/promises";
import { Effect, Layer } from "effect";
import { SerializedExam } from "../../src/core/infrastructure/exam/serialization";
import { ExamsTableService } from "../../src/core/infrastructure/exam/db-client";

const initTable = (table: string) =>
  Effect.gen(function* () {
    const dbPath = ".db";
    const tablePath = `${dbPath}/${table}_test.json`;

    yield* Effect.tryPromise(async () => {
      await fs.mkdir(dbPath, { recursive: true });
      try {
        await fs.access(tablePath);
      } catch {
        await fs.writeFile(tablePath, JSON.stringify([]));
      }
    });

    return {
      write: (payload: unknown) =>
        Effect.promise(() => fs.writeFile(tablePath, JSON.stringify(payload))),
      read: Effect.promise<unknown>(() =>
        fs.readFile(tablePath, "utf-8").then((data) => JSON.parse(data))
      ),
    };
  });

const examsTable = Effect.gen(function* () {
  const table = "exams";

  const { write, read: readRaw } = yield* initTable(table);

  return {
    write: (exams: SerializedExam[]) => write(exams),
    read: readRaw as Effect.Effect<SerializedExam[]>,
  };
});

export const ExamsTableServiceTest = Layer.effect(
  ExamsTableService,
  examsTable
);
