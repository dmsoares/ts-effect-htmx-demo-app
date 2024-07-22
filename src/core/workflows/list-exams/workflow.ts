import { Repository as ExamRepository } from "../../infrastructure/exam";

export const workflow = ExamRepository.getAll();
