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
  onReveal
}) => {
  return (
    <div className="main-content">
      <div className="question-card">
        <div className="meta-row">
          <div className="part-badge">{question.part}</div>
          <button
            className={`timer-btn ${timeLeft <= 5 && isTimerRunning ? 'urgent' : ''}`}
            onClick={onStartTimer}
            disabled={isTimerRunning || timeLeft === 0}
          >
            <span className="timer-value">{timeLeft}s</span>
            <span className="timer-label">
              {timeLeft === 0 ? 'Hết giờ' : isTimerRunning ? 'Đang đếm' : 'Bấm để bắt đầu'}
            </span>
          </button>
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
          <button className="btn-nav" onClick={onNext}>Câu tiếp theo ►</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;