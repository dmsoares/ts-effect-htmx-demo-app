import { Effect } from "effect";
import { Repository as ExamRepository } from "../../infrastructure/exam";
import { Exam, WorkflowError } from "../../domain";

export const canCreateOrUpdate = (exam: Exam.Exam) =>
  Effect.gen(function* () {
    // this could be done as a constraint in the database
    // but let's imagine it's a business rule that can eventually change
    const sameNameExams = yield* ExamRepository.getByName(exam.name);

    if (sameNameExams.find((e) => e.id.id !== exam.id.id)) {
      return yield* Effect.fail(
        new WorkflowError("Exam with the same name already exists")
      );
    }

    return exam;
  });
