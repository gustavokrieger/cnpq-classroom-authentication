import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SubjectList from "./pages/SubjectList";
import Coordinates from "./pages/Coordinates";

export default function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/coordinates">
          <Coordinates />
        </Route>
        <Route path="/">
          <SubjectList />
        </Route>
      </Switch>
    </Router>
  );
}
