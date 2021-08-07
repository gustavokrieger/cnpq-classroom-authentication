import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import SubjectList from "./SubjectList";
import { registerPosition } from "../external/backend";

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function Home(): JSX.Element {
  const [user, setUser] = useState<Readonly<User> | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://${process.env.REACT_APP_BACKEND_DOMAIN}:${process.env.REACT_APP_BACKEND_PORT}/api/lectures/today/`,
        { credentials: "include" }
      );
      if (response.status === 403) {
        window.location.replace(
          `http://${process.env.REACT_APP_BACKEND_DOMAIN}:${process.env.REACT_APP_BACKEND_PORT}/saml2/login/`
        );
      }
      setUser(await response.json());
    })();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = setInterval(() => getAndRegisterPosition(), 5_000);

    const getAndRegisterPosition = async () => {
      const ip = await getIp();
      const [latitude, longitude] = await getCoordinates();
      await registerPosition(ip, latitude, longitude);
    };

    const getIp = async () => {
      const response = await fetch("https://api64.ipify.org");
      return response.text();
    };

    const getCoordinates = async () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      const position = await getCurrentPosition(options);
      return [position.coords.latitude, position.coords.longitude];
    };

    const getCurrentPosition = (
      options?: PositionOptions
    ): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      );

    return () => clearInterval(interval);
  }, [user]);

  return (
    <>{user === null ? <Spinner animation="border" /> : <SubjectList />}</>
  );
}
