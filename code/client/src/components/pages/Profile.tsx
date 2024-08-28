import ImageUpload from "../forms/ImageUpload";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import ImageList from "../lists/ImageList";
import ChangeInfo from "../forms/ChangeInfo";

// returns elements for profile page.
function ProfilePage() {
  // checks if uer is logged in, if not they are sent to login.
  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (!token) {
      window.location.href = "http://localhost:3000/login";
    }
  });
  // removes all infor from session storage to log out.
  function logOut() {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("sessionKey");
    window.location.href = "http://localhost:3000/login";
  }
  // returns forms for image uploads and account info changes. ALso shows all user posted images and a logout button.
  return (
    <>
      <div className="logout-container">
        <Button onClick={logOut}>Log Out</Button>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          <ImageUpload />
          <ChangeInfo />
        </div>
        <div
          className="user-posts-container"
          style={{ marginLeft: "auto", marginRight: "600px" }}
        >
          <ImageList />
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
