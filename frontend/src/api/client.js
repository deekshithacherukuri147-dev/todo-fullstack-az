const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000/api";
async function request(url, options = {}) {
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
    get: (url) => request(url),
    post: (url, body) => request(url, {
        method: "POST",
        body: JSON.stringify(body),
    }),
    put: (url, body) => request(url, {
        method: "PUT",
        body: JSON.stringify(body),
    }),
    patch: (url) => request(url, {
        method: "PATCH",
    }),
    delete: (url) => request(url, {
        method: "DELETE",
    }),
};
