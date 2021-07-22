import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SubjectList from "./pages/SubjectList";
import Home from "./pages/Home";

export default function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/presence">
          <SubjectList />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
