import "./sidebar.css";
import {
  PermIdentity,
  Storefront,
  DynamicFeed,
  Chat
} from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                List Transaction
              </li>
            </Link>
            <Link to="/newUser" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                Add Customer
              </li>
            </Link>
            <Link to="/blast" className="link">
              <li className="sidebarListItem">
                <Chat className="sidebarIcon" />
                Blast
              </li>
            </Link>
            <Link to="/paket" className="link">
              <li className="sidebarListItem">
                <DynamicFeed className="sidebarIcon" />
                Paket
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
