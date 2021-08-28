import "./Home.css";
import { useEffect, useState } from "react";
import Courses from "./Courses";
import { getUserData, registerPosition } from "../external/backend";
import MainNavbar from "../components/MainNavbar";
import Container from "react-bootstrap/Container";
import Login from "./Login";
import Spinner from "react-bootstrap/Spinner";

interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function Home(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Readonly<User> | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await getUserData();
      setLoading(false);
      if (response.ok) {
        setUser(await response.json());
      }
    })();
  }, []);

  useEffect(() => {
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

    if (!user) {
      return;
    }
    getAndRegisterPosition();
    const interval = setInterval(getAndRegisterPosition, 60 * 1_000);
    return () => clearInterval(interval);
  }, [user]);

  let component;
  if (loading) {
    component = <Spinner className="loading-spinner" animation="border" />;
  } else if (user) {
    component = <Courses />;
  } else {
    component = <Login />;
  }

  return (
    <>
      <MainNavbar />
      <Container className="container">{component}</Container>
    </>
  );
}
