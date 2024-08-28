interface Props {
  name: string;
}

// large image for posts.
function LargeImage(props: Props) {
  return (
    <>
      <img
        className="image"
        src={"http://localhost:5000/get/" + props.name}
        alt=""
      />
    </>
  );
}

export default LargeImage;
