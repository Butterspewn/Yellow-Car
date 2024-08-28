import SmallImage from "../images/SmallImage";

// see post for interface explanation.
interface Props {
  username: string;
  pfp: string;
  score: string;
  rank: number;
}

// simple component to represent one person on the leaderboard.
function RankingTile(props: Props) {
  return (
    <div className="rank-tile-container">
      <div className="rank-tile-ranking">{props.rank}</div>
      <div className="rank-tile-pfp">
        <SmallImage image={props.pfp} />
      </div>
      <div className="rank-tile-username">{props.username}</div>
      <div className="rank-tile-score">{props.score} Posts</div>
    </div>
  );
}

export default RankingTile;
