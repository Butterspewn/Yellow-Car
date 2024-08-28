import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/navigation/Navbar";
import Feed from "./components/pages/Feed";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Profile from "./components/pages/Profile";
import Leaderboard from "./components/pages/Leaderboard";
import TestPage from "./components/pages/TestPage";

function App() {
  // use effect is called when the component is updated. Its second argument is an empty array depicting its dependencies.
  // since the dependecies array is empty it is only called once upon initialisation.
  // this functio checks if you are in the root of the website, if so it sets out to check the uers token to decide if
  // they should be sent to thier feed or the login page.
  useEffect(() => {
    if (window.location.href == "http://localhost:3000/") {
      refreshToken();
    }
  }, []);

  // gets the token from local storage and sends it to server for validation. Sends to feed or login depending on if the
  // token was still valid.
  async function refreshToken() {
    const token: string | null = localStorage.getItem("token");
    await axios
      .post("http://localhost:5000/refresh/token", {
        token: token,
      })
      .then((serverResponse) => {
        localStorage.setItem("token", serverResponse.data);
        window.location.href = "http://localhost:3000/feed";
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 400) {
            localStorage.clear();
            window.location.href = "http://localhost:3000/login";
          } else {
            alert(error.response.data);
          }
        }
      });
  }

  // uses react router to move between pages.
  // debug div for checking what is in local storage.
  return (
    <>
      {/* <div id="debug">
        {"email: " +
          localStorage.getItem("email") +
          " sId: " +
          localStorage.getItem("token") +
          " href: " +
          window.location.href}
      </div> */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
