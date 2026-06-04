import { useEffect, useState } from 'react'
import './App.css'
import QuestionCard from './components/QuestionCard'
import Scoreboard from './components/Scoreboard'
import HallOfFame from './components/HallOfFame'
import StartScreen from './components/StartScreen'

const questionsData = [
  // --- PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH VỀ ĐẠO ĐỨC CÁCH MẠNG ---
  {
    q: "Chủ tịch Hồ Chí Minh đã ví đạo đức cách mạng với hình ảnh nào để nhấn mạnh tính nền tảng của nó?",
    opts: ["Ngọn hải đăng soi đường cho con thuyền", "Nền móng vững chắc của một ngôi nhà", "Gốc của cây, ngọn nguồn của sông", "Bánh lái của con thuyền cách mạng"],
    ans: 2, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Theo Hồ Chí Minh, mục đích hoạt động của Đảng ta là gì?",
    opts: ["Lãnh đạo nhân dân giành chính quyền bằng bạo lực", "Làm cho dân tộc được độc lập, nhân dân có cuộc sống ấm no, tự do, hạnh phúc thực sự", "Xây dựng nền kinh tế thị trường phát triển", "Hoàn thành công nghiệp hóa, hiện đại hóa đất nước"],
    ans: 1, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Theo tư tưởng Hồ Chí Minh, 4 chuẩn mực cốt lõi của đạo đức cách mạng bao gồm những gì?",
    opts: ["Trung với nước, hiếu với dân", "Yêu thương con người; Tinh thần quốc tế trong sáng", "Cần, kiệm, liêm, chính, chí công vô tư", "Tất cả các phương án trên"],
    ans: 3, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Hồ Chí Minh khẳng định người cách mạng có phẩm chất 'Cần, kiệm, liêm, chính' sẽ đạt được bản lĩnh nào?",
    opts: ["Giàu sang không thể quyến rũ, nghèo khó không thể chuyển lay, uy lực không thể khuất phục", "Dám nghĩ, dám làm, dám chịu trách nhiệm", "Tuyệt đối trung thành với lý tưởng của Đảng", "Không ngại gian khổ, sẵn sàng hy sinh vì nước"],
    ans: 0, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Hồ Chí Minh đã gọi 'tham ô, lãng phí, quan liêu' là loại giặc gì?",
    opts: ["Giặc ngoại xâm", "Giặc dốt", "Giặc đói", "Giặc nội xâm, giặc ở trong lòng"],
    ans: 3, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Tội lỗi của hành vi tham ô, lãng phí, quan liêu được Hồ Chí Minh so sánh nặng như tội lỗi nào?",
    opts: ["Tội phản quốc", "Tội làm gián điệp", "Tội lỗi Việt gian, mật thám", "Tội vô trách nhiệm gây hậu quả nghiêm trọng"],
    ans: 2, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Hồ Chí Minh quan niệm 'chống tham nhũng, lãng phí' phải gắn liền với việc chống căn bệnh nào?",
    opts: ["Bệnh thành tích", "Bệnh quan liêu", "Bệnh giáo điều", "Bệnh chủ quan"],
    ans: 1, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Theo Hồ Chí Minh, Đảng văn minh là một Đảng tiêu biểu cho điều gì của dân tộc?",
    opts: ["Lương tâm, trí tuệ và danh dự", "Bản lĩnh, trí tuệ và văn hóa", "Đạo đức, bản lĩnh và kỷ luật", "Trí tuệ, đạo đức và sức mạnh"],
    ans: 0, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Để giữ gìn Đảng ta thật trong sạch, Hồ Chí Minh yêu cầu mỗi đảng viên và cán bộ phải làm gì?",
    opts: ["Thường xuyên học tập nâng cao lý luận", "Thật sự thấm nhuần đạo đức cách mạng, thật sự cần, kiệm, liêm, chính, chí công vô tư", "Rèn luyện kỹ năng chuyên môn nghiệp vụ", "Nắm vững pháp luật nhà nước"],
    ans: 1, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },
  {
    q: "Người cán bộ, đảng viên đối với nhân dân phải có thái độ như thế nào theo quan điểm của Hồ Chí Minh?",
    opts: ["Hoàn thành tốt mọi nhiệm vụ được giao phó", "Tận tâm, tận lực cống hiến", "Sẵn sàng vui vẻ làm trâu ngựa, làm tôi tớ trung thành của nhân dân", "Chỉ đạo, dẫn dắt nhân dân làm kinh tế"],
    ans: 2, part: "PHẦN 1: TƯ TƯỞNG HỒ CHÍ MINH"
  },

  // --- PHẦN 2: TINH THẦN ĐẠI HỘI XIV ---
  {
    q: "Theo Văn kiện Đại hội XIV, phương châm kiên định trong đấu tranh phòng, chống tham nhũng, lãng phí, tiêu cực là gì?",
    opts: ["Xử lý từ từ, cẩn trọng, chắc chắn", "Kiên quyết, kiên trì, không ngừng, không nghỉ, không có vùng cấm, không có ngoại lệ", "Tập trung vào cán bộ cấp cao để làm gương", "Ưu tiên các biện pháp phạt hành chính"],
    ans: 1, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Đại hội XIV tiếp tục xác định công tác nào là 'then chốt của then chốt'?",
    opts: ["Công tác kiểm tra, giám sát", "Công tác dân vận", "Công tác cán bộ", "Công tác tư tưởng, lý luận"],
    ans: 2, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Để phòng, chống tham nhũng hiệu quả, Đại hội XIV chủ trương xây dựng cơ chế nào?",
    opts: ["'Không thể', 'không dám', 'không muốn', 'không cần' tham nhũng", "'Không thể', 'không nghĩ', 'không dám', 'không làm' tham nhũng", "'Không dám', 'không biết', 'không nghe', 'không nói' tham nhũng", "'Không được', 'không thể', 'không ai', 'không dám' tham nhũng"],
    ans: 0, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Đại hội XIV quy định thước đo quan trọng nhất để đánh giá hiệu quả của cán bộ là gì?",
    opts: ["Số lượng bằng cấp và thâm niên công tác", "Sự hài lòng, tín nhiệm của người dân, doanh nghiệp và hiệu quả công việc", "Khả năng phát biểu và soạn thảo văn bản", "Tỷ lệ hoàn thành công việc đúng hạn"],
    ans: 1, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Đại hội XIV đặc biệt nhấn mạnh chủ trương bảo vệ và khuyến khích đối tượng cán bộ nào?",
    opts: ["Cán bộ có thâm niên, làm việc lâu năm", "Cán bộ năng động, sáng tạo, dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung", "Cán bộ làm việc an toàn, đúng quy trình tuyệt đối", "Cán bộ có nhiều bằng cấp quốc tế"],
    ans: 1, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Quy định nào mới được ban hành năm 2024 về chuẩn mực đạo đức cách mạng của cán bộ, đảng viên trong giai đoạn mới được Văn kiện Đại hội XIV nhắc tới?",
    opts: ["Quy định số 37-QĐ/TW", "Quy định số 08-QĐi/TW", "Quy định số 144-QĐ/TW", "Quy định số 205-QĐ/TW"],
    ans: 2, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Theo Văn kiện Đại hội XIV, phẩm chất nền tảng của đạo đức công vụ mà mỗi cán bộ, đảng viên phải coi trọng là gì?",
    opts: ["Lòng nhân ái", "Tinh thần đồng đội", "Sự siêng năng", "Liêm chính, tự soi, tự sửa"],
    ans: 3, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Để 'không cần' tham nhũng, tiêu cực, Đại hội XIV đề ra giải pháp cụ thể nào về chế độ đãi ngộ?",
    opts: ["Cải cách chính sách tiền lương, được trả lương và đãi ngộ phù hợp với cống hiến, tài năng", "Tăng cường trao thưởng cuối năm", "Hỗ trợ nhà ở cho tất cả cán bộ", "Miễn giảm thuế thu nhập cá nhân"],
    ans: 0, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Đại hội XIV coi trọng việc kết hợp hài hoà giữa 'xây' và 'chống', trong đó tính chất của hai nhiệm vụ này được xác định như thế nào?",
    opts: ["'Chống' là cơ bản, lâu dài; 'xây' là cấp bách", "Cả hai đều là nhiệm vụ cấp bách, phải làm ngay", "'Xây' là nhiệm vụ cơ bản, chiến lược lâu dài; 'chống' là nhiệm vụ quan trọng, thường xuyên, cấp bách", "Ưu tiên 'xây' hoàn toàn, hạn chế 'chống'"],
    ans: 2, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
  {
    q: "Văn kiện Đại hội XIV chỉ ra nguyên nhân gốc rễ của những vi phạm kỷ luật, pháp luật trong đội ngũ cán bộ là do đâu?",
    opts: ["Suy thoái về tư tưởng chính trị, đạo đức, lối sống", "Trình độ chuyên môn nghiệp vụ kém", "Hoàn cảnh khách quan ép buộc", "Quy định pháp luật lỏng lẻo"],
    ans: 0, part: "PHẦN 2: TINH THẦN ĐẠI HỘI XIV"
  },
];

const TOTAL = 20;
const TIMER_SECONDS = 20;

const labels = ['A', 'B', 'C', 'D'];

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scores, setScores] = useState({ 1: 100, 2: 100, 3: 100, 4: 100, 5: 100 });
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const question = questionsData[currentQuestion];

  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setIsTimerRunning(false);
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

  const updateScore = (team, amount) => {
    setScores(prev => ({
      ...prev,
      [team]: prev[team] + amount
    }));
  };

  const startTimer = () => {
    if (!isTimerRunning && timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowAnswer(false);
    setScores({ 1: 100, 2: 100, 3: 100, 4: 100, 5: 100 });
    setTimeLeft(TIMER_SECONDS);
    setIsTimerRunning(false);
    setGameOver(false);
    setGameStarted(false);
  };

  if (gameOver) {
    return <HallOfFame scores={scores} onRestart={handleRestart} />;
  }

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />;
  }

  return (
    <>
      <header>
        <h1>⚔ ĐẠI CHIẾN THÀNH TRÌ ⚔</h1>
        <div className="subtitle">
          Câu {currentQuestion + 1} / {TOTAL}
        </div>
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
      />

      <Scoreboard
        scores={scores}
        onUpdateScore={updateScore}
      />
    </>
  )
}

export default App