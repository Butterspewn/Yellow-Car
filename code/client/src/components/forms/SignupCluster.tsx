import { useState, useEffect } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";

// form for users to sign up with.
function Signup() {
  let email: string;
  let username: string;
  let password: string;

  // clears all inputs after a failed submission
  function clearInputs() {
    const emailInput: HTMLInputElement = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const usernameInput: HTMLInputElement = document.getElementById(
      "usernameInput"
    ) as HTMLInputElement;
    const passwordInput: HTMLInputElement = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    if (emailInput && usernameInput && passwordInput) {
      emailInput.value = "";
      usernameInput.value = "";
      passwordInput.value = "";
      email = "";
      username = "";
      password = "";
    }
  }

  // sends all form data to corresponding server end point.
  async function submit() {
    await axios
      .post("http://localhost:5000/create/account", {
        email: email,
        username: username,
        password: password,
      })
      .then(() => {
        window.location.href = "http://localhost:3000/login";
      })
      .catch((error) => {
        if (error.response) {
          clearInputs();
          alert(error.response.data);
        }
      });
  }

  // form with inputs that are set to update on change.
  // has a link to login.
  return (
    <Form className="input-cluster absolute">
      <h4 className="input-cluster-title">SIGN UP</h4>
      <Form.Group>
        <Form.Control
          id="emailInput"
          onChange={(e) => {
            email = e.target.value;
          }}
          type="email"
          placeholder="Email"
          style={{ marginBottom: "10px" }}
        />
        <Form.Control
          id="usernameInput"
          onChange={(e) => {
            username = e.target.value;
          }}
          type="username"
          placeholder="Public Username"
          style={{ marginBottom: "10px" }}
        />
        <Form.Control
          id="passwordInput"
          onChange={(e) => {
            password = e.target.value;
          }}
          type="password"
          placeholder="Private Password"
        />
      </Form.Group>
      <Button onClick={submit}>Submit</Button>
      <Form.Group>
        <Form.Label style={{ marginRight: "5px" }}>
          Already have an account?
        </Form.Label>
        <Link to="/login">Login</Link>
      </Form.Group>
    </Form>
  );
}

export default Signup;
