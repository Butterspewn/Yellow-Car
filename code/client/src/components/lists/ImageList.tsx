import { useState, useEffect } from "react";
import axios from "axios";
import MediumImage from "../images/MediumImage";

// works pretty much identially to the other lists. See rank list for explanation.
function ImageList() {
  let components: any[] = [];
  const [renderList, setRenderList] = useState<any[]>([]);

  useEffect(() => {
    const email: string | null = localStorage.getItem("email");
    if (email) {
      axios
        .get("http://localhost:5000/posts/" + email)
        .then((serverResponse) => {
          const postList: Record<string, any>[] = serverResponse.data;
          for (let i = 0; i < postList.length; i++) {
            components.push(<MediumImage name={postList[i].image} />);
          }
          setRenderList(components);
        })
        .catch((error) => {
          if (error.status) {
            alert(error.data);
          }
        });
    } else {
      alert("Could not find email.");
    }
  }, []);

  return <>{renderList}</>;
}

export default ImageList;
