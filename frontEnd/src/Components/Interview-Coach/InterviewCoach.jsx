import React, { useState, useContext, useEffect } from 'react';
import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import ActionProvider, { ChatContext } from './chatbox/ActionProvider';
import MessageParser from './chatbox/MessageParser';
import config from './chatbox/config';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './InterviewCoach.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Correct import statement
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ReportProvider, ReportContext } from './ReportContext'; // Adjust the path
import QuizQuestions from './QuizQuestions'; // Import the QuizQuestions component
import axios from 'axios'; // Import axios
import DownloadIcon from '@mui/icons-material/Download'; // Import the download icon
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation

const InterviewCoach = () => {
  const [showMore, setShowMore] = useState(true); // Changed to always show the latest report
  const [progress, setProgress] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [storedReports, setStoredReports] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [chatbotVisible, setChatbotVisible] = useState(true); // New state to control chatbot visibility
  const [scenarios, setScenarios] = useState([]); // State to hold fetched scenarios
  const [loading, setLoading] = useState(false); // State to control loading spinner
  const totalQuestions = 10; // Assuming there are 10 questions

  const navigate = useNavigate();
  const { report } = useContext(ReportContext); // Use report from context

  const backToHome = () => {
    navigate('/');
  };

  // Update progress when the number of attempted questions changes
  useEffect(() => {
    const totalScore = storedReports.reduce(
      (acc, curr) => acc + (curr.user_answer_score || 0),
      0,
    );
    const overallScorePercentage =
      (totalScore / (questionsAttempted * 10)) * 100;
    setProgress(overallScorePercentage);
  }, [questionsAttempted, storedReports]);

  // Store report in the array and update attempted questions
  useEffect(() => {
    if (report.user_answer) {
      setStoredReports((prevReports) => {
        const updatedReports = [...prevReports];
        updatedReports[questionsAttempted] = report;
        setSelectedQuestion(questionsAttempted); // Automatically show the latest report
        return updatedReports;
      });
      setQuestionsAttempted((prev) => Math.min(prev + 1, totalQuestions));
    }
  }, [report]);

  const handleCircleClick = (index) => {
    if (index < questionsAttempted) {
      setSelectedQuestion(index);
      setShowMore(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleAnswerSubmit = () => {
    setOpenSnackbar(true);
  };

  const fetchScenarios = async (userData) => {
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.post(
        'https://content-crafter-dev.stackroute.in/crafter/api/v2/interview_coach/generate_questions',
        // 'http://localhost:8000/crafter/api/v2/interview_coach/generate_questions',
        userData,
      );
      console.log(response);

      if (response.data && response.data.challenges) {
        setScenarios(response.data.challenges);
        setChatbotVisible(false); // Hide chatbot when questions are fetched
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const currentReport = storedReports[selectedQuestion] || {};

  const downloadReport = () => {
    const doc = new jsPDF();
    storedReports.forEach((report, index) => {
      doc.text(`Question ${index + 1}:`, 10, 10 + index * 20);
      doc.text(
        `Scenario: ${report.interviewer_question_scenario}`,
        10,
        20 + index * 20,
      );
      doc.text(
        `Challenge: ${report.interviewer_question_challenge}`,
        10,
        30 + index * 20,
      );
      doc.text(`Your Answer: ${report.user_answer}`, 10, 40 + index * 20);
      doc.text(`Feedback: ${report.feedback_to_user}`, 10, 50 + index * 20);
      doc.text(
        `Suggested Answer: ${report.suggested_answer}`,
        10,
        60 + index * 20,
      );
      doc.text(`Score: ${report.user_answer_score}`, 10, 70 + index * 20);
    });
    doc.save('Report.pdf');
  };

  return (
    <ChatContext.Provider
      value={{ fetchScenarios, userData: config.state.userData }}
    >
      <div className='InterviewCoachBody'>
        <div className='header-p'>
          <button className='back-button' onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
          <div className='title-container'>
            <h3>Interview Coach</h3>
          </div>
        </div>

        <div className='card' style={{ marginTop: 'unset' }}>
          {loading ? (
            <div
              className='loading-container'
              style={{ textAlign: 'center', padding: '20px' }}
            >
              <CircularProgress />
              <p>Please wait! Your interview is preparing.</p>
            </div>
          ) : chatbotVisible ? (
            <div className='chatbot-container'>
              <Chatbot
                config={{
                  ...config,
                  state: {
                    ...config.state,
                    fetchScenarios,
                  },
                }}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                onSubmit={handleAnswerSubmit} // Add this prop
              />
            </div>
          ) : (
            <div className='quiz-container'>
              <QuizQuestions scenarios={scenarios} />{' '}
              {/* Render QuizQuestions component with scenarios */}
            </div>
          )}

          <div className='progressbar-container'>
            <div className='chatbot-icon-title'>
              <div className='chatbot-icon'>
                <span>IC</span>
              </div>
              <div className='title'>
                <h4>Interview Coach 2.0</h4>
              </div>
            </div>

            <div className='info-row'>
              <div className='industry'>
                Industry:
                <span> {config.state.userData.industry.toUpperCase()}</span>
              </div>
              <div className='jobrole'>
                Job Role:
                <span>{config.state.userData.job_role.toUpperCase()}</span>
              </div>
            </div>
            <div className='info-row'>
              <div className='topics'>
                Topics:
                <span>{config.state.userData.topics.toUpperCase()}</span>
              </div>
            </div>
            <div className='info-row'>
              Self Score:
              <div className='cirv'>
                <span>{config.state.userData.self_score}/10</span>
              </div>
              Overall Score:
              <div className='cirv'>
                <CircularProgressbar
                  value={progress || 0} // Ensure a valid number is used
                  text={`${(progress || 0).toFixed(0)}%`} // Ensure a valid number is used
                  styles={buildStyles({
                    textColor: (progress || 0) >= 70 ? '#00ff00' : '#ff0000',
                    pathColor: (progress || 0) >= 70 ? '#00ff00' : '#ff0000',
                    trailColor: '#d6d6d6',
                  })}
                />
              </div>
            </div>

            <div className='circle-container'>
              Challenges Attempted:
              {[...Array(totalQuestions)].map((_, index) => (
                <Tooltip title='Click here to view report' key={index}>
                  <div
                    className={`circle ${
                      index < questionsAttempted
                        ? 'circle-active'
                        : 'circle-inactive'
                    }`}
                    onClick={() => handleCircleClick(index)}
                  ></div>
                </Tooltip>
              ))}
              <Tooltip title='Download Report'>
                <IconButton onClick={downloadReport}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </div>

            <div className='report-box'>
              <div className='report-header'>
                <h6>
                  Question No.:{' '}
                  {selectedQuestion !== null ? selectedQuestion + 1 : '-'}
                </h6>
                <h6>
                  Score: {currentReport.user_answer_score}
                  <IconButton onClick={() => setShowMore((prev) => !prev)}>
                    <ExpandMoreIcon />
                  </IconButton>
                </h6>
              </div>
              {showMore && (
                <div className='report-content'>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Question</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <h6>Scenario:</h6>
                      <Typography>
                        {currentReport.interviewer_question_scenario}
                      </Typography>
                      <h6>Challenge:</h6>
                      <Typography>
                        {currentReport.interviewer_question_challenge}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Your Answer</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{currentReport.user_answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Feedback</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{currentReport.feedback_to_user}</Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Suggested Answer</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{currentReport.suggested_answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity='info'
            sx={{ width: '100%' }}
          >
            Your report is generating...
          </MuiAlert>
        </Snackbar>
      </div>
    </ChatContext.Provider>
  );
};

const InterviewCoachWithProvider = () => (
  <ReportProvider>
    <InterviewCoach />
  </ReportProvider>
);

export default InterviewCoachWithProvider;
