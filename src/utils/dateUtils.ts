export const formatDateForInput = (date: Date | string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateForAPI = (date: string | null): string | null => {
  if (!date) return null;
  return `${date}T00:00:00`;
};

export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};
