import { useState } from 'react';

const ROLE_DETAILS = {
  SOl: { name: 'Kẻ tha hóa (Sói)', icon: '👿', description: 'Đại diện cho chủ nghĩa cá nhân, âm thầm làm suy thoái hệ thống từ bên trong.', side: 'giac_noi_xam', color: '#6f0f1e' },
  KIEM_TRA: { name: 'Ban Kiểm tra', icon: '🔍', description: 'Kiểm tra dấu hiệu "tự diễn biến, tự chuyển hóa" của cán bộ mỗi đêm.', side: 'cach_mang', color: '#2255c8' },
  KY_LUAT: { name: 'Lá chắn Kỷ luật', icon: '🛡️', description: 'Bảo vệ một cán bộ trước sự lôi kéo, tha hóa của giặc nội xâm.', side: 'cach_mang', color: '#b07a10' },
  DOT_PHA: { name: 'Người Đột phá', icon: '⚡', description: 'Đại diện cho tinh thần "5 dám" & Sandbox. Có bình Đổi mới (Cứu) và Kỷ cương (Phạt).', side: 'cach_mang', color: '#7030b8' },
  LAO_THANH: { name: 'Cán bộ Lão thành', icon: '👴', description: 'Người có "gốc đạo đức" vững chắc, có 2 mạng. Nếu bị loại nhầm, phe Cách mạng mất quyền biểu quyết 1 vòng.', side: 'cach_mang', color: '#1a7a45' },
  GUONG_MAU: { name: 'Cán bộ Gương mẫu', icon: '👔', description: 'Thực hành "Cần, Kiệm, Liêm, Chính". Dùng sức mạnh bỏ phiếu kỷ luật để làm sạch bộ máy.', side: 'cach_mang', color: '#555' }
};

const DEFAULT_PLAYERS = Array.from({ length: 24 }, (_, i) => `Đồng chí ${i + 1}`);

