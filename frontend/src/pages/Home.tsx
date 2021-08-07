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
  const [ip, setIp] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

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
    (async () => {
      const response = await fetch("https://api64.ipify.org");
      setIp(await response.text());
    })();
  }, []);

  useEffect(() => {
    if (user && ip && latitude && longitude) {
      registerPosition(ip, latitude, longitude);
    }
  }, [user, ip, latitude, longitude]);

  function positionCallback(position: GeolocationPosition): void {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  }

  function positionErrorCallback(
    positionError: GeolocationPositionError
  ): void {
    console.warn(`ERROR(${positionError.code}): ${positionError.message}`);
  }

  const positionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    positionCallback,
    positionErrorCallback,
    positionOptions
  );

  return (
    <>{user === null ? <Spinner animation="border" /> : <SubjectList />}</>
  );
}
