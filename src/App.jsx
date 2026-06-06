import { useEffect, useState } from 'react';
import './App.css';
import QuestionCard from './components/QuestionCard';
import HallOfFame from './components/HallOfFame';
import StartScreen from './components/StartScreen';
import { questionsData } from './data/questions';

const TOTAL = 30;
const TIMER_SECONDS = 20;

const labels = ['A', 'B', 'C', 'D'];

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const question = questionsData[currentQuestion];

  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setIsTimerRunning(false);
    setSelectedAnswer(null);
  }, [currentQuestion]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
  }, [timeLeft]);

  const nextQuestion = () => {
    if (currentQuestion < TOTAL - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
    } else {
      setGameOver(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowAnswer(false);
    }
  };

  const startTimer = () => {
    if (!isTimerRunning && timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowAnswer(false);
    setTimeLeft(TIMER_SECONDS);
    setIsTimerRunning(false);
    setGameOver(false);
    setGameStarted(false);
  };

  if (gameOver) {
    return <HallOfFame onRestart={handleRestart} />;
  }

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />;
  }

  return (
    <>
      <header>
        <h1>⚔ KỶ NGUYÊN VƯƠN MÌNH ⚔</h1>
      </header>

      <QuestionCard
        key={currentQuestion}
        question={question}
        currentQuestion={currentQuestion}
        showAnswer={showAnswer}
        labels={labels}
        timeLeft={timeLeft}
        isTimerRunning={isTimerRunning}
        onStartTimer={startTimer}
        onPrev={prevQuestion}
        onNext={nextQuestion}
        onReveal={() => setShowAnswer(true)}
        isLast={currentQuestion === TOTAL - 1}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={setSelectedAnswer}
      />
    </>
  );
}

export default App;