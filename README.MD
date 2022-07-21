### Stripe 配置说明

- 启用 ordersAPI
  访问 https://dashboard.stripe.com/orders 点击加入 Beta

- 获取 Stripe 相关密钥
  https://dashboard.stripe.com/apikeys

- 设置 Webhooks
  https://dashboard.stripe.com/webhooks

- 使用 Stripe 提供的银行卡测试
  https://stripe.com/docs/testing

- 本地获取 webhoos 信息
  https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local

### 代码测试

- 根目录运行 yarn install
- cd packages/payment-api && yarn dev
- cd packages/payment-client && yarn start
