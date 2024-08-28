import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

// works similarly to other forms. see signup cluster for explanation.
function ImageUpload() {
  async function upload() {
    const imageInput: HTMLInputElement = document.getElementById(
      "imageInput"
    ) as HTMLInputElement;
    const captionInput: HTMLInputElement = document.getElementById(
      "captionInput"
    ) as HTMLInputElement;
    const formData: any = new FormData();
    if (imageInput && captionInput && imageInput.files) {
      const file: any = imageInput.files[0];
      formData.append("image", file);
      formData.append("email", localStorage.getItem("email"));
      formData.append("caption", captionInput.value);
    }
    await axios.post("http://localhost:5000/create/post", formData);
  }

  return (
    <Form
      method="POST"
      action="http://localhost:5000/upload"
      encType="multipart/form-data"
      className="input-cluster"
      style={{ marginLeft: "10px" }}
    >
      <h4 className="input-cluster-title">PUBLIC UPLOAD</h4>
      <Form.Group>
        <Form.Control type="file" id="imageInput" />
      </Form.Group>
      <Form.Group>
        <Form.Control type="text" id="captionInput" placeholder="Caption" />
      </Form.Group>
      <Button onClick={upload}>Upload</Button>
    </Form>
  );
}

export default ImageUpload;
