import { useState, useEffect } from "react";
import axios from "axios";

import Post from "../elements/Post";

// works pretty much identially to the other lists. See rank list for explanation.
function PostList() {
  let components: any[] = [];
  const [renderList, setRenderList] = useState<any[]>([]);

  useEffect(() => {
    getFeed();
  }, []);

  async function getFeed() {
    await axios
      .get("http://localhost:5000/get/posts/all")
      .then((serverResponse) => {
        const posts: Record<string, any>[] = serverResponse.data;
        for (let i = 0; i < posts.length; i++) {
          components.push(
            <Post
              key={posts[i].id}
              id={posts[i].id}
              image={posts[i].image}
              caption={posts[i].caption}
              username={posts[i].username}
              pfp={posts[i].pfp}
            />
          );
        }
        setRenderList(components);
        console.log(renderList);
      })
      .catch((error) => {
        if (error.response) {
          alert(error.data);
        }
      });
  }

  return <div>{renderList}</div>;
}

export default PostList;
