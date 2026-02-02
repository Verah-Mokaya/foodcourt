export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetcher = async <T>(url: string): Promise<T> => {
      const token =
        typeof window !== "undefined"
            ? localStorage.getItem("fc_token")
            : null;