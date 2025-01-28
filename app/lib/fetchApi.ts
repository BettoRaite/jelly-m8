export const fetchApi = async (url: string, options: RequestInit) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${await response.text()}`);
  }
  return await response.json();
};
