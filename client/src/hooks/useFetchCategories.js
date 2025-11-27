import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/api";

export const useFetchCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // optional for error handling

  useEffect(() => {
    let isMounted = true; // prevent memory leaks

    const fetchCategories = async () => {
      try {
        const response = await apiConnector("GET", categories.CATEGORIES_API);
        if (isMounted) setCategoriesList(response.data?.data || []);
      } catch (err) {
        if (isMounted) {
          setError(err);
          setCategoriesList([]);
          console.log("Error fetching categories:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false; // cleanup
    };
  }, []);

  return { categoriesList, loading, error };
};
