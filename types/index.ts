export interface SanityImage {
  _key?: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

export interface SanitySlug {
  _type: string;
  current: string;
}

export interface SanityProduct {
  _id: string;
  name: string;
  price: number;
  details: string;
  slug: SanitySlug;
  image: SanityImage[];
  quantity?: number;
}

export interface CartItem extends SanityProduct {
  quantity: number;
}

export interface SanityBanner {
  _id: string;
  smallText: string;
  midText: string;
  largeText1: string;
  largeText2: string;
  discount: string;
  saleTime: string;
  desc: string;
  product: string;
  buttonText: string;
  image: SanityImage;
}

export interface StateContextType {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantities: number;
  qty: number;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: SanityProduct, quantity: number) => void;
  toggleCartItemQuanitity: (id: string, value: 'inc' | 'dec') => void;
  onRemove: (product: CartItem) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  setTotalQuantities: React.Dispatch<React.SetStateAction<number>>;
}
