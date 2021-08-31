import "./Unauthorized.css";
import MainNavbar from "../components/MainNavbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

export default function Unauthorized(): JSX.Element {
  const handleClick = () =>
    window.location.replace(
      `${process.env.REACT_APP_LOGIN_BASE_URL}/saml2/login/`
    );

  return (
    <>
      <MainNavbar />
      <Container className="unauthorized-container">
        <h1 className="unauthorized-header">
          foi detectada alteração de posição.
        </h1>
        <h3 className="unauthorized-sub-heading">faça login novamente.</h3>
        <Button className="unauthorized-button" onClick={handleClick}>
          login
        </Button>
      </Container>
    </>
  );
}
