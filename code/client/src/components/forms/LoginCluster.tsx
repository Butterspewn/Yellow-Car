import { useState, useEffect } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import { Link } from "react-router-dom";

// works the smae way as the input cluster but with different fields.
function Login() {
  let email: string;
  let password: string;

  function clearInputs() {
    const emailInput: HTMLInputElement = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const passwordInput: HTMLInputElement = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    if (emailInput && passwordInput) {
      emailInput.value = "";
      passwordInput.value = "";
      email = "";
      password = "";
    }
  }

  async function submit() {
    console.log("email", email, "\npassword", password);
    await axios
      .post("http://localhost:5000/login", {
        email: email,
        password: password,
      })
      .then((serverResponse) => {
        console.log("then");
        localStorage.setItem("email", email);
        localStorage.setItem("token", serverResponse.data.token);
        localStorage.setItem("username", serverResponse.data.username);
        localStorage.setItem("pfp", serverResponse.data.pfp);
        window.location.href = "http://localhost:3000/feed";
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          clearInputs();
          alert(error.response.data);
        }
      });
  }

  // has a link to signup.
  return (
    <Form className="input-cluster absolute">
      <h4 className="input-cluster-title">LOGIN</h4>
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
          id="passwordInput"
          onChange={(e) => {
            password = e.target.value;
          }}
          type="password"
          placeholder="Password"
        />
      </Form.Group>
      <Button onClick={submit}>Submit</Button>
      <Form.Group>
        <Form.Label style={{ marginRight: "5px" }}>
          Don't have an account?
        </Form.Label>
        <Link to="/signup">Sign Up</Link>
      </Form.Group>
    </Form>
  );
}

export default Login;
