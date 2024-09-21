import React, { useState, useContext, useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MicNoneIcon from '@mui/icons-material/MicNone';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { ReportContext } from './ReportContext'; // Adjust the path
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ChatContext } from './chatbox/ActionProvider'; // Add this import
import { Button } from '@mui/material';

const QuizQuestions = ({ scenarios }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const { setReport } = useContext(ReportContext); // Use setReport from context
  const { userData } = useContext(ChatContext); // Add this line to get userData from context
  const [isFinish, setisFinish] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer((prevAnswer) => prevAnswer + ' ' + transcript);
      };
    } else {
      alert('Your browser does not support speech recognition.');
    }
  }, []);

  const handleUserAnswer = async () => {
    try {
      if (userAnswer.trim() === '') {
        alert('Please enter your answer first.');
        return;
      }

      setAlertOpen(true);

      const response = await axios.post(
        // 'http://127.0.0.1:5000/evaluate_answer',
        'https://content-crafter-dev.stackroute.in/crafter/api/v2/interview_coach/evaluate_answer',
        // 'http://localhost:8000/crafter/api/v2/interview_coach/evaluate_answer',
        {
          interviewer_question_challenge:
            scenarios[currentScenarioIndex].challenge,
          user_answer: userAnswer,
          job_role: userData.job_role,
          topics: userData.topics,
          self_score: userData.self_score,
        },
      );

      console.log(response.data); // Check response structure

      const {
        feedback_to_user,
        interviewer_question_scenario,
        interviewer_question_challenge,
        suggested_answer,
        user_answer,
        user_answer_score,
      } = response.data;

      console.log(user_answer_score);

      // Use setReport from context to update the report state
      setReport({
        feedback_to_user,
        interviewer_question_scenario,
        interviewer_question_challenge,
        suggested_answer,
        user_answer,
        user_answer_score,
      });
      if (currentScenarioIndex === 9) {
        setisFinish(true);
      } else {
        setCurrentScenarioIndex((prevIndex) => prevIndex + 1);
      }
      setUserAnswer('');
    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setAlertOpen(false);
    }
  };

  if (currentScenarioIndex === 10) {
    setisFinish(true);
  }

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* <h2>{currentScenarioIndex}</h2> */}
      {isFinish ? (
        <Card
          sx={{
            width: '70%',
            margin: 'auto',
            marginTop: '20px',
            backgroundColor: '#3c82bc',
            marginLeft: '52px',
            position: 'relative',
          }}
        >
          <CardContent>
            <Typography
              variant='body2'
              color='text.secondary'
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '18px',
                marginTop: '10px',
              }}
            >
              Congratulations! Your interview is completed.
            </Typography>
          </CardContent>
          <Button
            type='button'
            onClick={handleReload}
            disabled={false}
            style={{
              // maxWidth: '10px',
              // marginRight: '10px',
              backgroundColor: 'white',
              color: '#1976d2',
              marginLeft: '74%',
              marginBottom: '1rem',
              width: '10rem',
            }}
            // sx={{ marginLeft: 'auto' }}
          >
            Re-attempt Interview
          </Button>
        </Card>
      ) : (
        // {scenarios.length > 0 && (
        <Card
          sx={{
            width: '70%',
            margin: 'auto',
            marginTop: '20px',
            backgroundColor: '#3c82bc',
            marginLeft: 'auto',
            position: 'relative',
          }}
        >
          <CardContent>
            <Typography
              variant='body2'
              color='text.secondary'
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                // marginTop: '20px',
              }}
            >
              Challenge:
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              style={{ color: '#fff', fontSize: '16px', marginTop: '10px' }}
            >
              {scenarios[currentScenarioIndex]?.challenge}
            </Typography>
            <Paper
              component='form'
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleUserAnswer();
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='Your Answer'
                inputProps={{ 'aria-label': 'your answer' }}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
              <IconButton
                sx={{ p: '10px' }}
                aria-label='mic'
                onClick={handleMicClick}
              >
                <MicNoneIcon color={isListening ? 'primary' : 'default'} />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
              <IconButton
                color='primary'
                sx={{ p: '10px' }}
                aria-label='send'
                type='submit'
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </CardContent>
        </Card>
      )}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <MuiAlert
          onClose={handleAlertClose}
          severity='info'
          sx={{ width: '100%' }}
        >
          Your report is generating...
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default QuizQuestions;
