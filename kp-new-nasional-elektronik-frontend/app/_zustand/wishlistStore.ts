import { create } from "zustand";

export type State = {
  wishlist: ProductInWishlist[];
  wishQuantity: number;
};

export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,
  addToWishlist: (product) => {
    set((state) => {
      const productInWishlist = state.wishlist.find(
        (item) => product.id === item.id
      );

      if (productInWishlist === undefined) {
        const newWishlist = [...state.wishlist, product];
        return {
          wishlist: newWishlist,
          wishQuantity: newWishlist.length
        };
      } else {
        return {
          wishlist: [...state.wishlist],
          wishQuantity: state.wishlist.length
        };
      }
    });
  },
  removeFromWishlist: (id) => {
    set((state) => {
      const newWishlist = state.wishlist.filter((item) => item.id !== id);
      return {
        wishlist: newWishlist,
        wishQuantity: newWishlist.length
      };
    });
  },
  setWishlist: (wishlist: ProductInWishlist[]) => {
    set({
      wishlist: [...wishlist],
      wishQuantity: wishlist.length
    });
  },
}));
