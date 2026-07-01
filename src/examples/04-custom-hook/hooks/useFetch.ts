import { useState, useEffect } from 'react'

type Data<T> = T | null;
type ErrorType = Error | null;

interface UseFetchResult<T> {
  data: Data<T>;
  loading: boolean;
  error: ErrorType;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<Data<T>>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorType>(null)

  useEffect(() => {
    const abortCtrl = new AbortController()

    setLoading(true);

    async function fetchData(){
      try {
        const response = await fetch(url, { signal: abortCtrl.signal })

        if (!response.ok) {
          throw new Error("Fetch error")
        }

        const jsonData = await response.json();
        setData(jsonData)
        setError(null);
      } catch (err) {
        // Ignore aborts from cleanup (url changed / unmount).
        if ((err as Error).name === 'AbortError') return
        setError(err as Error);
      } finally {
        if (!abortCtrl.signal.aborted) setLoading(false)
      }
    }
    fetchData()

    return () => {
      abortCtrl.abort()
    }
  }, [url])

  return { data, loading, error }
}
