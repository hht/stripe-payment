import { Button, Card } from "antd";
import { FC } from "react";
import _ from "lodash";
export const Product: FC<{ item: Price; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  return (
    <Card
      key={item.id}
      style={{ width: 300, marginRight: 10 }}
      cover={<img alt="example" src="https://picsum.photos/280/320?random=4" />}
      actions={[<Button onClick={onPress}>Purchase Now</Button>]}
    >
      <Card.Meta
        title={item.product.name}
        description={`${item.unit_amount / 100} ${_.upperCase(item.currency)}`}
      />
    </Card>
  );
};
