import "./Login.css";
import Button from "react-bootstrap/Button";
import { LOGIN_URL } from "../utils/backend";
import { getCurrentPosition } from "../utils/geolocation";

export default function Login(): JSX.Element {
  const handleClick = async () => {
    await getCurrentPosition();
    window.location.replace(LOGIN_URL);
  };

  return (
    <>
      <h1 className="login-header">realize login para continuar</h1>
      <h3 className="login-sub-heading text-muted">
        (acesso à localização necessário)
      </h3>
      <Button className="login-button" onClick={handleClick}>
        login
      </Button>
    </>
  );
}
