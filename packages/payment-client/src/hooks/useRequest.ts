import { useRequest as useFetch } from "ahooks";
import { Options, Service } from "ahooks/lib/useRequest/src/types";
import { message } from "antd";
import axios, { AxiosResponse } from "axios";
import { CONFIG } from "utils/constants";
import { useAuth0Store } from "./useAuth0Store";

axios.interceptors.request.use(
  (config) => {
    const token = useAuth0Store.getState().accessToken;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    return data;
  },
  (error) => {
    if (error) {
      return Promise.reject(error);
    } else {
      return Promise.resolve({});
    }
  }
);

export const request = async <T>(
  service: string,
  method = "GET",
  params?: any
): Promise<T> => {
  return axios({
    url: `${CONFIG.BASE_URL}/${service}`,
    method,
    ...params,
  }) as unknown as Promise<T>;
};

export const useRequest = <T>(
  service: Service<T, any[]>,
  options?: Options<T, any[]> | undefined
) => {
  return useFetch<T, any[]>(service, {
    throttleWait: 1000,
    onError: (e) => {
      message.error(e.message);
    },
    ...options,
  });
};
