const normalizeBaseUrl = () => {
    const raw = import.meta.env.VITE_API_BASE_URL?.trim();
    const fallback = "http://localhost:4000/api";
    if (!raw)
        return fallback;
    const trimmed = raw.replace(/\/+$/, "");
    if (trimmed.endsWith("/api"))
        return trimmed;
    return `${trimmed}/api`;
};
const BASE_URL = normalizeBaseUrl();
async function request(url, options = {}) {
    const res = await fetch(`${BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });
    if (!res.ok) {
        let message = `API error: ${res.status}`;
        try {
            const data = await res.json();
            if (data?.message)
                message = data.message;
        }
        catch {
            // ignore parse errors; keep default message
        }
        throw new Error(message);
    }
    if (res.status === 204)
        return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json"))
        return null;
    const text = await res.text();
    if (!text)
        return null;
    return JSON.parse(text);
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