const SetupScreen = ({ onStartGame }) => {
  const [namesText, setNamesText] = useState(DEFAULT_PLAYERS.join('\n'));
  const [players, setPlayers] = useState([]);
  const [rolesAssigned, setRolesAssigned] = useState(false);
  const [revealedIds, setRevealedIds] = useState({});

  const handleAutofill = () => {
    setNamesText(DEFAULT_PLAYERS.join('\n'));
  };

  const handleAssignRoles = () => {
    const list = namesText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    // Make sure we have exactly 24 names (or padd them / slice them to 24)
    let finalNames = [...list];
    if (finalNames.length < 24) {
      for (let i = finalNames.length; i < 24; i++) {
        finalNames.push(`Đồng chí ${i + 1}`);
      }
    } else if (finalNames.length > 24) {
      finalNames = finalNames.slice(0, 24);
    }

    // Role list for 24 players:
    // 6 Sói, 4 Tiên tri, 3 Bảo vệ, 2 Phù thủy, 1 Già làng, 8 Dân thường
    const rolesPool = [
      ...Array(6).fill('SOl'),
      ...Array(4).fill('KIEM_TRA'),
      ...Array(3).fill('KY_LUAT'),
      ...Array(2).fill('DOT_PHA'),
      'LAO_THANH',
      ...Array(8).fill('GUONG_MAU')
    ];

    // Shuffle rolesPool using Fisher-Yates
    for (let i = rolesPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rolesPool[i], rolesPool[j]] = [rolesPool[j], rolesPool[i]];
    }

    const assignedPlayers = finalNames.map((name, index) => ({
      id: index + 1,
      name: name,
      role: rolesPool[index],
      isAlive: true,
      lives: rolesPool[index] === 'LAO_THANH' ? 2 : 1,
      hasDoubleVote: false,
      isSilenced: false, // For elderly leader penalty
      hasUsedSave: false, // Witch tool
      hasUsedKill: false  // Witch tool
    }));

    setPlayers(assignedPlayers);
    setRolesAssigned(true);
    setRevealedIds({});
  };

  const toggleReveal = (id) => {
    setRevealedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleConfirmAndStart = () => {
    onStartGame(players);
  };

  return (
    <div className="start-page start-visible" style={{ padding: '24px', flexDirection: 'column', minHeight: '100vh', justifyContent: 'flex-start' }}>
      <header style={{ width: '100%', marginBottom: '24px', borderRadius: '14px', border: '1px solid rgba(193, 18, 47, 0.2)' }}>
        <h1 style={{ fontSize: '2rem' }}>KỶ NGUYÊN VƯƠN MÌNH</h1>
        <div className="subtitle">Thiết Lập Đội Ngũ Cán Bộ (24 Thành Viên)</div>
      </header>

      {!rolesAssigned ? (
        <div className="start-card" style={{ maxWidth: '780px', padding: '32px' }}>
          <div className="start-ornament">⚔ ✦ ⚔</div>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--crimson)' }}>DANH SÁCH BAN LÃNH ĐẠO</h2>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
            Nhập tên của 24 thành viên tham gia trò chơi (mỗi người một dòng). Hệ thống sẽ tự động phân bổ vai trò Cách mạng & Giặc nội xâm theo đúng tỷ lệ tối ưu.
          </p>

          <textarea
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            style={{
              width: '100%',
              height: '220px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(193, 18, 47, 0.2)',
              background: '#fffcf7',
              fontFamily: 'inherit',
              fontSize: '1rem',
              color: 'var(--ink)',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginBottom: '16px'
            }}
            placeholder="Nhập tên 24 người chơi..."
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
            <button className="btn-nav" onClick={handleAutofill} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              📝 Tên mặc định
            </button>
            <button className="btn-reveal" onClick={handleAssignRoles} style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
              🎲 Phân bổ vai trò ngẫu nhiên
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.8rem', textAlign: 'left', background: 'rgba(111,15,30,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(193,18,47,0.07)' }}>
            <div>👿 <strong>Phe Sói (6):</strong> Giặc nội xâm</div>
            <div>🔍 <strong>Kiểm tra (4):</strong> Tiên tri</div>
            <div>🛡️ <strong>Lá chắn (3):</strong> Bảo vệ</div>
            <div>⚡ <strong>Đột phá (2):</strong> Phù thủy</div>
            <div>👴 <strong>Lão thành (1):</strong> Già làng (2 mạng)</div>
            <div>👔 <strong>Gương mẫu (8):</strong> Dân làng</div>
          </div>
        </div>
      ) : (
        <div style={{ width: 'min(1200px, 95vw)', background: 'var(--paper-strong)', borderRadius: '22px', padding: '28px', boxShadow: 'var(--card-shadow), var(--ring)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(193, 18, 47, 0.1)', paddingBottom: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: 'var(--crimson)' }}>PHÂN PHÁT VAI TRÒ BÍ MẬT</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>Bấm vào từng thẻ để kiểm tra vai trò trước khi bước vào Kỷ Nguyên mới.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-nav" onClick={() => setRolesAssigned(false)} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                ↺ Nhập lại danh sách
              </button>
              <button className="btn-finish" onClick={handleConfirmAndStart} style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                ⚔ BẮT ĐẦU VÀO TRẬN
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {players.map(p => {
              const details = ROLE_DETAILS[p.role];
              const isRevealed = revealedIds[p.id];
              return (
                <div
                  key={p.id}
                  onClick={() => toggleReveal(p.id)}
                  style={{
                    height: '110px',
                    borderRadius: '12px',
                    border: `2px solid ${isRevealed ? details.color : 'rgba(193, 18, 47, 0.2)'}`,
                    background: isRevealed ? `${details.color}15` : '#fff7e6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    padding: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="setup-card-hover"
                >
                  <div style={{ fontSize: '0.75rem', color: '#888', position: 'absolute', top: '4px', left: '6px' }}>#{p.id}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center', marginBottom: '6px' }}>{p.name}</div>
                  
                  {isRevealed ? (
                    <>
                      <div style={{ fontSize: '1.8rem', lineHeight: '1.2' }}>{details.icon}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: details.color, marginTop: '2px', textAlign: 'center' }}>
                        {details.name}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '1.6rem', color: 'rgba(193, 18, 47, 0.3)' }}>⚜</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(193, 18, 47, 0.4)', marginTop: '4px' }}>Bấm để xem</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#666', borderTop: '1px solid rgba(193, 18, 47, 0.1)', paddingTop: '12px', textAlign: 'left' }}>
            <strong>Hướng dẫn:</strong> Quản trò có thể bấm lật thẻ của từng người chơi để chỉ định vai trò (hoặc cho người chơi tự lên xem), sau đó bấm <strong>"Bắt đầu vào trận"</strong> để chuyển sang màn hình điều phối chính.
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupScreen;
export { ROLE_DETAILS };
