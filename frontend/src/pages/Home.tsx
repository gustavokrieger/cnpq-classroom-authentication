import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import SubjectList from "./SubjectList";

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
        `http://${process.env.DOMAIN}:${process.env.BACKEND_HOST_PORT}/api/lectures/today/`,
        { credentials: "include" }
      );
      if (response.status === 403) {
        window.location.replace(
          `http://${process.env.DOMAIN}:${process.env.BACKEND_HOST_PORT}/saml2/login/`
        );
      }
      setUser(await response.json());
    })();
  }, []);

  return (
    <>{user === null ? <Spinner animation="border" /> : <SubjectList />}</>
  );
}
