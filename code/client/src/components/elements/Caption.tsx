// see post for interface explanation.
interface Props {
  username: string;
  text: string;
}

// simple component represents a caption for a post.
function Caption(props: Props) {
  return (
    <div className="caption">
      <div className="comment-username">{props.username}</div>
      <div className="comment-text">{props.text}</div>
    </div>
  );
}

export default Caption;
