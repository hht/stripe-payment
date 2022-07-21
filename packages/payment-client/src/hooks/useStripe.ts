import create from "zustand";
import { request, useRequest } from "./useRequest";

interface StripeStore {
  clientSecret?: string;
  paymentIntentId?: string;
}

export const useStripeStore = create<StripeStore>((set) => ({}));

export const useProducts = () => {
  const { loading, data } = useRequest<Price[]>(() => request("products"));
  return { loading, procucts: data };
};
