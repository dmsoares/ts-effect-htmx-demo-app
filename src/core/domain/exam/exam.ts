import { ExamId } from "./exam-identifier";
import { ExamName } from "./exam-name";

const sym: unique symbol = Symbol("Exam");

export interface Exam {
  readonly [sym]: typeof sym;
  readonly id: ExamId;
  readonly name: ExamName;
}

export const create = (id: ExamId, name: ExamName): Exam => ({
  [sym]: sym,
  id,
  name,
});
