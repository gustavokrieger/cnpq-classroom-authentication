import "./Home.css";
import { useEffect, useState } from "react";
import Courses from "./Courses";
import { getLastPosition, getUserData } from "../utils/backend";
import MainNavbar from "../components/MainNavbar";
import Container from "react-bootstrap/Container";
import Login from "./Login";
import Spinner from "react-bootstrap/Spinner";
import { DEFAULT_OPTIONS } from "../utils/geolocation";
import { getAndRegisterPosition } from "../utils/general";

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
    const getUserDataJson = async () => {
      const response = await getUserData();
      return response.json();
    };

    const checkForPosition = async (username: string) => {
      const response = await getLastPosition(username);
      if (response.status !== 404) {
        return;
      }

      await getAndRegisterPosition(DEFAULT_OPTIONS);
      window.location.replace(
        `${process.env.REACT_APP_LOGIN_BASE_URL}/saml2/login/?idp=${process.env.REACT_APP_LOGIN_BASE_URL}/idp/shibboleth`
      );
    };

    (async () => {
      setLoading(true);
      const userData = await getUserDataJson();
      await checkForPosition(userData.username);
      setUser(userData);
      setLoading(false);
    })();
  }, []);

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
      <Container className="home-container">{component}</Container>
    </>
  );
}
