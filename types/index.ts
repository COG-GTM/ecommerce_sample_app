export interface SanityImage {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  details: string;
  image: SanityImage[];
  quantity?: number;
}

export interface Banner {
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

export interface CartItem extends Product {
  quantity: number;
}
