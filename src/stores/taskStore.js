import { writable, get } from "svelte/store";
import { actions } from "astro:actions";
import { setError } from "./errorStore";

export const taskStore = writable({
  tasks: [],
  isLoading: false,
});

export async function loadTasks() {
  taskStore.update((state) => ({ ...state, isLoading: true }));

  try {
    const { data, error } = await actions.getTasks();
    if (error) {
      setError(error.message || "Failed to load tasks");
    } else if (data && data.success) {
      taskStore.update((state) => ({ tasks: data.tasks, isLoading: false }));
    }
  } catch (error) {
    setError("An unexpected error occurred while loading tasks");
    taskStore.update((state) => ({ ...state, isLoading: false }));
  }
}

export async function createTask(taskData) {
  const optimisticTask = {
    id: Date.now(),
    ...taskData,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  taskStore.update((state) => ({
    ...state,
    tasks: [...state.tasks, optimisticTask],
  }));

  try {
    const { data, error } = await actions.createTask(taskData);
    if (error) {
      taskStore.update((state) => ({
        ...state,
        tasks: state.tasks.filter((task) => task.id !== optimisticTask.id),
      }));
      setError(error.message || "Failed to create task");
      return { success: false };
    } else if (data && data.success) {
      taskStore.update((state) => ({
        ...state,
        tasks: state.tasks.map((task) => (task.id === optimisticTask.id ? data.task : task)),
      }));
      return { success: true, task: data.task };
    }
  } catch (error) {
    taskStore.update((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== optimisticTask.id),
    }));
    setError("An unexpected error occurred while creating task");
    return { success: false };
  }
}

export async function updateTask(taskData) {
  const taskId = taskData.id;
  const originalTask = get(taskStore).tasks.find((task) => task.id === taskId);

  if (originalTask) {
    taskStore.update((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
      ),
    }));
  }

  try {
    const { data, error } = await actions.updateTask(taskData);
    if (error) {
      if (originalTask) {
        taskStore.update((state) => ({
          ...state,
          tasks: state.tasks.map((task) => (task.id === taskId ? originalTask : task)),
        }));
      }
      setError(error.message || "Failed to update task");
      return { success: false };
    } else if (data && data.success) {
      taskStore.update((state) => ({
        ...state,
        tasks: state.tasks.map((task) => (task.id === taskId ? data.task : task)),
      }));
      return { success: true, task: data.task };
    }
  } catch (error) {
    if (originalTask) {
      taskStore.update((state) => ({
        ...state,
        tasks: state.tasks.map((task) => (task.id === taskId ? originalTask : task)),
      }));
    }
    setError("An unexpected error occurred while updating task");
    return { success: false };
  }
}

export async function deleteTask(taskId) {
  const originalTask = get(taskStore).tasks.find((task) => task.id === taskId);

  if (originalTask) {
    taskStore.update((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  }

  try {
    const { error } = await actions.deleteTask({ id: taskId });
    if (error) {
      if (originalTask) {
        taskStore.update((state) => ({
          ...state,
          tasks: [...state.tasks, originalTask],
        }));
      }
      setError(error.message || "Failed to delete task");
      return { success: false };
    } else {
      return { success: true };
    }
  } catch (error) {
    if (originalTask) {
      taskStore.update((state) => ({
        ...state,
        tasks: [...state.tasks, originalTask],
      }));
    }
    setError("An unexpected error occurred while deleting task");
    return { success: false };
  }
}

export async function toggleTaskCompletion(taskId, completed) {
  const originalTask = get(taskStore).tasks.find((task) => task.id === taskId);

  if (originalTask) {
    taskStore.update((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      ),
    }));
  }

  try {
    const { data, error } = await actions.toggleTaskCompletion({
      id: taskId,
      completed,
    });
    if (error) {
      if (originalTask) {
        taskStore.update((state) => ({
          ...state,
          tasks: state.tasks.map((task) => (task.id === taskId ? originalTask : task)),
        }));
      }
      setError(error.message || "Failed to toggle task completion");
      return { success: false };
    } else if (data && data.success) {
      taskStore.update((state) => ({
        ...state,
        tasks: state.tasks.map((task) => (task.id === taskId ? data.task : task)),
      }));
      return { success: true, task: data.task };
    }
  } catch (error) {
    if (originalTask) {
      taskStore.update((state) => ({
        ...state,
        tasks: state.tasks.map((task) => (task.id === taskId ? originalTask : task)),
      }));
    }
    setError("An unexpected error occurred while toggling task completion");
    return { success: false };
  }
}
