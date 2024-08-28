import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import LoginStatus from "../elements/LoginStatus";
import Button from "react-bootstrap/Button";

// navbar present on all pages.
function NavbarComp() {
  // uses use state hook to keep track of the login status. If it changes the component is refreshed.
  const [message, setMessage] = useState("Logged Out");
  const username: string | null = localStorage.getItem("username");
  const pfp: string | null = localStorage.getItem("pfp");

  // if there is a username stored it says logged in.
  useEffect(() => {
    let username: string | null = window.localStorage.getItem("username");
    if (username) {
      setMessage("Logged in as: " + username);
    }
  });

  // has a logo, button to go to leaderboard and the login status. The logo is used to go to the feed.
  return (
    <Navbar bg="primary">
      <Container className="logo">
        <Navbar.Brand href="/feed">
          <img
            src={process.env.PUBLIC_URL + "/images/LogoTitle.png"}
            alt=""
            height="40"
          />
        </Navbar.Brand>
        <Button
          onClick={() => {
            window.location.href = "http://localhost:3000/leaderboard";
          }}
          style={{ marginRight: "auto" }}
        >
          Leaderboard
        </Button>
      </Container>
      <LoginStatus />
    </Navbar>
  );
}

export default NavbarComp;
