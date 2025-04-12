import { CartItem } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartItem[];
  getTotalItems: () => number;
  getSummaryInformation: () => { subTotal: number; tax: number; total: number; itemsInCart: number };
  addProductToCart: (product: CartItem) => void;
  updateProductQuantity: (product: CartItem, quantity: number) => void;
  removeProductFromCart: (product: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [] as CartItem[],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      getSummaryInformation: () => {
        const { cart } = get();
        const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
        const subTotal = cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
        const tax = subTotal * 0.19;
        const total = subTotal + tax;
        return { subTotal, tax, total, itemsInCart };
      },
      addProductToCart: (product: CartItem) => {
        const { cart } = get();

        // 1. Revisar si el producto existe en el carrito con la talla seleccionada
        const productInCart = cart.some(
          (item) =>
            item.product.id === product.product.id && item.size === product.size
        );

        if (!productInCart) {
          set({
            cart: [...cart, product],
          });
          return;
        }

        // 2. El peoducto ya existe ... hay que incrementarlo
        const updatedCartProducts = cart.map((item) => {
          if (
            item.product.id === product.product.id &&
            item.size === product.size
          ) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
            };
          }
          return item;
        });

        set({
          cart: updatedCartProducts,
        });
      },
      updateProductQuantity: (product: CartItem, quantity: number) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) => {
          if (
            item.product.id === product.product.id &&
            item.size === product.size
          ) {
            return {
              ...item,
              quantity,
            };
          }
          return item;
        });

        set({
          cart: updatedCartProducts,
        });
      },
      removeProductFromCart: (product: CartItem) => {
        const { cart } = get();

        const updatedCartProducts = cart.filter(
          (item) =>
            item.product.id !== product.product.id || item.size !== product.size
        );

        set({
          cart: updatedCartProducts,
        });
      },
      clearCart: () => {
        set({
          cart: [],
        });
      },
    }),
    { name: "shopping-cart" }
  )
);
