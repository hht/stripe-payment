import { message, Modal } from "antd";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useStripeStore } from "hooks/useStripe";
import { useRequest } from "hooks/useRequest";
import { FC } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CONFIG } from "utils/constants";

export const CheckoutForm: FC<{}> = () => {
  const stripe = useStripe();
  const elements = useElements();
  const clientSecret = useStripeStore((state) => state.clientSecret);
  const { loading, run } = useRequest<any>(
    async () => {
      const product = useStripeStore.getState().product;
      if (!stripe || !elements || !product) {
        return;
      }
      if (product.type === "one_time") {
        const { error } = await stripe?.processOrder({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: "if_required",
        });
        if (error) {
          return Promise.reject(error);
        }
      } else {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: "if_required",
        });
        if (error) {
          return Promise.reject(error);
        }
      }
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Payment Successful");
        useStripeStore.setState({
          clientSecret: undefined,
        });
      },
      onError: (e) => message.error(e.message),
    }
  );

  if (!stripe || !elements) {
    return null;
  }

  return (
    <Modal
      visible={!!clientSecret}
      onCancel={() => {
        useStripeStore.setState({
          clientSecret: undefined,
        });
      }}
      okButtonProps={{
        loading: loading,
      }}
      okText="Confirm Payment"
      cancelText="Cancel"
      onOk={() => {
        run();
      }}
    >
      {clientSecret ? <PaymentElement /> : null}
    </Modal>
  );
};

export const StripeForm = () => {
  const stripePromise = loadStripe(CONFIG.STRIPE_PUBLIC_KEY, {
    betas: ["process_order_beta_1"],
    apiVersion: "2020-08-27; orders_beta=v4",
  });
  const { clientSecret } = useStripeStore((state) => state);
  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  ) : null;
};
