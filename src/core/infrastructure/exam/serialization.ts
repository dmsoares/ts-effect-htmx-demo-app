import { Effect } from "effect";
import { Exam, ExamId, ExamName } from "../../domain/exam";

export interface SerializedExam {
  id: string;
  name: string;
}

export const serialize = (exam: Exam.Exam): SerializedExam => ({
  id: exam.id.id,
  name: exam.name.name,
});

export const deserialize = (serialized: SerializedExam) =>
  Effect.gen(function* () {
    return Exam.create(
      yield* ExamId.create(serialized.id),
      yield* ExamName.create(serialized.name)
    );
  });
