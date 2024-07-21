import { Route } from "../types";
import { listExams, getExam, createExam } from "./exam";

const api: Route[] = [
  ["get", "/exams", listExams],
  ["get", "/exams/:id", getExam],
  ["post", "/exams", createExam],
];

export default api;
