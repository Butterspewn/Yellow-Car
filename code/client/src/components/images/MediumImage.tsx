interface Props {
  name: string;
}

// medium image for user profile.
export function MediumImage(props: Props) {
  return (
    <>
      <img
        className="medium-image"
        src={"http://localhost:5000/get/" + props.name}
        alt=""
        width="200px"
        height="200px"
      />
    </>
  );
}

export default MediumImage;
