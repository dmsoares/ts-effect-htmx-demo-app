import { z } from "zod";

export const zIncomingExamDto = z.object({
  id: z.string(),
  name: z.string(),
});

export type IncomingExamDto = z.infer<typeof zIncomingExamDto>;

export type OutgoingExamDto = {
  id: string;
  name: string;
};

export type UnvalidatedExam = {
  id: string;
  name: string;
};
