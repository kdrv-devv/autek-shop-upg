import axios from "axios";

interface PropsType {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  params?: object;
  headers?: object;
  body?: object;
}

export const useAxios = () => {
  const response = (props: PropsType) => {
    const { method, url, params, headers, body } = props;
    return axios({
      url: `http://localhost:3000/api/${url}`,
      method,
      data: body,
      params: {
        ...params,
      },
      headers: {
        "Content-Type": "application/json",
        "Accsess-Control-Allow-Origin": true,
        ...headers,
      },
    }).then((data) => data.data);
  };
  return response;
};
