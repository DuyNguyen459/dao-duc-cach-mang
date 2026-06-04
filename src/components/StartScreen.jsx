import { useEffect, useState } from 'react';

const TEAMS = [
  { key: 1, display: 1, label: 'ĐỘI ĐỎ',   crest: '🔴', accent: '#c84050' },
  { key: 2, display: 2, label: 'ĐỘI XANH', crest: '🔵', accent: '#4488d8' },
  { key: 3, display: 3, label: 'ĐỘI VÀNG', crest: '🟡', accent: '#c89820' },
  { key: 4, display: 4, label: 'ĐỘI LỤC',  crest: '🟢', accent: '#28a060' },
  { key: 5, display: 6, label: 'ĐỘI TÍM',  crest: '🟣', accent: '#8840cc' },
];

const StartScreen = ({ onStart }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`start-page${visible ? ' start-visible' : ''}`}>
      {/* Animated background particles */}
      <div className="start-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="start-particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="start-card">
        {/* Ornament top */}
        <div className="start-ornament">⚔ ✦ ⚔</div>

        {/* Title */}
        <h1 className="start-title">ĐẠI CHIẾN<br />THÀNH TRÌ</h1>
        <p className="start-tagline">HỘI THI TÌM HIỂU ĐẠO ĐỨC CÁCH MẠNG</p>

        {/* Divider */}
        <div className="start-divider">
          <span />
          <span className="start-divider-icon">⚜</span>
          <span />
        </div>

        {/* Info */}
        <div className="start-info-row">
          <div className="start-info-item">
            <div className="start-info-val">20</div>
            <div className="start-info-lbl">Câu hỏi</div>
          </div>
          <div className="start-info-sep" />
          <div className="start-info-item">
            <div className="start-info-val">20s</div>
            <div className="start-info-lbl">Mỗi câu</div>
          </div>
          <div className="start-info-sep" />
          <div className="start-info-item">
            <div className="start-info-val">{TEAMS.length}</div>
            <div className="start-info-lbl">Đội thi</div>
          </div>
        </div>

        {/* Teams preview */}
        <div className="start-teams">
          {TEAMS.map(t => (
            <div key={t.key} className="start-team-chip" style={{ '--chip-accent': t.accent }}>
              <span>{t.crest}</span>
              <span>Nhóm {t.display}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-start" onClick={onStart}>
          ⚔ BẮT ĐẦU CHIẾN ĐẤU
        </button>

        {/* Bottom ornament */}
        <div className="start-ornament" style={{ marginTop: '24px', opacity: 0.4 }}>✦ ✦ ✦</div>
      </div>
    </div>
  );
};

export default StartScreen;
