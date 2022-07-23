interface Price {
  id: string;
  product: {
    name;
  };
  unit_amount: number;
  currency: string;
  type: "one_time" | "recurring";
}
