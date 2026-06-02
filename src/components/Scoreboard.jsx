const Scoreboard = ({ scores, onUpdateScore }) => {
  const teams = [1, 2, 3, 4, 5];
  const sortedTeams = [...teams].sort((a, b) => {
    const scoreDiff = (scores[b] ?? 0) - (scores[a] ?? 0);
    return scoreDiff !== 0 ? scoreDiff : a - b;
  });

  return (
    <div className="scoreboard">
      {sortedTeams.map(team => (
        (() => {
          const displayTeam = team === 5 ? 6 : team;
          return (
        <div key={team} className="team">
          <div className="team-header">
            <div className="team-icon">T{displayTeam}</div>
            <div className="team-name">Nhóm {displayTeam}</div>
          </div>
          <div className="score">{scores[team]}</div>
          <div className="score-btns">
            <button className="minus" onClick={() => onUpdateScore(team, -10)}>-10</button>
            <button className="plus" onClick={() => onUpdateScore(team, 10)}>+10</button>
          </div>
        </div>
          );
        })()
      ))}
    </div>
  );
};

export default Scoreboard;