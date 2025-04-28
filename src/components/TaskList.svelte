<script>
  import { taskStore, loadTasks } from "../stores/taskStore";
  import TaskItem from "./TaskItem.svelte";

  $effect(async () => {
    await loadTasks();
  });

  let filterPriority = $state("ALL");
  let filterStatus = $state("ALL");

  let tasks = $derived($taskStore.tasks);
  let isLoading = $derived($taskStore.isLoading);

  let filteredTasks = $derived(
    tasks.filter((task) => {
      const priorityMatch = filterPriority === "ALL" || task.priority === filterPriority;
      const statusMatch =
        filterStatus === "ALL" ||
        (filterStatus === "COMPLETED" && task.completed) ||
        (filterStatus === "ACTIVE" && !task.completed);
      return priorityMatch && statusMatch;
    })
  );
</script>

<div class="space-y-6">
  <div class="bg-white p-4 rounded-lg shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h2 class="text-xl font-semibold mb-4 md:mb-0">
        Tasks ({filteredTasks.length})
      </h2>

      <div class="flex flex-col md:flex-row gap-3">
        <div>
          <label for="filterPriority" class="block text-sm font-medium text-gray-700 mb-1"
            >Priority</label
          >
          <select
            id="filterPriority"
            bind:value={filterPriority}
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label for="filterStatus" class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            id="filterStatus"
            bind:value={filterStatus}
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ALL">All Tasks</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="bg-white p-8 rounded-lg shadow-sm text-center">
      <p class="text-gray-500">Loading tasks...</p>
    </div>
  {:else if filteredTasks.length === 0}
    <div class="bg-white p-8 rounded-lg shadow-sm text-center">
      <p class="text-gray-500">No tasks match the current filters.</p>
    </div>
  {:else}
    {#each filteredTasks as task (task.id)}
      <TaskItem {task} />
    {/each}
  {/if}
</div>
