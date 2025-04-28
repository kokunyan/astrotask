import { writable } from "svelte/store";

export const errorStore = writable({
  hasError: false,
  message: "",
});

export function setError(message) {
  errorStore.set({
    hasError: true,
    message,
  });
}

export function clearError() {
  errorStore.set({
    hasError: false,
    message: "",
  });
}
