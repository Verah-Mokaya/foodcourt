export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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


