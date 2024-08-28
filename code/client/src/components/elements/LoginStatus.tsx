import SmallImage from "../images/SmallImage";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

// has one of two states. If detected as logged in using info in local storage says logged in as *username* with pfp.
// otherwise says logged out.
function LoginStatus() {
  const username: string | null = localStorage.getItem("username");
  const pfp: string | null = localStorage.getItem("pfp");
  const loggedIn: JSX.Element = (
    <Link to="/profile" className="login-status ms-auto">
      <SmallImage image={pfp} />
      <div className="username-black">{username}</div>
    </Link>
  );
  const loggedOut: JSX.Element = (
    <div className="username-black" style={{ marginRight: "20px" }}>
      Logged Out
    </div>
  );
  let variant: JSX.Element = loggedIn;
  if (!username || !pfp) {
    variant = loggedOut;
  }
  return <>{variant}</>;
}

export default LoginStatus;
