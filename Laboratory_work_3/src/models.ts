export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  category: string;
  title: string;
  price: number;
  image: string;
}
