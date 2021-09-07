import "./MainNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import univaliLogo from "../images/univaliLogo.png";
import Button from "react-bootstrap/Button";

export default function MainNavbar(): JSX.Element {
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
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text className="navbar-text">
          <span className="navbar-text__span">Aluno</span>
          <br />
          <Button className="navbar-text__button" variant="link">
            Logout
          </Button>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}
