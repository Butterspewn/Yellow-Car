import PostHeader from "./PostHeader";
import LargeImage from "../images/LargeImage";
import CommentList from "../lists/CommentList";

// interface to allow information to be passed between different components. Some information like id
// is needed for server requests.
interface Props {
  id: number;
  image: string;
  caption: string;
  username: string;
  pfp: string;
}

// a post containing and image, the poster, and a comments section.
function Post(props: Props) {
  return (
    <div className="post">
      <PostHeader username={props.username} pfp={props.pfp} />
      <LargeImage name={props.image} />
      <CommentList
        id={props.id}
        username={props.username}
        caption={props.caption}
      />
    </div>
  );
}

export default Post;
