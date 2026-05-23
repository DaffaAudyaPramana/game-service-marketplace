export type CartItem = {
  id: string;
  productId?: number;
  service: string;
  name: string;
  price: number;
  quantity: number;
};

const CART_KEY = "hyperindo_cart";

export const parseRupiah = (value: string | number) => {
  if (typeof value === "number") return value;

  return Number(String(value || "").replace(/\D/g, ""));
};

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
};

export const addToCart = (item: {
  productId?: number;
  service: string;
  name: string;
  price: string | number;
}) => {
  const price = parseRupiah(item.price);
  const id = item.productId
    ? `product-${item.productId}`
    : `${item.service}-${item.name}-${price}`;

  const current = getCart();
  const existing = current.find((cartItem) => cartItem.id === id);

  if (existing) {
    const updated = current.map((cartItem) =>
      cartItem.id === id
        ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          }
        : cartItem
    );

    saveCart(updated);
    return updated;
  }

  const updated = [
    ...current,
    {
      id,
      productId: item.productId,
      service: item.service,
      name: item.name,
      price,
      quantity: 1,
    },
  ];

  saveCart(updated);
  return updated;
};

export const updateCartQuantity = (id: string, quantity: number) => {
  const safeQuantity = Math.max(1, quantity);

  const updated = getCart().map((item) =>
    item.id === id
      ? {
          ...item,
          quantity: safeQuantity,
        }
      : item
  );

  saveCart(updated);
  return updated;
};

export const removeCartItem = (id: string) => {
  const updated = getCart().filter((item) => item.id !== id);
  saveCart(updated);
  return updated;
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};