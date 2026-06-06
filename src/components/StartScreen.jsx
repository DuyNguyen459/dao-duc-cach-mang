import { useEffect, useState } from 'react';

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
        <h1 className="start-title">KỶ NGUYÊN<br />VƯƠN MÌNH</h1>
        {/* Divider */}
        <div className="start-divider" style={{ marginBottom: '32px' }}>
          <span />
          <span className="start-divider-icon">⚜</span>
          <span />
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
