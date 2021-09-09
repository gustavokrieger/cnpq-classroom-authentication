import "./Logout.css";
import MainNavbar from "../components/MainNavbar";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { useEffect } from "react";
import { logOut } from "../utils/backend";
import { useHistory } from "react-router-dom";

export default function Logout(): JSX.Element {
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await logOut();
      history.push("/");
    })();
  }, [history]);

  return (
    <>
      <MainNavbar />
      <Container className="logout-container">
        <Spinner className="logout-spinner" animation="border" />
      </Container>
    </>
  );
}
