import "./MainNavbar.css";
import Navbar from "react-bootstrap/Navbar";
import univaliLogo from "../images/univaliLogo.png";

export default function MainNavbar(): JSX.Element {
  return (
    <Navbar className="navbar" fixed="top">
      <Navbar.Brand href="/">
        <img src={univaliLogo} width="104" height="71" alt="Univali logo" />
      </Navbar.Brand>
    </Navbar>
  );
}
