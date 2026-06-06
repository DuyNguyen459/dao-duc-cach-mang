import { useEffect, useState } from 'react';

const Firework = ({ style }) => (
  <div className="firework" style={style} />
);

const HallOfFame = ({ onRestart }) => {
  const [visible, setVisible] = useState(false);
  const [fireworks, setFireworks] = useState([]);

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

      {/* ---- HEADER ---- */}
      <header style={{ borderBottom: '1px solid rgba(193, 18, 47, 0.2)' }}>
        <h1>⚔ KỶ NGUYÊN VƯƠN MÌNH ⚔</h1>
        <div className="subtitle">Hoàn thành 30 câu hỏi sát hạch đạo đức</div>
      </header>

      {/* ---- MAIN CONTENT ---- */}
      <div className="hof-main">
        <div className="hof-card" style={{ maxWidth: '800px', width: '100%', padding: '38px 44px' }}>

          {/* Title */}
          <div className="hof-title-row">
            <span className="hof-star">★</span>
            <h2 className="hof-title" style={{ fontSize: '2rem' }}>XIN CHÚC MỪNG</h2>
            <span className="hof-star">★</span>
          </div>
          <p className="hof-subtitle-text" style={{ fontSize: '1rem', color: '#666', marginBottom: '32px' }}>
            Chúc mừng tập thể đã hoàn thành xuất sắc đợt học tập, nghiên cứu và kiểm tra!
          </p>

          {/* Core Messages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', textAlign: 'left', marginBottom: '36px' }}>
            <div style={{ background: '#fff9ed', padding: '18px', borderRadius: '12px', borderLeft: '4px solid var(--sun)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--ink)' }}>🌱 Đạo đức là cái gốc</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#555', lineHeight: '1.45' }}>
                "Sông có nguồn mới có nước, cây có gốc mới xanh tươi. Người cách mạng không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân."
              </p>
            </div>
            <div style={{ background: '#fff0f2', padding: '18px', borderRadius: '12px', borderLeft: '4px solid var(--crimson)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--crimson)' }}>🛡️ Kỷ luật thép làm lá chắn</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#555', lineHeight: '1.45' }}>
                Kỷ luật nghiêm minh, tự soi tự sửa thường xuyên "như rửa mặt mỗi ngày". Kỷ luật thép chính là hành lang bảo vệ cán bộ đổi mới sáng tạo.
              </p>
            </div>
            <div style={{ background: '#edfbf2', padding: '18px', borderRadius: '12px', borderLeft: '4px solid var(--jade)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--jade)' }}>⚡ Chống giặc nội xâm</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#555', lineHeight: '1.45' }}>
                Kiên quyết loại bỏ tham ô, lãng phí, tiêu cực và chủ nghĩa cá nhân. Đấu tranh không ngừng nghỉ, không có vùng cấm, không có ngoại lệ.
              </p>
            </div>
          </div>

          <button className="btn-restart" onClick={onRestart}>
            ↺ Bắt đầu cuộc thi mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallOfFame;
