import cors from "cors";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51LL6b8IrIWBmFBVfhkpWfHzm39IzxbMAFFU32ExIMgHAgFd2XMbFMPkPCxSWfIQuAHAkc3pxrCkxVBM8QJXUczy200OLqOTr6q",
  {
    // @ts-ignore
    apiVersion: "2020-08-27;orders_beta=v4",
  }
);

const app = express();

app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const prices = (
    await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ["data.product"],
    })
  ).data.filter((it) => it.type === "one_time");
  res.send(prices);
});

app.post(
  "/create-payment-intent",
  expressjwt({
    secret: "EzAdocOt0BlLcBRGXdhMBb6BF2JJfyxf",
    audience: "https://localhost/subscription",
    issuer: "https://dev-w3aq7ufb.us.auth0.com/",
    algorithms: ["HS256"],
  }),
  async (req: JWTRequest, res) => {
    if (!req.auth?.sub) {
      res.status(401).send("Unauthorized");
      return;
    }
    const item = req.body.item as Stripe.Price;
    try {
      const session = await stripe.orders.create({
        line_items: [
          {
            price: item.id,
            quantity: 1,
          },
        ],
        currency: item.currency,
        metadata: {
          user_id: req.auth?.sub ?? "",
        },
      });
      res.send({
        paymentIntentId: session.id,
        clientSecret: session.client_secret,
      });
    } catch (error: any) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }
);

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig ?? "",
        "whsec_ece028b9d6519835d10ee0179ebf9531432f1d4314fbd8b2dc685b8077e632c3"
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        break;
      default:
        console.log(JSON.stringify(event));
    }
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
