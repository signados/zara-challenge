import { useState, useEffect } from 'react';

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true); 
    setError(null); 

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseJson => {
        setData(responseJson.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error); 
        setLoading(false); 
      });
  }, [url]);

  return { data, loading, error };
}