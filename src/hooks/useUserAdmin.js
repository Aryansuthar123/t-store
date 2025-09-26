import useSWR from "swr";
import axios from "axios";

/**
 * Custom hook to fetch admin data using user email
 * @param {Object} param0 
 * @param {string} param0.email - User email
 * @returns {Object} { data, error, isLoading }
 */
export function useUserAdmin({ email }) {
  // fetcher function
  const fetcher = async (url) => {
    const res = await axios.get(url);
    return res.data; // API se json return hona chahiye
  };

  // SWR call (runs only if email exists)
  const { data, error } = useSWR(
    email ? `/api/admin?email=${email}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
