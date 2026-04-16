export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
