import { useState, useEffect } from "react";
import axios from "axios";
import Comment from "../elements/Comment";
import ComponentUpload from "../elements/CommentUpload";
import Caption from "../elements/Caption";

interface Props {
  id: number;
  caption: string;
  username: string;
}

// works pretty much identially to the other lists. See rank list for explanation.
function CommentList(props: Props) {
  const [renderList, setRenderlist] = useState<any[]>([]);
  const components: any[] = [];

  async function getComments() {
    for (let i = 1; i < components.length; i++) {
      components.pop();
    }
    await axios
      .get("http://localhost:5000/get/comments/" + props.id)
      .then((serverResponse) => {
        const comments: Record<string, any>[] | undefined = serverResponse.data;
        if (comments) {
          for (let i = 0; i < comments.length; i++) {
            components.push(
              <Comment
                key={comments[i].id}
                username={comments[i].username}
                text={comments[i].text}
              />
            );
          }
          setRenderlist(components);
        }
      })
      .catch((error) => {
        if (error.response) {
          alert(error.data);
        }
      });
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="comment-section">
      <Caption username={props.username + ":"} text={props.caption} />
      <div className="comment-list">{renderList}</div>
      <ComponentUpload id={props.id} refresh={getComments} />
    </div>
  );
}

export default CommentList;
