import axios from "axios";
import { posActions } from "./pos-slice";
import { orderActions } from "./order-slice";
import { showToast } from "./ui-actions";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const sendCartData = (token, storeId, cart) => {
  return async (dispatch) => {
    dispatch(posActions.setOrderSendingStatus("l"));

    const sendRequest = async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/store/submit_order`,
        {
          store_id: storeId,
          products: cart.map((i) => ({
            menu_product_id: i.itemId,
            option_ids: i.optionsIds,
            quantity: i.qty,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.data;
      return response.data.order_id;
    };
    try {
      const processingOrderId = await sendRequest();
      dispatch(posActions.setOrderSendingStatus("s"));
      dispatch(orderActions.setProcessingOrderId(processingOrderId));
      dispatch(posActions.resetCart());
      await delay(1000);
      dispatch(posActions.setOrderSendingStatus(""));
    } catch (err) {
      dispatch(posActions.setOrderSendingStatus("e"));
      dispatch(
        showToast(
          "error",
          err.response
            ? `${err.response.status}: ${err.response.data.message}`
            : err.message
        )
      );
      await delay(1000);
      dispatch(posActions.setOrderSendingStatus(""));
    }
  };
};

export const addItemToCart = (item, cartTotal, ssm, limit, message) => {
  return async (dispatch) => {
    if (!ssm) dispatch(posActions.addItemToCart(item));
    else if (item.price + cartTotal > limit) {
      dispatch(showToast("error", message));
    } else dispatch(posActions.addItemToCart(item));
  };
};

export const limitErrorMessage = () => {
  return async (dispatch) => {
    dispatch(posActions.toggleIsLimitMessageActive(true));
    await delay(4000);
    dispatch(posActions.toggleIsLimitMessageActive(false));
  };
};
export default sendCartData;
