const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000/api";

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (url: string) => request(url),

  post: (url: string, body: unknown) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (url: string, body: unknown) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (url: string) =>
    request(url, {
      method: "PATCH",
    }),

  delete: (url: string) =>
    request(url, {
      method: "DELETE",
    }),
};
