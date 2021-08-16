import "./Login.css";
import Button from "react-bootstrap/Button";

export default function Login(): JSX.Element {
  const handleClick = () =>
    window.location.replace(
      `http://${process.env.REACT_APP_BACKEND_DOMAIN}:${process.env.REACT_APP_BACKEND_PORT}/saml2/login/`
    );

  return (
    <>
      <h1 className="login-header">realize login para continuar</h1>
      <Button className="login-button" onClick={handleClick}>
        login
      </Button>
    </>
  );
}
