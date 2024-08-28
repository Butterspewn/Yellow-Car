import { useState, useEffect } from "react";
import axios from "axios";
import RankingTile from "../elements/RankingTile";

// a list of components depicting the ranked order of users.
function RankList() {
  // components is a list which accumulates users.
  let components: any[] = [];
  // when ready the components list is copied to the render list which triggers an update.
  const [renderList, setRenderList] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/leaderboard")
      .then((serverResponse) => {
        const rankings: Record<string, any>[] = serverResponse.data;
        // converts all database reccords into components.
        for (let i = 0; i < rankings.length; i++) {
          components.push(
            <RankingTile
              username={rankings[i].username}
              pfp={rankings[i].pfp}
              score={rankings[i].score}
              rank={i + 1}
            />
          );
        }
        setRenderList(components);
      })
      .catch((error) => {
        // checks to see if the error is one sent from the server.
        if (error.status) {
          alert(error.data);
        }
      });
  }, []);
  return <>{renderList}</>;
}

export default RankList;
