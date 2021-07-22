import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

export default function Profile(): JSX.Element {
  const backendURL = "http://sp-implicit.cafeexpresso.rnp.br:8080";
  const endpointUser = "/api/user/";
  const endpointSamlLogin = "/saml2/login";

  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(backendURL + endpointUser, {
        credentials: "include",
      });
      setUser(await response.json());
    })();
  }, []);

  function login() {
    window.location.replace(backendURL + endpointSamlLogin);
  }

  return (
    <>
      <Button onClick={login}>Login</Button>
      <p>Username: {user.username}</p>
      <p>E-mail: {user.email}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
    </>
  );
}
