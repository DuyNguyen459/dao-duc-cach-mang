// Warm-toned team cards matching the cream/crimson/gold theme
const TEAM_THEMES = {
  1: { crest: '🔴', label: 'ĐỘI ĐỎ',   gradient: 'linear-gradient(160deg, #fff0f2 0%, #fddde2 55%, #fff0f2 100%)', accent: '#c1122f', glow: 'rgba(193,18,47,0.25)'   },
  2: { crest: '🔵', label: 'ĐỘI XANH', gradient: 'linear-gradient(160deg, #eef3ff 0%, #d8e6ff 55%, #eef3ff 100%)', accent: '#2255c8', glow: 'rgba(34,85,200,0.25)'   },
  3: { crest: '🟡', label: 'ĐỘI VÀNG', gradient: 'linear-gradient(160deg, #fff8e6 0%, #ffedb8 55%, #fff8e6 100%)', accent: '#b07a10', glow: 'rgba(176,122,16,0.3)'    },
  4: { crest: '🟢', label: 'ĐỘI LỤC',  gradient: 'linear-gradient(160deg, #edfbf2 0%, #c8f0d8 55%, #edfbf2 100%)', accent: '#1a7a45', glow: 'rgba(26,122,69,0.25)'    },
  5: { crest: '🟣', label: 'ĐỘI TÍM',  gradient: 'linear-gradient(160deg, #f5eeff 0%, #e2d0ff 55%, #f5eeff 100%)', accent: '#7030b8', glow: 'rgba(112,48,184,0.25)'  },
};
const DISPLAY = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 6 };

const Scoreboard = ({ scores, onUpdateScore }) => {
  const teams = [1, 2, 3, 4, 5];

  return (
    <div className="scoreboard">
      {teams.map(team => {
        const displayNum = DISPLAY[team];
        const theme      = TEAM_THEMES[team];

        return (
          <div
            key={team}
            className="team"
            style={{
              background:   theme.gradient,
              '--t-accent':  theme.accent,
              '--t-glow':    theme.glow,
            }}
          >
            <div className="team-accent-bar" />

            <div className="team-header">
              <span className="team-crest">{theme.crest}</span>
              <div className="team-name-block">
                <div className="team-id">NHÓM {displayNum}</div>
                <div className="team-label">{theme.label}</div>
              </div>
            </div>

            <div className="score-wrap">
              <div className="score">{scores[team]}</div>
              <div className="score-unit">điểm</div>
            </div>

            <div className="score-btns">
              <button className="minus" onClick={() => onUpdateScore(team, -10)}>−10</button>
              <button className="plus"  onClick={() => onUpdateScore(team, +10)}>+10</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;