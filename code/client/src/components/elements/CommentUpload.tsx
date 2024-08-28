import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

// see post for interface explanation.
interface Props {
  id: number;
  refresh: Function;
}

// a simple form to be put in the comments section. Takes a function from its parent component
// which allows this component to trigger a frefresh. This means comments appear as you send them.
function CommentUpload(props: Props) {
  let text: string;

  async function submit() {
    if (text) {
      const email: string | null = localStorage.getItem("email");
      if (email) {
        await axios
          .post("http://localhost:5000/create/comment", {
            text: text,
            email: email,
            postId: props.id,
          })
          .catch((error) => {
            if (error.status) {
              alert(error.data);
            }
          });
        const commentInput: HTMLInputElement = document.getElementById(
          "commentInput" + props.id
        ) as HTMLInputElement;
        commentInput.value = "";
        props.refresh();
      } else {
        alert("Email unknown. Cannot post comment.");
      }
    }
  }

  return (
    <div className="comment-upload">
      <Form.Control
        className="comment-upload-input"
        type="text"
        onChange={(e) => {
          text = e.target.value;
        }}
        placeholder="Leave a public comment"
        id={"commentInput" + props.id}
      ></Form.Control>
      <Button onClick={submit}>Post</Button>
    </div>
  );
}

export default CommentUpload;
