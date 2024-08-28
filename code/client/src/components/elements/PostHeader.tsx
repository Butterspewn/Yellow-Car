import SmallImage from "../images/SmallImage";

// see post for interface explanation.
interface Props {
  username: string | null;
  pfp: string | null;
}

// the header of a post containing the users's name and pfp.
function PostHeader(props: Props) {
  return (
    <>
      <div className="header">
        <SmallImage image={props.pfp} />
        <div className="username-primary">{props.username}</div>
      </div>
    </>
  );
}

export default PostHeader;
