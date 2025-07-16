export interface CartTotalsProps {
  currency: string;
  product_price: number;
  delivery_price: number;
  total_price: number;
}

export interface CartItemsProps {
  id: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    parcel: string;
    date: string;
  };
  products: {
    id: string;
    thumbnail: string;
    brand: string;
    title: string;
    size: string;
    color: string;
    price: number;
    originalPrice: number;
    currency: string;
  }[];
  delivery_price: number;
  currency: string;
}

export interface Cart {
  totals: CartTotalsProps;
  items: CartItemsProps[];
}
