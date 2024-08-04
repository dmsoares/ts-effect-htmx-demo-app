import { Context, Effect, Layer } from "effect";
import { ListExamsWorkflow } from "../../../core/workflows/list-exams";
import { GetExamWorkflow } from "../../../core/workflows/get-exam";
import { CreateExamWorkflow } from "../../../core/workflows/create-exam";
import { UpdateExamWorkflow } from "../../../core/workflows/update-exam";
import { CreateExam, UpdateExam } from "../../../core/workflows";

const listExams = Effect.gen(function* () {
  const listExams = yield* ListExamsWorkflow;
  const exams = yield* listExams;
  return exams.map(({ id, name }) => ({ id: id.id, name: name.name }));
});

const getExam = (incomingId: string) =>
  Effect.gen(function* () {
    const { id, name } = yield* (yield* GetExamWorkflow)(incomingId);
    return { id: id.id, name: name.name };
  });

const createExam = (exam: CreateExam.UnvalidatedExam) =>
  Effect.gen(function* () {
    const { id, name } = yield* (yield* CreateExamWorkflow)(exam);
    return { id: id.id, name: name.name };
  });

const updateExam = (exam: UpdateExam.UnvalidatedExam) =>
  Effect.gen(function* () {
    const { id, name } = yield* (yield* UpdateExamWorkflow)(exam);
    return { id: id.id, name: name.name };
  });

const workflows = {
  listExams,
  getExam,
  createExam,
  updateExam,
};

export class BrowserWorkflows extends Context.Tag("BrowserWorkflows")<
  BrowserWorkflows,
  typeof workflows
>() {
  static readonly Live = Layer.succeed(this, workflows);
}
