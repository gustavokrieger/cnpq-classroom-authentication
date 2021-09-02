import { registerPosition } from "./backend";
import { requestIp } from "./network";
import { getCurrentCoordinates } from "./geolocation";

export const getAndRegisterPosition = async (
  options?: PositionOptions
): Promise<Response> => {
  const ip = await getIp();
  const { latitude, longitude } = await getCurrentCoordinates(options);
  return registerPosition(ip, latitude, longitude);
};

const getIp = async () => {
  const response = await requestIp();
  return response.text();
};
