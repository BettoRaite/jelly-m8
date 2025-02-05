export const hasAtLeastOneField = (obj: Record<string, unknown>) =>
  Object.keys(obj).length > 0;
