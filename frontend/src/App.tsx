import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Coordinates from "./pages/Coordinates";
import Home from "./pages/Home";

export default function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/coordinates">
          <Coordinates />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
