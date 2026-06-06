import { useState, useEffect } from 'react';
import { questionsData } from '../data/questions';
import { ROLE_DETAILS } from './SetupScreen';
import ActionModal from './ActionModal';

const GameBoard = ({ initialPlayers, onGameEnd }) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [dayNumber, setDayNumber] = useState(1);
  const [phase, setPhase] = useState('NIGHT_INTRO'); // NIGHT_INTRO, NIGHT_WEREWOLVES, NIGHT_SEER, NIGHT_BODYGUARD, NIGHT_WITCH, DAY_ANNOUNCEMENT, DAY_VOTING
  const [isModeratorView, setIsModeratorView] = useState(true);
  
  // Night action targets
  const [werewolfTarget, setWerewolfTarget] = useState(null);
  const [seerTarget, setSeerTarget] = useState(null);
  const [seerResult, setSeerResult] = useState('');
  const [bodyguardTarget, setBodyguardTarget] = useState(null);
  const [lastBodyguardTarget, setLastBodyguardTarget] = useState(null); // Prevent consecutive protection
  const [witchSaveTarget, setWitchSaveTarget] = useState(null);
  const [witchKillTarget, setWitchKillTarget] = useState(null);

  // Day voting state
  const [dayAuditTarget, setDayAuditTarget] = useState(null);
  const [doubleVotePlayerId, setDoubleVotePlayerId] = useState(null);
  const [banVotesCount, setBanVotesCount] = useState(0); // If elderly leader was lynched, revolutionaries lose votes next day
  const [isBanVotesActive, setIsBanVotesActive] = useState(false);
  const [silentDaysCount, setSilentDaysCount] = useState(0); // If 2 days no lynch -> Werewolves win
  
  // Quiz statistics
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  // Modal configuration
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    question: null,
    roleName: '',
    onAnswer: () => {}
  });

  // Game activity log
  const [logs, setLogs] = useState([
    `Hệ thống được khởi tạo với 24 cán bộ. Hãy bắt đầu Đêm thứ ${dayNumber}!`
  ]);

  // Witch capability state (one-time use per game)
  const [witchHasSave, setWitchHasSave] = useState(true);
  const [witchHasKill, setWitchHasKill] = useState(true);

  // Helper to log actions
  const addLog = (msg) => {
    setLogs(prev => [`[Ngày ${dayNumber}] ${msg}`, ...prev]);
  };

  // Helper to fetch random question
  const getRandomQuestion = () => {
    const rIdx = Math.floor(Math.random() * questionsData.length);
    return questionsData[rIdx];
  };

  // Continuous win check
  useEffect(() => {
    const wolves = players.filter(p => p.isAlive && p.role === 'SOl');
    const rebels = players.filter(p => p.isAlive && p.role !== 'SOl');

    if (wolves.length === 0) {
      onGameEnd('CACH_MANG', {
        correct: correctAnswers,
        incorrect: incorrectAnswers,
        survivors: players.filter(p => p.isAlive)
      });
    } else if (wolves.length >= rebels.length) {
      onGameEnd('GIAC_NOI_XAM', {
        correct: correctAnswers,
        incorrect: incorrectAnswers,
        survivors: players.filter(p => p.isAlive)
      });
    }
  }, [players, correctAnswers, incorrectAnswers, onGameEnd]);

  // Phase controller: Ban đêm / Ban ngày
  const handleNextPhase = () => {
    switch (phase) {
      case 'NIGHT_INTRO':
        setPhase('NIGHT_WEREWOLVES');
        break;
      case 'NIGHT_WEREWOLVES':
        setPhase('NIGHT_SEER');
        break;
      case 'NIGHT_SEER':
        setPhase('NIGHT_BODYGUARD');
        break;
      case 'NIGHT_BODYGUARD':
        setPhase('NIGHT_WITCH');
        break;
      case 'NIGHT_WITCH':
        processNightResults();
        break;
      case 'DAY_ANNOUNCEMENT':
        setPhase('DAY_VOTING');
        break;
      case 'DAY_VOTING':
        // Start next night
        startNextNight();
        break;
      default:
        break;
    }
  };

  // Process night results
  const processNightResults = () => {
    let killedId = werewolfTarget;
    let poisonId = witchKillTarget;
    let saved = false;

    // Check if saved by bodyguard or witch
    if (killedId) {
      if (killedId === bodyguardTarget || killedId === witchSaveTarget) {
        saved = true;
      }
    }

    const deathsThisNight = [];
    const logsThisNight = [];

    // Apply werewolf kill
    if (killedId && !saved) {
      const target = players.find(p => p.id === killedId);
      if (target.role === 'LAO_THANH' && target.lives > 1) {
        // Elder leader absorbs one hit
        setPlayers(prev => prev.map(p => p.id === killedId ? { ...p, lives: 1 } : p));
        logsThisNight.push(`Cán bộ Lão thành ${target.name} bị giặc nội xâm lôi kéo nhưng nhờ bản lĩnh vững vàng nên giữ vững lập trường (mất 1 mạng).`);
      } else {
        deathsThisNight.push(killedId);
      }
    } else if (killedId && saved) {
      const target = players.find(p => p.id === killedId);
      logsThisNight.push(`Giặc nội xâm đã âm thầm lôi kéo một cán bộ, nhưng kỷ luật nghiêm ngặt đã bảo vệ an toàn cho đồng chí đó.`);
    }

    // Apply witch poison kill
    if (poisonId) {
      const target = players.find(p => p.id === poisonId);
      if (target.role === 'LAO_THANH' && target.lives > 1) {
        setPlayers(prev => prev.map(p => p.id === poisonId ? { ...p, lives: 1 } : p));
        logsThisNight.push(`Cán bộ Lão thành ${target.name} bị kỷ luật đột xuất nhưng giải trình được (mất 1 mạng).`);
      } else {
        if (!deathsThisNight.includes(poisonId)) {
          deathsThisNight.push(poisonId);
        }
      }
    }

    // Process all deaths
    setPlayers(prev => prev.map(p => {
      if (deathsThisNight.includes(p.id)) {
        return { ...p, isAlive: false };
      }
      return p;
    }));

    // Generate announcements
    deathsThisNight.forEach(id => {
      const target = players.find(p => p.id === id);
      const isSpecial = ['KIEM_TRA', 'KY_LUAT', 'DOT_PHA'].includes(target.role);
      let deathMsg = `Cán bộ ${target.name} (vai trò: ${ROLE_DETAILS[target.role].name}) đã bị loại bỏ khỏi hàng ngũ.`;
      
      if (isSpecial) {
        deathMsg += ` [Luật Tài & Đức] "Tài giỏi mấy mà thiếu đạo đức cũng không lãnh đạo được nhân dân!"`;
      }
      logsThisNight.push(deathMsg);
    });

    if (deathsThisNight.length === 0 && logsThisNight.length === 0) {
      logsThisNight.push("Đêm trôi qua êm đềm, không có cán bộ nào bị lôi kéo hay loại bỏ.");
    }

    // Write all to log
    logsThisNight.forEach(msg => addLog(msg));

    // Reset night action states
    setLastBodyguardTarget(bodyguardTarget);
    setWerewolfTarget(null);
    setSeerTarget(null);
    setSeerResult('');
    setBodyguardTarget(null);
    setWitchSaveTarget(null);
    setWitchKillTarget(null);

    // Turn off double vote from previous day
    setPlayers(prev => prev.map(p => ({ ...p, hasDoubleVote: false })));
    setDoubleVotePlayerId(null);

    // Apply silent penalties if applicable
    if (isBanVotesActive) {
      // Revolutionaries lost vote this round, reset for next day
      setIsBanVotesActive(false);
      addLog("Thời hạn kỷ luật im lặng đã hết. Phe Cách mạng phục hồi quyền biểu quyết.");
    }

    // Move to announcement phase
    setPhase('DAY_ANNOUNCEMENT');
  };

  // Start next night
  const startNextNight = () => {
    setDayNumber(prev => prev + 1);
    setPhase('NIGHT_INTRO');
    addLog(`Bắt đầu Đêm thứ ${dayNumber + 1}! Hãy tiến hành tự soi, tự sửa.`);
  };

  // Auditor/Seer quiz validation
  const triggerSeerAudit = (targetId) => {
    setSeerTarget(targetId);
    const target = players.find(p => p.id === targetId);
    
    setModalConfig({
      isOpen: true,
      question: getRandomQuestion(),
      roleName: 'Ban Kiểm tra (Tiên tri)',
      onAnswer: (isCorrect) => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
          const isWolf = target.role === 'SOl';
          const resText = isWolf ? 'GIẶC NỘI XÂM 👿' : 'CÁN BỘ CÁCH MẠNG 👔';
          setSeerResult(`${target.name} là ${resText}`);
          addLog(`Ban Kiểm tra trả lời ĐÚNG câu hỏi sát hạch và phát hiện ${target.name} là ${resText}.`);
        } else {
          setIncorrectAnswers(prev => prev + 1);
          setSeerResult('Quyền năng bị vô hiệu hóa ❌ (Trả lời sai câu hỏi đạo đức)');
          addLog(`Ban Kiểm tra trả lời SAI câu hỏi sát hạch, mất khả năng kiểm tra đêm nay.`);
        }
      }
    });
  };

  // Shield/Bodyguard quiz validation
  const triggerBodyguardAudit = (targetId) => {
    if (targetId === lastBodyguardTarget) {
      alert("Không thể bảo vệ cùng một người trong 2 đêm liên tiếp!");
      return;
    }
    setBodyguardTarget(targetId);
    const target = players.find(p => p.id === targetId);

    setModalConfig({
      isOpen: true,
      question: getRandomQuestion(),
      roleName: 'Lá chắn Kỷ luật (Bảo vệ)',
      onAnswer: (isCorrect) => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
          addLog(`Lá chắn Kỷ luật trả lời ĐÚNG và thiết lập hành lang an toàn bảo vệ cho ${target.name}.`);
        } else {
          setIncorrectAnswers(prev => prev + 1);
          setBodyguardTarget(null);
          addLog(`Lá chắn Kỷ luật trả lời SAI, vô hiệu hóa bảo vệ đêm nay.`);
        }
      }
    });
  };

  // Witch action quiz validation
  const triggerWitchAction = (type, targetId) => {
    const roleName = type === 'SAVE' ? 'Bình thuốc Đổi mới (Cứu)' : 'Bình thuốc Kỷ cương (Phạt)';
    
    setModalConfig({
      isOpen: true,
      question: getRandomQuestion(),
      roleName: `Người Đột phá - ${roleName}`,
      onAnswer: (isCorrect) => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
          if (type === 'SAVE') {
            setWitchSaveTarget(targetId);
            setWitchHasSave(false);
            const target = players.find(p => p.id === targetId);
            addLog(`Người Đột phá trả lời ĐÚNG câu hỏi và sử dụng Bình Đổi mới cứu sống ${target.name}.`);
          } else {
            setWitchKillTarget(targetId);
            setWitchHasKill(false);
            const target = players.find(p => p.id === targetId);
            addLog(`Người Đột phá trả lời ĐÚNG câu hỏi và dùng Bình Kỷ cương loại bỏ cán bộ vi phạm ${target.name}.`);
          }
        } else {
          setIncorrectAnswers(prev => prev + 1);
          addLog(`Người Đột phá trả lời SAI câu hỏi, mất cơ hội đột phá trong đêm nay.`);
        }
      }
    });
  };

  // Day Audit for double vote power
  const triggerDayAudit = (targetId) => {
    setDayAuditTarget(targetId);
    const target = players.find(p => p.id === targetId);

    setModalConfig({
      isOpen: true,
      question: getRandomQuestion(),
      roleName: `Sát hạch đạo đức ban ngày - ${target.name}`,
      onAnswer: (isCorrect) => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        if (isCorrect) {
          setCorrectAnswers(prev => prev + 1);
          setDoubleVotePlayerId(targetId);
          setPlayers(prev => prev.map(p => p.id === targetId ? { ...p, hasDoubleVote: true } : p));
          addLog(`Đồng chí ${target.name} vượt qua sát hạch đạo đức xuất sắc và được tặng 2 phiếu bầu trong hôm nay.`);
        } else {
          setIncorrectAnswers(prev => prev + 1);
          addLog(`Đồng chí ${target.name} không vượt qua sát hạch đạo đức, không nhận được sự tín nhiệm.`);
        }
        setDayAuditTarget(null);
      }
    });
  };

  // 5-dám Breakthrough action (lấy sinh mệnh cá nhân để đột phá)
  const trigger5DamAction = (sourceId, targetId) => {
    const source = players.find(p => p.id === sourceId);
    const target = players.find(p => p.id === targetId);

    if (window.confirm(`Đồng chí ${source.name} đứng ra nhận trách nhiệm đột phá (5 dám) để loại bỏ ngay lập tức đồng chí ${target.name}? Nếu trả lời sai sát hạch, ${source.name} sẽ bị loại lập tức.`)) {
      setModalConfig({
        isOpen: true,
        question: getRandomQuestion(),
        roleName: `Tinh thần "5 dám" - ${source.name}`,
        onAnswer: (isCorrect) => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setPlayers(prev => prev.map(p => p.id === targetId ? { ...p, isAlive: false } : p));
            addLog(`⚡ Cán bộ ${source.name} đột phá ĐÚNG: Cán bộ ${target.name} (vai: ${ROLE_DETAILS[target.role].name}) bị đưa ra khỏi hàng ngũ ngay lập tức.`);
          } else {
            setIncorrectAnswers(prev => prev + 1);
            setPlayers(prev => prev.map(p => p.id === sourceId ? { ...p, isAlive: false } : p));
            addLog(`❌ Đột phá SAI: Cán bộ ${source.name} tự ý hành động khi chưa vững đạo đức và phải chịu kỷ luật loại khỏi bộ máy.`);
          }
        }
      });
    }
  };

  // Vote Lynch (Bỏ phiếu kỷ luật)
  const handleVoteLynch = (targetId) => {
    if (targetId === null) {
      // Skip voting
      const nextSilent = silentDaysCount + 1;
      setSilentDaysCount(nextSilent);
      addLog(`Hội đồng nhất trí tạm hoãn biểu quyết kỷ luật hôm nay. (Số ngày im lặng liên tiếp: ${nextSilent}/2).`);
      
      if (nextSilent >= 2) {
        // Silence penalty: Sói wins
        addLog("🚨 [Hình phạt Sự im lặng] 2 ngày liên tiếp không có ai bị loại bỏ. Sự quan liêu, xa dân đã khiến hệ thống sụp đổ từ bên trong!");
        setTimeout(() => {
          onGameEnd('GIAC_NOI_XAM', {
            correct: correctAnswers,
            incorrect: incorrectAnswers,
            survivors: players.filter(p => p.isAlive)
          });
        }, 1500);
        return;
      }
      
      handleNextPhase();
      return;
    }

    const target = players.find(p => p.id === targetId);
    setPlayers(prev => prev.map(p => p.id === targetId ? { ...p, isAlive: false } : p));
    setSilentDaysCount(0); // Reset silent count
    
    let baseMsg = `Hội đồng đã bỏ phiếu kỷ luật, loại bỏ đồng chí ${target.name} (vai trò: ${ROLE_DETAILS[target.role].name}) khỏi hệ thống.`;
    
    // Penalties if lynch elder leader
    if (target.role === 'LAO_THANH') {
      setIsBanVotesActive(true);
      baseMsg += ` 🚨 [Cảnh cáo] Loại bỏ sai Cán bộ Lão thành gương mẫu! Phe Cách mạng mất sức mạnh tinh thần, tước quyền biểu quyết trong vòng 1 ngày tiếp theo.`;
    }
    
    addLog(baseMsg);
    handleNextPhase();
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: phase.startsWith('NIGHT') ? '#131929' : 'inherit', color: phase.startsWith('NIGHT') ? '#f1f1f1' : 'inherit', transition: 'background 0.5s ease, color 0.5s ease' }}>
      
      {/* Action modal */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        question={modalConfig.question}
        roleName={modalConfig.roleName}
        onAnswer={modalConfig.onAnswer}
      />

      {/* Header section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.03)' : 'rgba(111,15,30,0.03)',
        border: `1px solid ${phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.1)' : 'rgba(193,18,47,0.15)'}`,
        padding: '16px 24px',
        borderRadius: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '1.8rem', color: phase.startsWith('NIGHT') ? 'var(--sun)' : 'var(--crimson)', margin: 0, textShadow: 'none' }}>
            {phase.startsWith('NIGHT') ? '🌙 GIAI ĐOẠN ĐÊM: TỰ SOI TỰ SỬA' : '☀️ GIAI ĐOẠN NGÀY: PHÁN QUYẾT KỶ LUẬT'}
          </h1>
          <div className="subtitle" style={{ fontSize: '0.85rem', marginTop: '4px', letterSpacing: '1px', color: phase.startsWith('NIGHT') ? '#aaa' : '#666' }}>
            Đêm/Ngày số {dayNumber} • Cách mạng: {players.filter(p => p.isAlive && p.role !== 'SOl').length} • Giặc nội xâm: {players.filter(p => p.isAlive && p.role === 'SOl').length}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-nav"
            onClick={() => setIsModeratorView(!isModeratorView)}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              color: phase.startsWith('NIGHT') ? '#fff' : 'var(--crimson)',
              borderColor: phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.4)' : 'rgba(193,18,47,0.45)'
            }}
          >
            {isModeratorView ? '👁️ Chế độ Trình chiếu' : '👁️ Chế độ Quản trò'}
          </button>
        </div>
      </div>

      {/* Main Board Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* Left: Players Grid & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Phase Control Box */}
          <div style={{
            background: phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.05)' : '#ffffff',
            border: `1px solid ${phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.1)' : 'rgba(193,18,47,0.15)'}`,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--card-shadow), var(--ring)',
            textAlign: 'left'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontFamily: 'Cinzel, serif', color: phase.startsWith('NIGHT') ? 'var(--sun)' : 'var(--crimson)' }}>
              HƯỚNG DẪN THỰC THI CHỨC NĂNG
            </h3>

            {/* Night Stages UI */}
            {phase === 'NIGHT_INTRO' && (
              <div>
                <p>Màn đêm buông xuống, các cán bộ bắt đầu tự soi, tự sửa hành vi đạo đức của bản thân. Mọi hành vi tha hóa sẽ bị kỷ luật thép xử lý triệt để.</p>
                <button className="btn-reveal" onClick={handleNextPhase}>👿 Bắt đầu cuộc chiến giặc nội xâm</button>
              </div>
            )}

            {phase === 'NIGHT_WEREWOLVES' && (
              <div>
                <p><strong>[1. Giặc Nội Xâm thức dậy]:</strong> Chọn 1 Cán bộ Cách mạng để lôi kéo, tha hóa hoặc loại bỏ khỏi hàng ngũ.</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {players.filter(p => p.isAlive && p.role !== 'SOl').map(p => (
                    <button
                      key={p.id}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.85rem',
                        background: werewolfTarget === p.id ? 'var(--crimson)' : 'gray',
                        color: 'white'
                      }}
                      onClick={() => setWerewolfTarget(p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <button
                  className="btn-reveal"
                  onClick={handleNextPhase}
                  disabled={!werewolfTarget}
                  style={{ marginTop: '14px', opacity: werewolfTarget ? 1 : 0.6 }}
                >
                  🔍 Ban Kiểm tra thức dậy
                </button>
              </div>
            )}

            {phase === 'NIGHT_SEER' && (
              <div>
                <p><strong>[2. Ban Kiểm tra (Tiên tri) thức dậy]:</strong> Giám sát mở rộng, kiểm tra có trọng tâm. Chọn 1 cán bộ để sát hạch đạo đức, phát hiện tự diễn biến.</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {players.filter(p => p.isAlive && p.id !== seerTarget).map(p => (
                    <button
                      key={p.id}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.85rem',
                        background: '#2255c8',
                        color: 'white'
                      }}
                      onClick={() => triggerSeerAudit(p.id)}
                      disabled={seerTarget !== null}
                    >
                      Kiểm tra {p.name}
                    </button>
                  ))}
                </div>
                {seerResult && (
                  <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontWeight: 'bold' }}>
                    Kết quả giám sát: <span style={{ color: 'var(--sun)' }}>{seerResult}</span>
                  </div>
                )}
                <button
                  className="btn-reveal"
                  onClick={handleNextPhase}
                  disabled={!seerTarget}
                  style={{ marginTop: '14px', opacity: seerTarget ? 1 : 0.6 }}
                >
                  🛡️ Kích hoạt Lá chắn Kỷ luật
                </button>
              </div>
            )}

            {phase === 'NIGHT_BODYGUARD' && (
              <div>
                <p><strong>[3. Lá chắn Kỷ luật (Bảo vệ) thức dậy]:</strong> Thiết lập kỷ luật bảo vệ cán bộ khỏi cạm bẫy lôi kéo. Không được bảo vệ 1 người liên tiếp 2 đêm.</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {players.filter(p => p.isAlive && p.id !== lastBodyguardTarget).map(p => (
                    <button
                      key={p.id}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.85rem',
                        background: '#b07a10',
                        color: 'white'
                      }}
                      onClick={() => triggerBodyguardAudit(p.id)}
                      disabled={bodyguardTarget !== null}
                    >
                      Bảo vệ {p.name}
                    </button>
                  ))}
                </div>
                {bodyguardTarget && (
                  <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontWeight: 'bold' }}>
                    Đã áp dụng Lá chắn Kỷ luật bảo vệ cho: {players.find(p => p.id === bodyguardTarget).name}
                  </div>
                )}
                <button
                  className="btn-reveal"
                  onClick={handleNextPhase}
                  disabled={!bodyguardTarget && window.confirm("Đêm nay không bảo vệ ai?")}
                  style={{ marginTop: '14px' }}
                >
                  ⚡ Người Đột phá hành động
                </button>
              </div>
            )}

            {phase === 'NIGHT_WITCH' && (
              <div>
                <p><strong>[4. Người Đột phá (Phù thủy) thức dậy]:</strong> Sử dụng cơ chế Sandbox và tinh thần "5 dám" để Đổi mới (Cứu) hoặc giữ Kỷ cương (Phạt).</p>
                
                {werewolfTarget && (
                  <div style={{ padding: '8px', background: 'rgba(224, 48, 80, 0.1)', border: '1px solid rgba(224, 48, 80, 0.2)', borderRadius: '8px', marginBottom: '14px' }}>
                    📌 Tín hiệu khẩn cấp: Đồng chí <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{players.find(p => p.id === werewolfTarget)?.name}</span> bị giặc nội xâm nhắm tới.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                  <div>
                    <h4>Bình thuốc Đổi mới (Cứu)</h4>
                    {witchHasSave ? (
                      <button
                        className="btn-nav"
                        style={{ background: '#1f8a5b', color: 'white', border: 'none' }}
                        onClick={() => triggerWitchAction('SAVE', werewolfTarget)}
                        disabled={!werewolfTarget || witchSaveTarget !== null}
                      >
                        Cứu {players.find(p => p.id === werewolfTarget)?.name || 'Cán bộ'}
                      </button>
                    ) : (
                      <span style={{ color: '#888' }}>Đã sử dụng</span>
                    )}
                  </div>
                  <div>
                    <h4>Bình thuốc Kỷ cương (Phạt)</h4>
                    {witchHasKill ? (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {players.filter(p => p.isAlive).map(p => (
                          <button
                            key={p.id}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#7030b8', color: 'white', border: 'none', borderRadius: '4px' }}
                            onClick={() => triggerWitchAction('KILL', p.id)}
                            disabled={witchKillTarget !== null}
                          >
                            Phạt {p.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#888' }}>Đã sử dụng</span>
                    )}
                  </div>
                </div>

                <button
                  className="btn-finish"
                  onClick={handleNextPhase}
                  style={{ marginTop: '20px' }}
                >
                  ☀️ Hừng đông (Xem kết quả đêm)
                </button>
              </div>
            )}

            {phase === 'DAY_ANNOUNCEMENT' && (
              <div>
                <p>Mặt trời đã lên. Bản án kỷ luật và danh sách hy sinh trong đêm đã được công bố.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-reveal" onClick={handleNextPhase}>📋 Chuyển sang biểu quyết ngày</button>
                </div>
              </div>
            )}

            {phase === 'DAY_VOTING' && (
              <div>
                <p><strong>[Biểu quyết Kỷ luật Đảng viên]:</strong> Tập thể thảo luận phê bình, loại bỏ Kẻ tha hóa. Áp dụng luật: "Không có vùng cấm, không có ngoại lệ".</p>
                
                <div style={{ display: 'flex', gap: '16px', background: 'rgba(111,15,30,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(193,18,47,0.08)', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {/* Day Audit option */}
                  <div style={{ flex: '1', minWidth: '220px' }}>
                    <h5 style={{ margin: '0 0 6px 0' }}>📋 Tặng phiếu bầu (Sát hạch đạo đức)</h5>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {players.filter(p => p.isAlive).map(p => (
                        <button
                          key={p.id}
                          style={{ padding: '3px 8px', fontSize: '0.75rem', background: '#2ead6d', color: 'white', border: 'none', borderRadius: '4px' }}
                          onClick={() => triggerDayAudit(p.id)}
                          disabled={doubleVotePlayerId !== null}
                        >
                          Sát hạch {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5-dám option */}
                  <div style={{ flex: '1', minWidth: '220px' }}>
                    <h5 style={{ margin: '0 0 6px 0' }}>⚡ Tinh thần "5 dám" (Đột phá trực tiếp)</h5>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <select id="damSource" style={{ padding: '4px', fontSize: '0.8rem' }}>
                        <option value="">Cán bộ ứng cử...</option>
                        {players.filter(p => p.isAlive).map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <span>nhắm</span>
                      <select id="damTarget" style={{ padding: '4px', fontSize: '0.8rem' }}>
                        <option value="">Kẻ nghi ngờ...</option>
                        {players.filter(p => p.isAlive).map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <button
                        style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#7030b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => {
                          const src = document.getElementById('damSource').value;
                          const tgt = document.getElementById('damTarget').value;
                          if (!src || !tgt) return alert("Vui lòng chọn đủ Cán bộ đột phá và Kẻ nghi ngờ!");
                          if (src === tgt) return alert("Không thể nhắm vào chính mình!");
                          trigger5DamAction(Number(src), Number(tgt));
                        }}
                      >
                        Đột phá!
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: '0 0 6px 0' }}>Đưa ra quyết định kỷ luật (Lynch):</h4>
                  {isBanVotesActive ? (
                    <div style={{ color: 'red', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
                      ⚠️ Phe Cách mạng bị mất chức năng biểu quyết hôm nay do loại nhầm Cán bộ Lão thành hôm qua!
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {players.filter(p => p.isAlive).map(p => (
                      <button
                        key={p.id}
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.85rem',
                          background: 'var(--crimson)',
                          color: 'white',
                          border: 'none',
                          opacity: isBanVotesActive && p.role !== 'SOl' ? 0.3 : 1
                        }}
                        onClick={() => handleVoteLynch(p.id)}
                      >
                        Kỷ luật {p.name}
                      </button>
                    ))}
                    <button
                      className="btn-nav"
                      onClick={() => handleVoteLynch(null)}
                      style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                    >
                      🤝 Không loại bỏ ai hôm nay
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 24 Players Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {players.map(p => {
              const details = ROLE_DETAILS[p.role];
              const isAlive = p.isAlive;
              return (
                <div
                  key={p.id}
                  style={{
                    background: isAlive 
                      ? (phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.06)' : '#ffffff') 
                      : (phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.02)' : '#e2e2e2'),
                    color: isAlive ? 'inherit' : '#888',
                    border: isAlive 
                      ? (p.hasDoubleVote ? '2px solid var(--sun)' : `1px solid ${phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.1)' : 'rgba(193,18,47,0.12)'}`) 
                      : '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                    boxShadow: isAlive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    opacity: isAlive ? 1 : 0.6,
                    position: 'relative',
                    textDecoration: isAlive ? 'none' : 'line-through'
                  }}
                >
                  {/* ID badge */}
                  <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>#{p.id}</div>
                  
                  {/* Status indicators */}
                  <div style={{ position: 'absolute', top: '6px', right: '8px', display: 'flex', gap: '3px' }}>
                    {p.role === 'LAO_THANH' && isAlive && <span title={`Còn ${p.lives} mạng`}>👴 x{p.lives}</span>}
                    {p.hasDoubleVote && <span title="Có 2 phiếu bầu hôm nay">🗳️ x2</span>}
                    {!isAlive && <span title="Đã hy sinh/kỷ luật">💀</span>}
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '1rem', fontWeight: '700' }}>
                    {p.name}
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                    {isModeratorView || !isAlive || p.role === 'SOl' && players.find(x => x.id === p.id && x.role === 'SOl') && phase === 'NIGHT_WEREWOLVES' ? (
                      <span style={{ color: details.color }}>
                        {details.icon} {details.name}
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>❓ Cách mạng</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Real-time logs */}
        <div style={{
          background: phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.03)' : '#fffdfa',
          borderLeft: `1px solid ${phase.startsWith('NIGHT') ? 'rgba(255,255,255,0.1)' : 'rgba(193,18,47,0.15)'}`,
          padding: '20px 16px',
          borderRadius: '16px',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          boxShadow: 'var(--card-shadow), var(--ring)',
          textAlign: 'left'
        }}>
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid rgba(193, 18, 47, 0.15)', paddingBottom: '8px', fontFamily: 'Cinzel, serif', color: phase.startsWith('NIGHT') ? 'var(--sun)' : 'var(--crimson)' }}>
            📜 NHẬT KÝ KỶ NGUYÊN
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', lineHeight: '1.4' }}>
            {logs.map((log, index) => (
              <div key={index} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '8px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameBoard;
