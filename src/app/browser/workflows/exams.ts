import { Context, Effect, Layer } from "effect";
import { ListExamsWorkflow } from "../../../core/workflows/list-exams";
import { GetExamWorkflow } from "../../../core/workflows/get-exam";
import { CreateExamWorkflow } from "../../../core/workflows/create-exam";
import { UpdateExamWorkflow } from "../../../core/workflows/update-exam";
import { CreateExam, UpdateExam } from "../../../core/workflows";

const make = Effect.gen(function* () {
  const listExamsWorkflow = yield* ListExamsWorkflow;
  const getExamWorkflow = yield* GetExamWorkflow;
  const createExamWorkflow = yield* CreateExamWorkflow;
  const updateExamWorkflow = yield* UpdateExamWorkflow;

  const listExams = Effect.gen(function* () {
    const exams = yield* listExamsWorkflow;
    return exams.map(({ id, name }) => ({ id: id.id, name: name.name }));
  });

  const getExam = (incomingId: string) =>
    Effect.gen(function* () {
      const { id, name } = yield* getExamWorkflow(incomingId);
      return { id: id.id, name: name.name };
    });

  const createExam = (exam: CreateExam.UnvalidatedExam) =>
    Effect.gen(function* () {
      const { id, name } = yield* createExamWorkflow(exam);
      return { id: id.id, name: name.name };
    });

  const updateExam = (exam: UpdateExam.UnvalidatedExam) =>
    Effect.gen(function* () {
      const { id, name } = yield* updateExamWorkflow(exam);
      return { id: id.id, name: name.name };
    });

  return {
    listExams,
    getExam,
    createExam,
    updateExam,
  };
});

export class BrowserWorkflows extends Context.Tag("BrowserWorkflows")<
  BrowserWorkflows,
  Effect.Effect.Success<typeof make>
>() {}

export const BrowserWorkflowsLive = Layer.effect(BrowserWorkflows, make);
