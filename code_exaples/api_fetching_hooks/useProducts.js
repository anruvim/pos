import useSWR from "swr";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";

const fetcher = async (url, aToken) => {
  if (aToken) {
    try {
      const response = await axios.get(url, {
        params: { key: "" },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + aToken,
        },
      });
      const data = await response;
      return data.data.menu_products;
    } catch (err) {
      const error = new Error("Error");
      error.info = err.response.data.msg;
      error.status = err.response.status;
      throw error;
    }
  }
  const error = new Error("No Access Token Found");
  error.status = 403;
  throw error;
};

export default function useProducts(catId, storeId) {
  const dispatch = useDispatch();
  const aToken = useSelector((state) => state.auth.aToken);
  const { data, mutate, error } = useSWR(
    [
      catId
        ? `${process.env.NEXT_PUBLIC_API_URL}/store/categories/${catId}/items`
        : `${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}/items`,
      aToken,
    ],
    fetcher,
    {
      refreshInterval: 1000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
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
    products: data,
    mutate: mutate,
  };
}
