import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../ActionProvider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowCircleDownSharpIcon from '@mui/icons-material/ArrowCircleDownSharp';
import ArrowCircleUpSharpIcon from '@mui/icons-material/ArrowCircleUpSharp';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';
import { createChatBotMessage } from 'react-chatbot-kit';
import { saveAs } from 'file-saver';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function StartQuizBtn(props) {
  const { domain, role, specific_topic, difficulty_level } = props.state.userData;
  const { updateState, createChatBotMessage } = useContext(ChatContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [introMessageShown, setIntroMessageShown] = useState(false);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [showQuizEndMessage, setShowQuizEndMessage] = useState(false);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [chatInputDisabled, setChatInputDisabled] = useState(true);
  const [copyIconClicked, setCopyIconClicked] = useState(false);

  const handleNext = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setShowAnswers(prevState => ({ ...prevState, [questions[currentQuestionIndex].id]: false }));
      setAnswerVisible(false);
    } else {
      handleEnd();
    }
  };

  const handlePrevious = () => {
    const prevQuestionIndex = currentQuestionIndex - 1;
    if (prevQuestionIndex >= 0) {
      setCurrentQuestionIndex(prevQuestionIndex);
      setShowAnswers(prevState => ({ ...prevState, [questions[currentQuestionIndex].id]: false }));
      setAnswerVisible(false);
    }
  };

  const handleEnd = () => {
    const welcomeMessage = createChatBotMessage("🌟 Welcome to your personalized mock interview session! 🌟", {
      widget: "startBtn"
    });
    updateState(welcomeMessage, 'replace');

    props.setState((prev) => ({
      ...prev,
      checker: null,
      userData: {
        domain: "",
        role: "",
        specific_topic: "",
        difficulty_level: ""
      },
      questions: ""
    }));

    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setIntroMessageShown(false);
    setFetchingQuestions(false);
    setAnswerVisible(false);
    setStartButtonDisabled(false);
    setChatInputDisabled(true);
    setQuestions([]);
    setCopyIconClicked(false);
  };

  const handleToggleAnswer = () => {
    setAnswerVisible(prevState => !prevState);
  };

  const fetchData = async () => {
    try {
      console.log('Fetching questions with difficulty level:', difficulty_level);
      console.log('Fetching questions with domain:', domain);
      console.log('Fetching questions with role:', role);
      console.log('Fetching questions with topic:', specific_topic);
      setStartButtonDisabled(true);
      setFetchingQuestions(true);
      setChatInputDisabled(true);
      const response = await fetch('https://content-crafter-dev.stackroute.in/crafter/api/v2/interview/generate_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, role, specific_topic, difficulty_level }),
      });
      const data = await response.json();
      console.log('Interview questions:', data.questions);
      setQuestions(data.questions);
      setIntroMessageShown(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      updateState(createChatBotMessage('Oops! Something went wrong while preparing a set of questions for you. Please refresh the bot or try again later.'));
    } finally {
      setFetchingQuestions(false);
    }
  };

  const handleDownloadQuestions = () => {
    const pdf = new jsPDF({
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm',
      compress: true,
      lineHeight: 1.2,
      autoPage: true,
    });
  
    let yOffset = 20; // Initial vertical position
    const pageWidth = pdf.internal.pageSize.width;
  
    // Add title
    const title = 'Interview Questions';
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / pdf.internal.scaleFactor; // Calculate width of title
    const titleX = (pageWidth - titleWidth) / 2; // Calculate x-coordinate to center title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold'); // Set font to Helvetica and style to bold
    pdf.setTextColor(0, 0, 0); // Black color
    pdf.text(title, titleX, yOffset);
    yOffset += 10; // Adjust vertical position after title
  
    // Add questions and answers
    questions.forEach((question, index) => {
      const questionText = `Question ${index + 1}: ${question.question}`;
      const answerText = `Answer ${index + 1}: ${question.answer}`;
  
      // Add question
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal'); // Set font to Helvetica and style to normal
      pdf.setTextColor(0, 0, 0); // Black color
      const splitQuestion = pdf.splitTextToSize(questionText, pageWidth - 20); // Split text to fit page width
      pdf.text(splitQuestion, 10, yOffset);
  
      yOffset += splitQuestion.length * 5 + 5; // Adjust vertical position after question
  
      // Add answer
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0); // Black color
      const splitAnswer = pdf.splitTextToSize(answerText, pageWidth - 20); // Split text to fit page width
      pdf.text(splitAnswer, 10, yOffset);
  
      yOffset += splitAnswer.length * 5 + 10; // Adjust vertical position after answer
      if (yOffset > pdf.internal.pageSize.height - 10) {
        pdf.addPage(); // Add a new page if content exceeds the current page height
        yOffset = 20; // Reset vertical position
      }
    });
  
    pdf.save('interview_questions.pdf');
  };
  
  
  
  

  const handleCopyQuestions = () => {
    const question = questions[currentQuestionIndex];
    navigator.clipboard.writeText(`Question ${currentQuestionIndex + 1}: ${question.question}\nAnswer ${currentQuestionIndex + 1}: ${question.answer}`);
    setCopyIconClicked(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyIconClicked(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [copyIconClicked]);

  return (
    <div style={{ position: 'relative' }}>
      
      {!quizCompleted && !introMessageShown && (
        <Tooltip title="Click here to start interview">
        <button
          className="start-btn"
          onClick={fetchData}
          disabled={startButtonDisabled}
          style={{ cursor: startButtonDisabled ? 'not-allowed' : 'pointer', opacity: startButtonDisabled ? '0.5' : '1' }}
        >
          Start
        </button>
        </Tooltip>
      )}
      {fetchingQuestions && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </div>
      )}
      {(!quizCompleted || introMessageShown) && !fetchingQuestions && (
        <>
          {introMessageShown && (
            <Card
              sx={{ width: '70%', margin: 'auto', marginTop: '20px', backgroundColor: '#3c82bc', marginLeft: '52px', position: 'relative' }}
              id="question-card"
            >
              <CardContent>
                {!showQuizEndMessage ? (
                  <>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      style={{ color: '#fff', fontFamily: 'Segoe UI', fontSize: '16px', marginTop: '20px' }}
                    >
                      Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]?.question}
                    </Typography>
                    <CardActions style={{ flexDirection: 'column' }}>
                      <Button
                        onClick={handleToggleAnswer}
                        style={{ fontSize: '16px', color: '#FFFFFF', marginTop: '10px', textTransform: 'none', fontFamily: 'Segoe UI' }}
                      >
                        <Tooltip title={answerVisible ? "Click to hide answer" : "Click to view answer"} style={{ backgroundColor: '#3C82BC' }}>
                          {answerVisible ? <ArrowCircleUpSharpIcon style={{ fontSize: '30px' }} /> : <ArrowCircleDownSharpIcon style={{ fontSize: '30px' }} />}
                        </Tooltip>
                      </Button>
                      {answerVisible && (
                        <Typography variant="body2" color="text.secondary" style={{ color: '#fff', fontFamily: 'Segoe UI' }}>
                          {questions[currentQuestionIndex]?.answer}
                        </Typography>
                      )}
                    </CardActions>
                  </>
                ) : (
                  <Typography variant="body1" style={{ color: '#FFFFFF' }}>
                    Quiz completed! Click Restart if you'd like to reattempt.
                  </Typography>
                )}
              </CardContent>
              <CardActions style={{ backgroundColor: '#3c82bc' }}>
                <Tooltip title="Click here to download the questions">
                  <Button
                    onClick={handleDownloadQuestions}
                    style={{
                      fontSize: '16px',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontFamily: 'Segoe UI',
                      position: 'absolute',
                      top: '5px',
                      right: '10px',
                    }}
                    startIcon={<DownloadIcon style={{ fontSize: 25 }} />}
                  />
                </Tooltip>
                <Tooltip title={copyIconClicked ? "Copied!" : "Click here to copy the questions and answers"}>
                  <Button
                    onClick={handleCopyQuestions}
                    style={{
                      fontSize: '16px',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      fontFamily: 'Segoe UI',
                      position: 'absolute',
                      top: '5px',
                      right: '50px',
                    }}
                    startIcon={copyIconClicked ? <CheckCircleIcon style={{ fontSize: 25 }} /> : <FileCopyIcon style={{ fontSize: 25 }} />}
                  />
                </Tooltip>
              </CardActions>
              <CardActions style={{ backgroundColor: '#3c82bc', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '12px', padding: '1%' }}>
                  {!quizCompleted && currentQuestionIndex !== 0 && (
                    <Tooltip title="Go to previous question">
                      <Button
                        onClick={handlePrevious}
                        sx={{
                          color: '#FFFFFF',
                          marginLeft: '4px',
                          marginRight: '4px',
                          marginTop: '2px',
                          fontWeight: 'bold',
                          backgroundColor: '#020500',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#020500' },
                        }}
                      >
                        Previous
                      </Button>
                    </Tooltip>
                  )}
                  {!quizCompleted && currentQuestionIndex !== questions.length - 1 && (
                    <Tooltip title="Go to next question">
                      <Button
                        onClick={handleNext}
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          marginLeft: '4px',
                          marginRight: '4px',
                          marginTop: '2px',
                          backgroundColor: '#020500',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#020500' },
                        }}
                      >
                        Next
                      </Button>
                    </Tooltip>
                  )}
                  {!quizCompleted && (
                    <Tooltip title="End the interview and start again">
                      <Button
                        onClick={handleEnd}
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          backgroundColor: 'red',
                          marginLeft: '4px',
                          marginRight: '4px',
                          marginTop: '2px',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: 'red' },
                        }}
                      >
                        End
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </CardActions>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
