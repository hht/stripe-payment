"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_jwt_1 = require("express-jwt");
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default("sk_test_51LL6b8IrIWBmFBVfhkpWfHzm39IzxbMAFFU32ExIMgHAgFd2XMbFMPkPCxSWfIQuAHAkc3pxrCkxVBM8QJXUczy200OLqOTr6q", {
    // @ts-ignore
    apiVersion: "2020-08-27;orders_beta=v4",
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prices = (yield stripe.prices.list({
        lookup_keys: [req.body.lookup_key],
        expand: ["data.product"],
    })).data.filter((it) => it.type === "one_time");
    res.send(prices);
}));
app.post("/create-payment-intent", (0, express_jwt_1.expressjwt)({
    secret: "EzAdocOt0BlLcBRGXdhMBb6BF2JJfyxf",
    audience: "https://localhost/subscription",
    issuer: "https://dev-w3aq7ufb.us.auth0.com/",
    algorithms: ["HS256"],
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!((_a = req.auth) === null || _a === void 0 ? void 0 : _a.sub)) {
        res.status(401).send("Unauthorized");
        return;
    }
    const item = req.body.item;
    try {
        const session = yield stripe.orders.create({
            line_items: [
                {
                    price: item.id,
                    quantity: 1,
                },
            ],
            currency: item.currency,
            metadata: {
                user_id: (_c = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.sub) !== null && _c !== void 0 ? _c : "",
            },
        });
        res.send({
            paymentIntentId: session.id,
            clientSecret: session.client_secret,
        });
    }
    catch (error) {
        return res.status(400).send({ error: { message: error.message } });
    }
}));
app.post("/webhook", express_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig !== null && sig !== void 0 ? sig : "", "whsec_ece028b9d6519835d10ee0179ebf9531432f1d4314fbd8b2dc685b8077e632c3");
    }
    catch (err) {
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
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
