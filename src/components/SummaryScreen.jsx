import { useEffect, useState } from 'react';
import { ROLE_DETAILS } from './SetupScreen';

const Firework = ({ style }) => (
  <div className="firework" style={style} />
);

const SummaryScreen = ({ winner, stats, onRestart }) => {
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

  const totalQuestions = stats.correct + stats.incorrect;
  const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0;

  return (
    <div className={`hof-page${visible ? ' hof-visible' : ''}`} style={{ minHeight: '100vh', padding: '24px' }}>
      {/* Fireworks layer */}
      {fireworks.map(f => (
        <Firework key={f.id} style={{ left: `${f.left}%`, top: `${f.top}%`, '--fw-color': f.color }} />
      ))}

      <header style={{ marginBottom: '24px', borderRadius: '14px', border: '1px solid rgba(193, 18, 47, 0.2)' }}>
        <h1>⚔ TỔNG KẾT KỶ NGUYÊN ⚔</h1>
        <div className="subtitle">Chiến dịch chỉnh đốn đội ngũ hoàn thành</div>
      </header>

      <div className="hof-main" style={{ padding: '0 20px 40px' }}>
        <div className="hof-card" style={{ maxWidth: '820px', width: '100%', padding: '36px' }}>
          
          {/* Victory Title */}
          <div className="hof-title-row" style={{ marginBottom: '14px' }}>
            <span className="hof-star">★</span>
            <h2 className="hof-title" style={{ fontSize: '2.2rem', color: winner === 'CACH_MANG' ? 'var(--jade)' : 'var(--crimson)' }}>
              {winner === 'CACH_MANG' ? 'PHE CÁCH MẠNG CHIẾN THẮNG 🎉' : 'PHE GIẶC NỘI XÂM CHIẾN THẮNG 👿'}
            </h2>
            <span className="hof-star">★</span>
          </div>

          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '28px', maxWidth: '640px', margin: '0 auto 28px' }}>
            {winner === 'CACH_MANG' 
              ? 'Đạo đức và kỷ luật thép đã bảo vệ thành công hệ thống, loại bỏ triệt để các nhân tố tha hóa và biến chất!'
              : 'Sự suy thoái về đạo đức, lối sống và chủ nghĩa cá nhân từ bên trong đã làm tê liệt bộ máy, khiến hệ thống sụp đổ!'}
          </p>

          {/* Educational Takeaways Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '24px 0', textAlign: 'left' }}>
            <div style={{ background: '#fff9ed', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--sun)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--ink)' }}>🌱 Đạo đức là cái gốc</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#666', lineHeight: '1.4' }}>
                "Cây phải có gốc, người cách mạng phải có đạo đức. Thiếu đạo đức, dù tài giỏi mấy cũng không lãnh đạo được nhân dân."
              </p>
            </div>
            <div style={{ background: '#fff0f2', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--crimson)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--crimson)' }}>🛡️ Kỷ luật làm hành lang an toàn</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#666', lineHeight: '1.4' }}>
                Kỷ luật thép không phải là rào cản, mà chính là "lá chắn" giữ vững sự trong sạch của tổ chức và kiến tạo niềm tin đổi mới.
              </p>
            </div>
            <div style={{ background: '#edfbf2', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--jade)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--jade)' }}>⚡ Sát cánh chống giặc nội xâm</h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#666', lineHeight: '1.4' }}>
                Chống tham ô, lãng phí và chủ nghĩa cá nhân là nhiệm vụ sống còn, phải đấu tranh kiên quyết, "không vùng cấm, không ngoại lệ".
              </p>
            </div>
          </div>

          {/* Quiz Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(111,15,30,0.04)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(193,18,47,0.08)', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--jade)' }}>{stats.correct}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Đạt Sát Hạch</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(193,18,47,0.15)' }} />
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--crimson)' }}>{stats.incorrect}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Không Đạt</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(193,18,47,0.15)' }} />
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--sun)' }}>{accuracy}%</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Tỷ Lệ Tài Đức</div>
            </div>
          </div>

          {/* Survivors list */}
          {stats.survivors.length > 0 && (
            <div style={{ marginBottom: '28px', textAlign: 'left' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', borderBottom: '1px solid rgba(193,18,47,0.15)', paddingBottom: '6px', color: 'var(--crimson)' }}>
                🎖️ ĐỒNG CHÍ HY SINH VÀ SỐNG SÓT ĐẾN CUỐI CÙNG
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {stats.survivors.map(p => (
                  <span
                    key={p.id}
                    style={{
                      padding: '4px 10px',
                      background: '#fff',
                      border: '1px solid rgba(193, 18, 47, 0.15)',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: ROLE_DETAILS[p.role].color
                    }}
                  >
                    {p.name} ({ROLE_DETAILS[p.role].icon} {ROLE_DETAILS[p.role].name.split(' ')[0]})
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="btn-restart" onClick={onRestart} style={{ padding: '14px 40px', fontSize: '1rem' }}>
            ↺ Thiết Lập Trận Đấu Mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
