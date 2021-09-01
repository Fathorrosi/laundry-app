import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import NewUser from "./pages/newUser/NewUser";
import DetailTransaction from "./pages/detailTransaction/DetailTransaction";
import Blast from "./pages/blast/Blast";
import Paket from "./pages/paket/Paket";

function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Switch>
          <Route exact path="/">
            <UserList />
          </Route>
          <Route path="/users">
            <UserList />
          </Route>
          <Route path="/detail/:userId">
            <DetailTransaction />
          </Route>
          <Route path="/newUser">
            <NewUser />
          </Route>
          <Route path="/blast">
            <Blast />
          </Route>
          <Route path="/paket">
            <Paket />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
