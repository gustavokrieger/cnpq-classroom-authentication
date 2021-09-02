export const DEFAULT_OPTIONS: Readonly<PositionOptions> = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getCurrentCoordinates = async (
  options?: PositionOptions
): Promise<Coordinates> => {
  const position = await getCurrentPosition(options);
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
};

const getCurrentPosition = (
  options?: PositionOptions
): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
