export const formatDate = (dateAsString: string): string => {
  const date = new Date(dateAsString);
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hourCycle: "h24",
    minute: "2-digit",
    hour: "2-digit",
  };
  return date.toLocaleDateString("ru-RU", options);
};
