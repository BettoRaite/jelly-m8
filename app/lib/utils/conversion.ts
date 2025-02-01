export const jsonToFormData = (json: Record<string, string | Blob | File>) => {
  const formData = new FormData();
  for (const key of Object.keys(json)) {
    formData.append(key, json[key]);
  }

  return formData;
};
