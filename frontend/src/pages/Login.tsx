import "./Login.css";
import Button from "react-bootstrap/Button";
import { LOGIN_URL } from "../utils/backend";

export default function Login(): JSX.Element {
  const handleClick = () => window.location.replace(LOGIN_URL);

  return (
    <>
      <h1 className="login-header">realize login para continuar</h1>
      <Button className="login-button" onClick={handleClick}>
        login
      </Button>
    </>
  );
}
