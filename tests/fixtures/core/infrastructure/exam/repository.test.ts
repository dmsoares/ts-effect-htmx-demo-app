import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { v4 as uuidv4 } from "uuid";
import { Exam, ExamId, ExamName } from "../../../../../src/core/domain";
import {
  ExamRepository,
  ExamRepositoryLive,
} from "../../../../../src/core/infrastructure/exam/repository";
import { ExamsTableServiceTest } from "../../../../services/db-client";

const MainTest = Layer.provide(ExamRepositoryLive, ExamsTableServiceTest);

const runEffect = <A, E>(effect: Effect.Effect<A, E, ExamRepository>) =>
  Effect.runPromise(Effect.provide(effect, MainTest));

describe("ExamRepository", () => {
  it("should create and retrieve an exam", () => {
    return Effect.gen(function* () {
      const { createOrUpdate, getById } = yield* ExamRepository;

      const exam = Exam.create(
        ExamId.generate(),
        yield* ExamName.create(uuidv4())
      );

      yield* createOrUpdate(exam);

      const retrievedExam = yield* getById(exam.id);

      expect(retrievedExam.name.name).toEqual(exam.name.name);
    }).pipe(runEffect);
  });
});
