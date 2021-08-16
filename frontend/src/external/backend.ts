const request = (
  urlPath: string,
  method?: string,
  headers?: HeadersInit,
  body?: BodyInit | null
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

const get = (urlPath: string) => {
  const headers = {
    // TODO: remove.
    // Authorization: "Token 391c9d7e93915bd170ba3c0e266e2f4274467dac",
  };
  return request(urlPath, "GET", headers);
};

const post = (urlPath: string, data?: unknown) => {
  const headers = {
    // TODO: remove.
    // Authorization: "Token 391c9d7e93915bd170ba3c0e266e2f4274467dac",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(data);
  return request(urlPath, "POST", headers, body);
};

export const registerPosition = (
  ip: string,
  latitude: number,
  longitude: number
): Promise<Response> => {
  const decimalPlaces = 6;
  const data = {
    ip,
    latitude: latitude.toFixed(decimalPlaces),
    longitude: longitude.toFixed(decimalPlaces),
  };
  return post("/positions/", data);
};

export const getUserData = (): Promise<Response> => get("/user/");

export const loadLectures = (): Promise<Response> => get("/lectures/today/");

export const attendLecture = (lectureId: number): Promise<Response> =>
  post(`/lectures/${lectureId}/attend/`);
