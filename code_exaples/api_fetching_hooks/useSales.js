import useSWR from "swr";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";

const fetcher = async (url, aToken, store, start, end) => {
  if (aToken && store) {
    try {
      const response = await axios.get(url, {
        params: { start_date: start, end_date: end },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + aToken,
        },
      });
      const data = await response.data;
      return data;
    } catch (err) {
      const error = new Error("Error");
      error.info = err.response.data.message;
      error.status = err.response.status;
      throw error;
    }
  }
};

function useSales(store, start = "", end = "") {
  var start_date = new Date(start).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  var end_date = new Date(end).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const dispatch = useDispatch();
  const aToken = useSelector((state) => state.auth.aToken);
  const { data, mutate, error } = useSWR(
    [
      `${process.env.NEXT_PUBLIC_API_URL}/store/${store}/sales`,
      aToken,
      store,
      start_date,
      end_date,
    ],
    fetcher,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        console.log(error);
        // Never retry on 404.
        if (error.status === 404) return;

        if (error.status === 401) {
          dispatch(authActions.removeAccessToken());
          return;
        }

        // Only retry up to 10 times.
        if (retryCount >= 5) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  return {
    loading: !data && !error,
    data: data,
    mutate: mutate,
  };
}

export default useSales;
