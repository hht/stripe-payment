import { Layout, message, Skeleton } from "antd";
import { StripeForm } from "components/CheckoutForm";
import { Header } from "components/Header";
import { Product } from "components/Product";
import { useAuth } from "hooks/useAuth0Store";
import { request, useRequest } from "hooks/useRequest";
import { useProducts, useStripeStore } from "hooks/useStripe";
import { FC } from "react";

export const App: FC = () => {
  const { loading, procucts } = useProducts();
  const { isAuthenticated, loginWithPopup } = useAuth();
  const { run } = useRequest<{
    clientSecret: string;
  }>(
    (item: Price) =>
      request("create-payment-intent", "POST", {
        data: {
          item,
        },
      }),
    {
      manual: true,
      onSuccess: ({ clientSecret }) => {
        useStripeStore.setState({ clientSecret });
      },
      onError: (e) => message.error(e.message),
    }
  );
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout.Content style={{ padding: 12 }}>
        {loading ? (
          <Skeleton />
        ) : (
          procucts?.map((product) => (
            <Product
              key={product.id}
              onPress={() => {
                if (isAuthenticated) {
                  run(product);
                } else {
                  loginWithPopup();
                }
              }}
              item={product}
            />
          ))
        )}
      </Layout.Content>
      <StripeForm />
    </Layout>
  );
};
