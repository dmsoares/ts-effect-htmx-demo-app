import { Effect } from "effect";
import { ExamId } from "../../domain";
import { Repository as ExamRepository } from "../../infrastructure/exam";

export const workflow = (id: string) =>
  ExamId.create(id).pipe(Effect.flatMap(ExamRepository.getById));
