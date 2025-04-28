<script>
  import { createTask } from "../stores/taskStore";
  import { formatDateForInput, formatDateForAPI } from "../utils/dateUtils";
  import LoadingSpinner from "../assets/icons/LoadingSpinner.svg";

  let task = $state({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: formatDateForInput(new Date()),
  });

  let isCreating = $state(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    isCreating = true;
    try {
      const taskToCreate = {
        ...task,
        dueDate: formatDateForAPI(task.dueDate),
      };

      const result = await createTask(taskToCreate);
      if (result.success) {
        task = {
          title: "",
          description: "",
          priority: "MEDIUM",
          dueDate: formatDateForInput(new Date()),
        };
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      isCreating = false;
    }

    return false;
  };
</script>

<div class="bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-xl font-semibold mb-4">Create New Task</h2>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        id="title"
        bind:value={task.title}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        required
        disabled={isCreating}
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="description"
        bind:value={task.description}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        rows="3"
        disabled={isCreating}
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          bind:value={task.priority}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isCreating}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          id="dueDate"
          bind:value={task.dueDate}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
          disabled={isCreating}
        />
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        disabled={isCreating}
      >
        {#if isCreating}
          <span class="inline-flex items-center">
            <img
              src={LoadingSpinner}
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              alt="Loading"
            />
            Creating...
          </span>
        {:else}
          Create Task
        {/if}
      </button>
    </div>
  </form>
</div>
