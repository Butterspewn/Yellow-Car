interface Props {
  image: string | null;
}

// small image for profile pictures.
export function SmallImage(props: Props) {
  return (
    <>
      <img
        className="small-image"
        src={"http://localhost:5000/get/" + props.image}
        alt=""
      />
    </>
  );
}

export default SmallImage;
