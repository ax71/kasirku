import type { CreateMenuForm } from "./validations";

export const INITIAL_CREATE_MENU_FORM: CreateMenuForm = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  category: "",
  is_available: true,
  image: null,
};

export const CATEGORY_LIST = [
  {
    value: "beverages",
    label: "Beverages",
  },
  {
    value: "mains",
    label: "Mains",
  },
];
