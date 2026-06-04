const TIMER_MAX = 20;

// SVG circular countdown timer
const CircleTimer = ({ timeLeft, isTimerRunning, onClick }) => {
  const R = 38;
  const C = 2 * Math.PI * R;         // circumference
  const ratio = timeLeft / TIMER_MAX;
  const dash  = C * ratio;
  const urgent = timeLeft <= 5 && isTimerRunning;
  const done   = timeLeft === 0;

  // Color transitions: gold → orange → red
  const strokeColor = done
    ? '#666'
    : urgent
    ? '#e03050'
    : timeLeft <= 10
    ? '#d4780a'
    : '#c89820';

  return (
    <button
      className={`timer-circle${urgent ? ' urgent' : ''}${done ? ' done' : ''}`}
      onClick={onClick}
      disabled={isTimerRunning || done}
      title={done ? 'Hết giờ' : isTimerRunning ? 'Đang đếm' : 'Bấm để bắt đầu'}
    >
      <svg viewBox="0 0 90 90" width="90" height="90">
        {/* Background track */}
        <circle
          cx="45" cy="45" r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        {/* Progress arc — counterclockwise from top */}
        <circle
          cx="45" cy="45" r={R}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          strokeDashoffset="0"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 0.9s linear, stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${strokeColor})` }}
        />
        {/* Center number */}
        <text
          x="45" y="45"
          dominantBaseline="central"
          textAnchor="middle"
          fill={done ? '#555' : strokeColor}
          fontSize="22"
          fontFamily="'Cinzel', serif"
          fontWeight="700"
          style={{ filter: done ? 'none' : `drop-shadow(0 0 4px ${strokeColor})` }}
        >
          {timeLeft}
        </text>
      </svg>
    </button>
  );
};

const QuestionCard = ({
  question,
  currentQuestion,
  showAnswer,
  labels,
  timeLeft,
  isTimerRunning,
  onStartTimer,
  onPrev,
  onNext,
  onReveal,
  isLast,
}) => {
  return (
    <div className="main-content">
      <div className="question-card">
        <div className="meta-row">
          <div className="part-badge">{question.part}</div>
          <CircleTimer
            timeLeft={timeLeft}
            isTimerRunning={isTimerRunning}
            onClick={onStartTimer}
          />
        </div>

        <div className="question-text">Câu {currentQuestion + 1}: {question.q}</div>

        <div className="options-grid">
          {question.opts.map((opt, index) => (
            <div
              key={index}
              className={`option ${showAnswer && index === question.ans ? 'correct' : ''}`}
            >
              <span className="option-letter">{labels[index]}.</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>

        <div className="controls">
          <button className="btn-nav" onClick={onPrev}>◄ Câu trước</button>
          <button className="btn-reveal" onClick={onReveal}>Hiển thị đáp án</button>
          {isLast
            ? <button className="btn-finish" onClick={onNext}>⚔ Hoàn thành</button>
            : <button className="btn-nav" onClick={onNext}>Câu tiếp theo ►</button>
          }
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;