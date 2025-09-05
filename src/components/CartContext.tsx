import { createContext, useContext, useState, ReactNode } from "react";
import { menuItems, MenuItem } from "@/data/menuData";

type CartItem = MenuItem & { quantity: number };

type CartContextType = {
  cart: Record<string, number>;
  cartItems: CartItem[];
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const cartItems: CartItem[] = Object.entries(cart)
    .map(([id, quantity]) => {
      const item = menuItems.find((m) => m.id === id);
      return item ? { ...item, quantity } : null;
    })
    .filter((item): item is CartItem => item !== null);

  return (
    <CartContext.Provider
      value={{ cart, cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
