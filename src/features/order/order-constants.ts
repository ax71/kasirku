export const INITIAL_ORDER = {
  customer_name: "",
  table_id: "",
  status: "",
};

export const INITIAL_ORDER_TAKEAWAY = {
  customer_name: "",
};

export const STATUS_CREATE_ORDER = [
  {
    value: "reserved",
    label: "Reserved",
  },
  {
    value: "process",
    label: "Process",
  },
];

export const FILTER_MENU = [
  {
    value: "",
    label: "All",
  },
  {
    value: "mains",
    label: "Mains",
  },
  {
    value: "desserts",
    label: "Desserts",
  },

  {
    value: "beverages",
    label: "Beverages",
  },
  {
    value: "pastries",
    label: "Pastries",
  },
];
