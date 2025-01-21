export interface Boost {
  id: number;
  name: string;
  amount: number;
}

export interface ShopItem {
  id: number;
  text: string;
  description: string;
  type: string;
  price: number;
  tonPrice: number;
  amount: number;
  requiredLeague: number;
  blocked: boolean;
}
