import * as fs from "node:fs/promises";
import { Context, Effect, Layer } from "effect";
import { SerializedExam } from "./serialization";

const initTable = (table: string) =>
  Effect.gen(function* () {
    const dbPath = ".db";
    const tablePath = `${dbPath}/${table}.json`;

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

export class ExamsTableService extends Context.Tag("ExamsTableService")<
  ExamsTableService,
  Effect.Effect.Success<typeof examsTable>
>() {}

export const ExamsTableServiceLive = Layer.effect(
  ExamsTableService,
  examsTable
);
