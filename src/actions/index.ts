import { defineAction, ActionError } from "astro:actions";
import { prisma } from "../lib/prisma";
import { TaskSchema, UpdateTaskSchema } from "./validation";

export const server = {
  createTask: defineAction({
    input: TaskSchema,
    handler: async (input) => {
      try {
        const title = input.title as string;
        const description = input.description as string;
        const priority = input.priority as "LOW" | "MEDIUM" | "HIGH";
        const dueDate = input.dueDate as string;

        const taskData = {
          title,
          description,
          priority,
          dueDate: new Date(dueDate),
          completed: false,
        };

        const task = await prisma.task.create({
          data: taskData,
        });

        return { success: true, task };
      } catch (error) {
        console.error("Error creating task:", error);
        return { success: false, error: "Failed to create task" };
      }
    },
  }),
  getTasks: defineAction({
    handler: async () => {
      try {
        const tasks = await prisma.task.findMany({
          orderBy: {
            dueDate: "asc",
          },
        });
        return { success: true, tasks };
      } catch (error) {
        console.error("Error getting tasks:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected error occurred during task query",
        });
      }
    },
  }),
  updateTask: defineAction({
    input: UpdateTaskSchema,
    handler: async (input) => {
      try {
        const id = Number(input.id);
        const title = input.title as string;
        const description = input.description as string;
        const priority = input.priority as "LOW" | "MEDIUM" | "HIGH";
        const dueDate = input.dueDate as string;
        const completed = input.completed;

        const taskData = {
          id,
          title,
          description,
          priority,
          dueDate: new Date(dueDate),
          completed,
        };

        const { id: taskId, ...dataToUpdate } = taskData;

        const task = await prisma.task.update({
          where: { id: taskId },
          data: dataToUpdate,
        });

        return { success: true, task };
      } catch (error) {
        console.error("Error updating task:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected error occurred during task update",
        });
      }
    },
  }),
  deleteTask: defineAction({
    input: UpdateTaskSchema,
    handler: async (input) => {
      const id = Number(input.id);
      try {
        await prisma.task.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting task:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected error occurred during task deletion",
        });
      }
    },
  }),
  toggleTaskCompletion: defineAction({
    input: UpdateTaskSchema,
    handler: async (input) => {
      try {
        const id = Number(input.id);
        const task = await prisma.task.update({
          where: { id },
          data: { completed: !input.completed },
        });
        return { success: true, task };
      } catch (error) {
        console.error("Error toggling task completion:", error);
        return {
          success: false,
          error: "Failed to update task completion status",
        };
      }
    },
  }),
};
