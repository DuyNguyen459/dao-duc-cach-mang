import { useEffect, useState } from 'react';

const medals = ['🥇', '🥈', '🥉'];

const Firework = ({ style }) => (
  <div className="firework" style={style} />
);

const HallOfFame = ({ scores, onRestart }) => {
  const [visible, setVisible] = useState(false);
  const [fireworks, setFireworks] = useState([]);

  const ranking = Object.entries(scores)
    .map(([team, score]) => ({
      team: team === '5' ? 6 : Number(team),
      score,
      key: team,
    }))
    .sort((a, b) => b.score - a.score || a.team - b.team);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const spawn = () => {
      const id = Date.now() + Math.random();
      setFireworks(prev => [
        ...prev,
        {
          id,
          left: Math.random() * 88 + 6,
          top: Math.random() * 50 + 5,
          color: ['#f7c948', '#c1122f', '#1f8a5b', '#ffd87a', '#ffffff'][Math.floor(Math.random() * 5)],
        },
      ]);
      setTimeout(() => setFireworks(prev => prev.filter(f => f.id !== id)), 900);
    };
    const interval = setInterval(spawn, 430);
    spawn(); spawn(); spawn();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hof-page${visible ? ' hof-visible' : ''}`}>
      {/* Fireworks layer */}
      {fireworks.map(f => (
        <Firework key={f.id} style={{ left: `${f.left}%`, top: `${f.top}%`, '--fw-color': f.color }} />
      ))}

      {/* ---- HEADER — same as main app ---- */}
      <header>
        <h1>⚔ ĐẠI CHIẾN THÀNH TRÌ ⚔</h1>
        <div className="subtitle">Kết quả sau 20 câu hỏi</div>
      </header>

      {/* ---- MAIN CONTENT ---- */}
      <div className="hof-main">
        <div className="hof-card">

          {/* Title */}
          <div className="hof-title-row">
            <span className="hof-star">★</span>
            <h2 className="hof-title">VINH DANH KẾT QUẢ</h2>
            <span className="hof-star">★</span>
          </div>
          <p className="hof-subtitle-text">Bảng xếp hạng chính thức</p>

          {/* Podium — order: 2nd | 1st | 3rd */}
          <div className="hof-podium">
            {[1, 0, 2].map(rankIdx => {
              const entry = ranking[rankIdx];
              if (!entry) return null;
              return (
                <div
                  key={entry.key}
                  className={`hof-podium-slot hof-rank-${rankIdx + 1}`}
                >
                  <div className="hof-medal">{medals[rankIdx]}</div>
                  <div className="hof-team-label">Nhóm {entry.team}</div>
                  <div className="hof-team-pts">{entry.score}</div>
                  <div className="hof-rank-tag">Hạng {rankIdx + 1}</div>
                </div>
              );
            })}
          </div>

          {/* Full ranking list */}
          <div className="hof-list">
            {ranking.map((entry, idx) => (
              <div key={entry.key} className={`hof-row${idx < 3 ? ' hof-row-top' : ''}`}>
                <span className="hof-row-rank">{idx < 3 ? medals[idx] : `#${idx + 1}`}</span>
                <span className="hof-row-name">Nhóm {entry.team}</span>
                <span className="hof-row-score">{entry.score} điểm</span>
              </div>
            ))}
          </div>

          <button className="btn-restart" onClick={onRestart}>
            ↺ Chơi lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
