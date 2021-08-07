const request = async (
  urlPath: string,
  body?: BodyInit | null,
  headers?: HeadersInit,
  method?: string
) => {
  const input = `http://${process.env.REACT_APP_BACKEND_DOMAIN}:${process.env.REACT_APP_BACKEND_PORT}/api${urlPath}`;
  const init: RequestInit = {
    body: body,
    credentials: "include",
    headers: headers,
    method: method,
  };
  return fetch(input, init);
};

const post = async (urlPath: string, data: unknown) => {
  const body = JSON.stringify(data);
  const headers = {
    // Authorization: "Token f76b30f44ce17dec38e36f50ecadea4c4b5f5b9f",
    "Content-Type": "application/json",
  };
  return request(urlPath, body, headers, "POST");
};

export const registerPosition = async (
  ip: string,
  latitude: number,
  longitude: number
): Promise<Response> => {
  const data = { ip, latitude, longitude };
  return post("/positions/", data);
};
