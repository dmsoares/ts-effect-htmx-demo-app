import { Effect } from "effect";
import { Exam, ExamId } from "../../domain";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { OutgoingExamDto } from "./types";

const createOutgoingExamDto = (exam: Exam.Exam): OutgoingExamDto => ({
  id: exam.id.id,
  name: exam.name.name,
});

export const workflow = (id: ExamId.ExamId) =>
  ExamRepository.getById(id).pipe(Effect.map(createOutgoingExamDto));
