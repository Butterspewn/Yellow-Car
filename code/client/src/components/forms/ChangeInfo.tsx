import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

// works similarly to other forms. see signup cluster for explanation.
function ChangeInfo() {
  async function upload() {
    const emailInput: HTMLInputElement = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const usernameInput: HTMLInputElement = document.getElementById(
      "usernameInput"
    ) as HTMLInputElement;
    const passwordInput: HTMLInputElement = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    const pfpInput: HTMLInputElement = document.getElementById(
      "pfpInput"
    ) as HTMLInputElement;
    let file: any = null;

    const formData: any = new FormData();
    if (
      emailInput &&
      usernameInput &&
      passwordInput &&
      pfpInput &&
      pfpInput.files
    ) {
      file = pfpInput.files[0];
      formData.append("pfp", file);
      formData.append("emailOld", localStorage.getItem("email"));
      formData.append("emailNew", emailInput.value);
      formData.append("username", usernameInput.value);
      formData.append("password", passwordInput.value);
    }
    await axios
      .post("http://localhost:5000/edit/account", formData)
      .then((serverResponse) => {
        const newData: Record<string, any> = serverResponse.data;
        if (newData.email) {
          localStorage.setItem("email", newData.email);
        }
        if (newData.username) {
          localStorage.setItem("username", newData.username);
        }
        if (newData.pfp) {
          localStorage.setItem("pfp", newData.pfp);
        }
        alert("Changes made, refresh to view.");
      })
      .catch((error) => {
        if (error.status) {
          alert(error.data);
        }
      });
  }

  return (
    <Form
      method="POST"
      action="http://localhost:5000/edit/account"
      encType="multipart/form-data"
      className="input-cluster"
      style={{ marginLeft: "10px", marginTop: "20px" }}
    >
      <h4 className="input-cluster-title">EDIT ACCOUNT</h4>
      <Form.Group>
        <Form.Control type="text" id="emailInput" placeholder="New Email" />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="text"
          id="usernameInput"
          placeholder="New Username"
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          id="passwordInput"
          placeholder="New Password"
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="file"
          id="pfpInput"
          placeholder="New Profile Picture"
        />
      </Form.Group>
      <Button onClick={upload}>Apply</Button>
    </Form>
  );
}

export default ChangeInfo;
