import { useState, useCallback } from "react";
import { BASE_URL } from "@/services/APIConfig";

interface ApiResponse {
  message: string;
}

export default function usePost(endpoint: string) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<String>("");
  const [loading, setLoading] = useState<boolean>(false);

  const postData = useCallback(async (body: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error: any) {
      setErrorMsg(`${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, errorMsg, loading, postData };
}
