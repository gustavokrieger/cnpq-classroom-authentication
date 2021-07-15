import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SubjectList from "./pages/SubjectList";

export default function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <SubjectList />
        </Route>
      </Switch>
    </Router>
  );
}
