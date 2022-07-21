import { useAuth0, User } from "@auth0/auth0-react";
import { useEffect } from "react";
import create from "zustand";

interface Auth0Store {
  accessToken?: string;
  user?: User;
}

export const useAuth0Store = create<Auth0Store>((set) => ({}));

export const useAuth = () => {
  const {
    isLoading,
    error,
    isAuthenticated,
    loginWithPopup,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((accessToken) =>
        useAuth0Store.setState({ accessToken, user })
      );
    } else {
      useAuth0Store.setState({ accessToken: undefined, user: undefined });
    }
  }, [isAuthenticated]);
  return {
    isLoading,
    isAuthenticated,
    loginWithPopup,
    logout,
    user,
    getAccessTokenSilently,
  };
};
