import "./Home.css";
import { useEffect, useState } from "react";
import Courses from "./Courses";
import { getUserData } from "../external/backend";
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
