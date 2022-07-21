import { Button, Layout, Spin, Typography } from "antd";
import { useAuth } from "hooks/useAuth0Store";
import { FC } from "react";

export const Header: FC = () => {
  const { isLoading, user, isAuthenticated, logout, loginWithPopup } =
    useAuth();
  return (
    <Layout.Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {isAuthenticated ? (
        <>
          <Typography.Text strong style={{ color: "#fff" }}>
            {user?.email}
          </Typography.Text>
          <Button
            type="primary"
            style={{ marginLeft: 12 }}
            onClick={() => logout()}
          >
            Log out
          </Button>
        </>
      ) : isLoading ? (
        <Spin spinning></Spin>
      ) : (
        <Button onClick={() => loginWithPopup()}>Log in</Button>
      )}
    </Layout.Header>
  );
};
