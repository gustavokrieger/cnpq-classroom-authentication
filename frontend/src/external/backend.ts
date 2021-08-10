const request = async (
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

const get = async (urlPath: string) => {
  const headers = {
    // Authorization: "Token f76b30f44ce17dec38e36f50ecadea4c4b5f5b9f",
  };
  return request(urlPath, "GET", headers);
};

const post = async (urlPath: string, data?: unknown) => {
  const headers = {
    // Authorization: "Token f76b30f44ce17dec38e36f50ecadea4c4b5f5b9f",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(data);
  return request(urlPath, "POST", headers, body);
};

export const registerPosition = async (
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

export const loadLectures = async (): Promise<Response> => {
  return get("/lectures/today/");
};

export const attendLecture = async (lectureId: number): Promise<Response> => {
  return post(`/lectures/${lectureId}/attend/`);
};
