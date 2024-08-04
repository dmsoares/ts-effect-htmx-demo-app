import * as CreateExam from "./create-exam";
import * as UpdateExam from "./update-exam";
import * as ListExams from "./list-exams";
import * as GetExam from "./get-exam";
import { Layer } from "effect";

export const CoreWorkflowsLive = Layer.empty.pipe(
  Layer.merge(ListExams.WorkflowLive),
  Layer.merge(CreateExam.WorkflowLive),
  Layer.merge(GetExam.WorkflowLive),
  Layer.merge(UpdateExam.WorkflowLive)
);

export { CreateExam, UpdateExam, ListExams, GetExam };
