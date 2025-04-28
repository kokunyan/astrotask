import { z } from "zod";
import { isValidDate } from "../utils/dateUtils";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z
    .string()
    .refine((date) => !date || isValidDate(date), {
      message: "Invalid date format",
    })
    .refine(
      (date) => {
        if (!date) return true;
        const taskDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return taskDate >= today;
      },
      {
        message: "Due date cannot be in the past",
      }
    ),
  completed: z.boolean().default(false),
});

export const UpdateTaskSchema = TaskSchema.partial().extend({
  id: z.number(),
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
