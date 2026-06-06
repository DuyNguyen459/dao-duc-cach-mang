import { useEffect, useState } from 'react';

const TIMER_MAX = 20;

const ActionModal = ({ isOpen, question, roleName, onAnswer }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedIdx(null);
      setIsSubmitted(false);
      setTimeLeft(TIMER_MAX);
      setIsTimerRunning(true);
    }
  }, [isOpen, question]);

  useEffect(() => {
    if (!isOpen || !isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          // Auto-submit as wrong when time runs out
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isTimerRunning, timeLeft]);

  const handleTimeout = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    // Timeout is incorrect
  };

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null || isSubmitted) return;
    setIsSubmitted(true);
    setIsTimerRunning(false);
  };

  const handleConfirm = () => {
    const isCorrect = selectedIdx === question.ans;
    onAnswer(isCorrect);
  };

  if (!isOpen) return null;

  const labels = ['A', 'B', 'C', 'D'];
  const isCorrectAnswer = selectedIdx === question.ans;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(42, 23, 18, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: '#ffffff',
        width: 'min(780px, 95vw)',
        borderRadius: '22px',
        padding: '32px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(193, 18, 47, 0.1)',
        position: 'relative',
        textAlign: 'center',
        border: '1px solid rgba(193, 18, 47, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Background Gradients */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(350px 150px at 50% 0%, rgba(247, 201, 72, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Header Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="part-badge" style={{ fontSize: '0.8rem', padding: '5px 14px' }}>
            {question.part}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>Sát hạch:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--crimson)' }}>{roleName}</span>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: `2px solid ${timeLeft <= 5 ? '#e03050' : 'var(--sun)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: timeLeft <= 5 ? '#e03050' : 'var(--ink)',
            fontSize: '1.1rem',
            fontFamily: 'Cinzel, serif',
            background: timeLeft <= 5 ? '#fff0f2' : '#fffcf0',
            boxShadow: timeLeft <= 5 ? '0 0 10px rgba(224, 48, 80, 0.3)' : 'none',
            animation: timeLeft <= 5 ? 'timer-pulse 0.5s infinite' : 'none'
          }}>
            {timeLeft}
          </div>
        </div>

        {/* Question Text */}
        <div style={{
          fontSize: '1.4rem',
          fontWeight: '700',
          lineHeight: '1.45',
          color: 'var(--ink)',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          {question.q}
        </div>

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '12px',
          marginBottom: '26px'
        }}>
          {question.opts.map((opt, idx) => {
            let borderStyle = '1px solid rgba(193, 18, 47, 0.12)';
            let bgStyle = '#fff7e6';
            let textColor = 'var(--ink)';

            if (!isSubmitted) {
              if (selectedIdx === idx) {
                borderStyle = '2px solid var(--crimson)';
                bgStyle = 'rgba(193, 18, 47, 0.05)';
              }
            } else {
              // Submitted state
              if (idx === question.ans) {
                // Correct answer
                borderStyle = 'none';
                bgStyle = 'linear-gradient(120deg, #1f8a5b, #2ead6d)';
                textColor = '#fff';
              } else if (selectedIdx === idx) {
                // Incorrect chosen answer
                borderStyle = 'none';
                bgStyle = 'linear-gradient(120deg, #c1122f, #e03050)';
                textColor = '#fff';
              }
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: borderStyle,
                  background: bgStyle,
                  color: textColor,
                  cursor: isSubmitted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 10px rgba(111,15,30,0.04)'
                }}
                className={!isSubmitted ? "option-hover-modal" : ""}
              >
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: (isSubmitted && (idx === question.ans || selectedIdx === idx)) ? 'rgba(255,255,255,0.2)' : 'rgba(193, 18, 47, 0.08)',
                  color: (isSubmitted && (idx === question.ans || selectedIdx === idx)) ? '#fff' : 'var(--crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}>{labels[idx]}</span>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          {!isSubmitted ? (
            <button
              className="btn-reveal"
              onClick={handleSubmit}
              disabled={selectedIdx === null}
              style={{
                padding: '12px 36px',
                fontSize: '1rem',
                opacity: selectedIdx === null ? 0.5 : 1,
                cursor: selectedIdx === null ? 'not-allowed' : 'pointer'
              }}
            >
              📥 NỘP BÀI SÁT HẠCH
            </button>
          ) : (
            <button
              className="btn-finish"
              onClick={handleConfirm}
              style={{
                padding: '12px 42px',
                fontSize: '1.05rem',
                background: isCorrectAnswer ? 'linear-gradient(120deg, #1f8a5b, #2ead6d)' : 'linear-gradient(120deg, #c1122f, #e03050)',
                boxShadow: isCorrectAnswer ? '0 10px 20px rgba(31, 138, 91, 0.3)' : '0 10px 20px rgba(193, 18, 47, 0.3)'
              }}
            >
              {isCorrectAnswer ? '✅ ĐẠT - THỰC HIỆN HÀNH ĐỘNG' : '❌ HỎNG - BỊ VÔ HIỆU HÓA'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
