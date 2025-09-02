export const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    const d = new Date(value);
    return d.toLocaleString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};
