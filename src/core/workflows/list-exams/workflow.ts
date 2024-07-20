import { Effect } from "effect";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { Exam } from "../../domain";
import { OutgoingExamsDto } from "./types";

const createOutgoingExamsDto = (exams: Exam.Exam[]): OutgoingExamsDto =>
  exams.map((exam) => ({
    id: exam.id.id,
    name: exam.name.name,
  }));

export const workflow = ExamRepository.getAll().pipe(
  Effect.map(createOutgoingExamsDto)
);
