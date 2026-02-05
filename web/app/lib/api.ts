export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...Object.fromEntries(new Headers(options.headers).entries()),
    };

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        credentials: "include", // Include cookies for authentication
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || error.error || "An error occurred");
    }

    return res.json();
};
