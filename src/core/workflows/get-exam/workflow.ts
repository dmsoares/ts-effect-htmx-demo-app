import { Effect } from "effect";
import { Exam, ExamId } from "../../domain";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { OutgoingExamDto } from "./types";

const createOutgoingExamDto = (exam: Exam.Exam): OutgoingExamDto => ({
  id: exam.id.id,
  name: exam.name.name,
});

export const workflow = (id: string) =>
  ExamId.create(id)
    .pipe(Effect.flatMap(ExamRepository.getById))
    .pipe(Effect.map(createOutgoingExamDto));
