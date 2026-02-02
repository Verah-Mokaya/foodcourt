export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetcher = async <T>(url: string): Promise<T> => {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("fc_token")
            : null;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${url}`, { headers });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || error.error || "An error occurred");
    }

    return res.json();
};
