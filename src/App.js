 
  import { useState, useEffect } from 'react';
  import './App.css';
  
  function App() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [timer, setTimer] = useState(15);
  
    useEffect(() => {
      getQuestionsFromAPI();
    }, []);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        if (timer > 0 && !selectedOption) {
          setTimer(timer - 1);
        } else if (timer === 0) {
          next();
        }
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [timer, selectedOption]);
  
    function getQuestionsFromAPI() {
      fetch('https://the-trivia-api.com/v2/questions')
        .then((res) => res.json())
        .then((res) => {
          res.forEach(function (item) {
            item.options = [...item.incorrectAnswers, item.correctAnswer];
            item.options = shuffle(item.options);
          });
          setQuestions(res);
        });
    }
  
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;
  
      while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
  
      return array;
    }
  
    function next() {
      if (selectedOption === currentQuestion.correctAnswer) {
        setCorrectAnswers(correctAnswers + 1);
      }
  
      setCurrentIndex(currentIndex + 1);
      setTimer(15); 
      setSelectedOption(null);
    }
  
    function restart() {
      setCurrentIndex(0);
      setCorrectAnswers(0);
      setTimer(15);
      setSelectedOption(null);
    }
  
    const quizEnded = currentIndex === questions.length;
    const currentQuestion = questions[currentIndex];
  
    return (
      <div className="app-container">
        <div className="quiz-container">
          {!quizEnded ? (
            <div className="questions">
              <h2>
                Q{currentIndex + 1}: {currentQuestion.question.text}
              </h2>
              <p>Time Remaining: {timer} seconds</p>
              {currentQuestion.options.map(function (item) {
                return (
                  <div key={item} className="option">
                    <input
                      name="q"
                      type="radio"
                      value={item}
                      checked={selectedOption === item}
                      onChange={() => setSelectedOption(item)}
                    />
                    {item}
                  </div>
                );
              })}
              <button className="next-button" onClick={next}>
                Next
              </button>
            </div>
          ) : (
            <div className="result">
              <h2>Result</h2>
              <p>
                {`You scored ${(
                  (correctAnswers / questions.length) *
                  100
                ).toFixed(2)}%`}
              </p>
              {correctAnswers / questions.length < 0.5 ? (
                <p className="fail-message">You failed!</p>
              ) : (
                <p className="pass-message">You passed!</p>
              )}
              <button className="restart-button" onClick={restart}>
                Restart
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default App;



