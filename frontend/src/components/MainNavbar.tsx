import "./MainNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import univaliLogo from "../images/univaliLogo.png";
import Button from "react-bootstrap/Button";
import { User } from "../pages/Home";

interface Props {
  user?: User | null;
}

export default function MainNavbar(props: Props): JSX.Element {
  const logOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getName = () => {
    if (!props.user) {
      return "";
    }

    const firstName = props.user.first_name;
    const lastName = props.user.last_name;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (lastName) {
      return lastName;
    }
    if (firstName) {
      return firstName;
    }
    return "";
  };

  const name = getName();

  return (
    <Navbar className="main-navbar" fixed="top">
      <Navbar.Brand href="/">
        <img
          src={univaliLogo}
          width={104 * 0.8}
          height="auto"
          alt="Univali logo"
        />
      </Navbar.Brand>
      {props.user && (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="navbar-text">
            {name && (
              <>
                <span className="navbar-text__span">{name}</span>
                <br />
              </>
            )}
            <Button
              className="navbar-text__button"
              variant="link"
              onClick={logOut}
            >
              logout
            </Button>
          </Navbar.Text>
        </Navbar.Collapse>
      )}
    </Navbar>
  );
}
