export interface SanityProduct {
  _id: string;
  image: any[];
  name: string;
  slug: { current: string };
  price: number;
  details: string;
}

export interface CartItem extends SanityProduct {
  quantity: number;
}

export interface SanityBanner {
  _id: string;
  image: any;
  buttonText: string;
  product: string;
  desc: string;
  smallText: string;
  midText: string;
  largeText1: string;
  largeText2: string;
  discount: string;
  saleTime: string;
}
