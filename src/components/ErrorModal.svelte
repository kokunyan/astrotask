<script>
  import { fly, fade } from "svelte/transition";
  import { errorStore, clearError } from "../stores/errorStore";

  const closeModal = () => clearError();
</script>

{#if $errorStore.hasError}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    on:click={closeModal}
    transition:fade
  >
    <div
      class="bg-white rounded-lg p-8 shadow-lg max-w-md w-full relative"
      on:click={(e) => {
        e.stopPropagation();
      }}
      transition:fly={{ y: 20, duration: 200 }}
    >
      <h2 class="text-xl font-semibold mb-4">Error</h2>
      <p class="text-gray-600 mb-6">{$errorStore.message}</p>

      <div class="flex justify-end">
        <button
          on:click={closeModal}
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
