import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store: "",
  selectedItemId: "",
  selectedItemPrice: 0,
  selectedItemName: "",
  selectedItemOptions: [],
  selectedCategory: "",
  cartItems: [],
  cartQty: 0,
  cartTotalAmount: 0,
  isCartLoading: false,
  orderSendingStatus: "",
  isLimitMessageActive: false,
};

const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    setStore(state, action) {
      state.store = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSelectedItem(state, action) {
      state.selectedItemId = action.payload;
    },
    resetSelectedItem(state) {
      state.selectedItemId = "";
      state.selectedItemPrice = 0;
      state.selectedItemName = "";
      state.selectedItemOptions = [];
    },
    setSelectedItemPrice(state, action) {
      state.selectedItemPrice = state.selectedItemPrice + action.payload;
    },
    setSelectedItemName(state, action) {
      state.selectedItemName += action.payload;
    },
    editSelectedItemName(state, action) {
      state.selectedItemName = state.selectedItemName.replace(
        action.payload,
        ""
      );
    },
    addItemToCart(state, action) {
      state.isCartLoading = true;
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.name === newItem.name
      );
      state.cartQty++;
      if (!existingItem) {
        state.cartItems.unshift({
          name: newItem.name,
          itemId: newItem.id,
          optionsIds: newItem.options,
          price: newItem.price,
          totalPrice: newItem.price,
          img: newItem.img,
          qty: 1,
        });
        state.cartTotalAmount += newItem.price;
      } else {
        existingItem.qty++;
        existingItem.totalPrice += newItem.price;
        state.cartTotalAmount += newItem.price;
      }
      state.isCartLoading = false;
    },
    removeItemFromCart(state, action) {
      state.isCartLoading = true;
      const name = action.payload;
      state.cartQty--;
      const existingItem = state.cartItems.find((item) => item.name === name);
      existingItem.totalPrice -= existingItem.price;
      state.cartTotalAmount -= existingItem.price;
      if (existingItem.qty === 1) {
        state.cartItems = state.cartItems.filter((item) => item.name !== name);
      } else {
        existingItem.qty--;
      }
      state.isCartLoading = false;
    },
    addSelectedOption(state, action) {
      const newOption = action.payload;
      for (var i = 0; i < state.selectedItemOptions.length; i++) {
        if (state.selectedItemOptions[i] === newOption) {
          state.selectedItemOptions.splice(i, 1);
          i--;
          return;
        }
      }
      state.selectedItemOptions.push(newOption);
    },
    resetCart(state) {
      state.cartItems = [];
      state.cartQty = 0;
      state.cartTotalAmount = 0;
    },
    setOrderSendingStatus(state, action) {
      state.orderSendingStatus = action.payload;
    },
    toggleIsLimitMessageActive(state, action) {
      state.isLimitMessageActive = action.payload;
    },
  },
});

export const posActions = posSlice.actions;
export default posSlice.reducer;
