export const LOGIN_URL = `${process.env.REACT_APP_LOGIN_BASE_URL}/saml2/login/`;

// Copied from: https://docs.djangoproject.com/en/3.0/ref/csrf/#ajax
const getCookie = (name: string) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const request = (
  urlPath: string,
  method?: string,
  headers?: HeadersInit,
  body?: BodyInit | null
) => {
  const input = `${process.env.REACT_APP_BACKEND_URL}/api${urlPath}`;
  const init: RequestInit = {
    credentials: "include",
    body,
    headers,
    method,
  };
  return fetch(input, init);
};

const requestWithBody = (urlPath: string, method?: string, body?: unknown) => {
  const headers = {
    // TODO: remove.
    // Authorization: "Token 391c9d7e93915bd170ba3c0e266e2f4274467dac",
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken") || "",
  };
  const bodyJson = JSON.stringify(body);
  return request(urlPath, method, headers, bodyJson);
};

const get = (urlPath: string) => {
  const headers = {
    // TODO: remove.
    // Authorization: "Token 391c9d7e93915bd170ba3c0e266e2f4274467dac",
  };
  return request(urlPath, "GET", headers);
};

const post = (urlPath: string, body?: unknown) =>
  requestWithBody(urlPath, "POST", body);

const put = (urlPath: string, body?: unknown) =>
  requestWithBody(urlPath, "PUT", body);

export const registerPosition = (
  ip: string,
  latitude: number,
  longitude: number
): Promise<Response> => {
  const decimalPlaces = 6;
  const body = {
    ip,
    latitude: latitude.toFixed(decimalPlaces),
    longitude: longitude.toFixed(decimalPlaces),
  };
  return post("/positions/", body);
};

export const getLastPosition = (username: string): Promise<Response> =>
  get(`/users/${username}/last-position/`);

export const getUserData = (): Promise<Response> => get("/users/self/");

export const logOut = (): Promise<Response> => put("/users/self/log-out/");

export const loadLectures = (): Promise<Response> => get("/lectures/today/");

export const attendLecture = (lectureId: number): Promise<Response> =>
  post(`/lectures/${lectureId}/attend/`);
