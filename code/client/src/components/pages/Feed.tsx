import PostList from "../lists/PostList";
import { useState, useEffect } from "react";

// shows all posts
function Feed() {
  // check if logged in, if not send to login.
  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (!token) {
      window.location.href = "http://localhost:3000/login";
    }
  });
  return <PostList />;
}

export default Feed;
