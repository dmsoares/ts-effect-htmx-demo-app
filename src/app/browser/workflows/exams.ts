import { Effect } from "effect";
import {
  CreateExam,
  GetExam,
  ListExams,
  UpdateExam,
} from "../../../core/workflows";

const listExams = ListExams.workflow.pipe(
  Effect.map((exams) =>
    exams.map(({ id, name }) => ({ id: id.id, name: name.name }))
  )
);

const getExam = (id: string) =>
  GetExam.workflow(id).pipe(
    Effect.map(({ id, name }) => ({ id: id.id, name: name.name }))
  );

const createExam = (exam: CreateExam.UnvalidatedExam) =>
  CreateExam.workflow(exam).pipe(
    Effect.map(({ id, name }) => ({ id: id.id, name: name.name }))
  );

const updateExam = (exam: UpdateExam.UnvalidatedExam) =>
  UpdateExam.workflow(exam).pipe(
    Effect.map(({ id, name }) => ({ id: id.id, name: name.name }))
  );

export default {
  listExams,
  getExam,
  createExam,
  updateExam,
};
