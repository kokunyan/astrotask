<script>
  import {
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } from "../stores/taskStore";
  import {
    formatDateForInput,
    formatDateForDisplay,
    formatDateForAPI,
  } from "../utils/dateUtils";

  let { task } = $props();
  let isEditing = $state(false);
  let editedTask = $derived({ ...task });

  let dueDateInput = $state(() => formatDateForInput(task.dueDate));

  let isUpdating = $state(false);
  let isDeleting = $state(false);

  const priorityClass = $derived((task) =>
    task.priority === "HIGH"
      ? "bg-red-100"
      : task.priority === "MEDIUM"
        ? "bg-yellow-100"
        : "bg-green-100"
  );

  const completedClass = $derived((task) =>
    task.completed ? "line-through opacity-50" : ""
  );

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const onCompleteTask = async (task) => {
    await toggleTaskCompletion(task.id, task.completed);
  };

  const onDeleteTask = async (task) => {
    isDeleting = true;
    await deleteTask(task.id);
    isDeleting = false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    isUpdating = true;

    editedTask.dueDate = formatDateForAPI(dueDateInput);

    await updateTask(editedTask);
    isUpdating = false;
    isEditing = false;
    return false;
  };
</script>

<div
  class={`p-4 mb-4 border rounded-lg shadow-sm ${priorityClass} ${completedClass} ${isUpdating || isDeleting ? "opacity-70" : ""}`}
>
  {#if isEditing}
    <form onsubmit={handleSubmit} class="space-y-3">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700"
          >Title</label
        >
        <input
          type="text"
          id="title"
          bind:value={editedTask.title}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700"
          >Description</label
        >
        <textarea
          id="description"
          bind:value={editedTask.description}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700"
          >Priority</label
        >
        <select
          id="priority"
          bind:value={editedTask.priority}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700"
          >Due Date</label
        >
        <input
          type="date"
          id="dueDate"
          bind:value={dueDateInput}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          onclick={() => (isEditing = false)}
          class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          disabled={isUpdating}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isUpdating}
        >
          {#if isUpdating}
            <span class="inline-flex items-center">
              Saving...
            </span>
          {:else}
            Save
          {/if}
        </button>
      </div>
    </form>
  {:else}
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-lg font-medium">{task.title}</h3>
        <p class="text-gray-600 mt-1">{task.description}</p>
        <div class="mt-2 flex items-center space-x-4 text-sm">
          <span class="flex items-center">
            {formatDateForDisplay(task.dueDate)}
          </span>
          <span class="flex items-center">
            {task.priority}
          </span>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          onclick={() => onCompleteTask(task)}
          class={`cursor-pointer p-2 rounded-full hover:bg-gray-100 ${task.completed ? "text-green-600" : "text-gray-400"}`}
          title={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>

        <button
          onclick={() => (isEditing = true)}
          class="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-blue-600"
          title="Edit task"
          disabled={isUpdating || isDeleting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onclick={() => onDeleteTask(task)}
          class="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-red-600"
          title="Delete task"
          disabled={isDeleting || isUpdating}
        >
          {#if isDeleting}
            <svg
              class="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>
