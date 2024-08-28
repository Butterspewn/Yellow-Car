// see post for interface explanation.
interface Props {
  username: string;
  text: string;
}

// simple components represents one comment.
function Comment(props: Props) {
  return (
    <>
      <div className="comment">
        <div className="comment-username">{props.username}:</div>
        <div className="comment-text">{props.text}</div>
      </div>
    </>
  );
}

export default Comment;
