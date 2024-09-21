import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Avatar,
  Grid,
  Paper,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';

const Chatbot = ({ code, isVisible }) => {
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); // State to handle loading spinner
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages

  const handleGo = async () => {
    if (!additionalPrompt.trim()) {
      setErrorMessage('Prompt cannot be empty. Please enter a valid prompt.');
      return;
    }

    const newPrompt = additionalPrompt;
    setAdditionalPrompt(''); // Clear the text field
    setChatHistory([...chatHistory, { prompt: newPrompt, response: '' }]); // Add prompt to chat history immediately
    setLoading(true); // Start loading
    setErrorMessage(''); // Clear any previous error messages

    try {
      const response = await fetch(
        'https://code-reviewr-backend-python.onrender.com/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: code, userPrompt: newPrompt }), // Send code and prompt
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const rawResponse = await response.text();
      const jsonResponse = JSON.parse(rawResponse);
      // console.log(jsonResponse);
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.prompt === newPrompt
            ? { ...chat, response: jsonResponse.response.Response }
            : chat,
        ),
      ); // Update the response for the corresponding prompt
    } catch (error) {
      console.error('Error:', error);
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.prompt === newPrompt
            ? { ...chat, response: 'Error decoding response' }
            : chat,
        ),
      ); // Update the response with an error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default behavior of Enter key
      handleGo();
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Response copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying response to clipboard:', error);
      });
  };

  const resetChat = () => {
    setChatHistory([]);
    setAdditionalPrompt('');
    setErrorMessage('');
  };

  const handleGridClick = (text) => {
    setAdditionalPrompt(text);
  };

  return (
    <Card
      style={{
        position: 'absolute',
        // top: '0',
        left: '60.2%',
        width: '38.5%', // Adjust the width to 50% of the parent
        height: 'calc(100vh - 10px)', // Adjust this value if necessary
        zIndex: 999, // Ensure it appears above other elements
        backgroundColor: '#fff',
        padding: '10px',
        display: isVisible ? 'flex' : 'none', // Toggle visibility based on isVisible prop
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent style={{ flexGrow: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography
            variant='h4'
            component='div'
            style={{
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#3f51b5',
            }}
          >
            CodeCraft
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            size='small'
            startIcon={<RefreshIcon />}
            onClick={resetChat}
            style={{ marginRight: '80px' }}
          >
            New Chat
          </Button>
        </Box>
        <hr />
        {errorMessage && (
          <Box mb={2}>
            <Alert severity='error'>{errorMessage}</Alert>
          </Box>
        )}
        <h2>How can I help you ?</h2>
        <Box style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {chatHistory.length === 0 ? (
            <Grid
              container
              spacing={8}
              justifyContent='center'
              alignItems='center'
              style={{ height: '80%' }}
            >
              <Grid item xs={5}>
                <Paper
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGridClick('Convert Code')}
                >
                  <CodeIcon
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  <Typography variant='body1' component='span'>
                    Convert Code
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGridClick('Generate Test Cases')}
                >
                  <AssignmentIcon
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  <Typography variant='body1' component='span'>
                    Generate Test Cases
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGridClick('Explain Code')}
                >
                  <NoteAddIcon
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  <Typography variant='body1' component='span'>
                    Explain Code
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGridClick('Optimize Code')}
                >
                  <BuildIcon
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  <Typography variant='body1' component='span'>
                    Optimize Code
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGridClick('Check for Bugs')}
                >
                  <BugReportIcon
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  <Typography variant='body1' component='span'>
                    Check for Bugs
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={5}>
                <Paper
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleGridClick('Document Code')}
                >
                  <DescriptionIcon
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  <Typography variant='body1' component='span'>
                    Document Code
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            chatHistory.map((chat, index) => (
              <Box key={index} mb={2}>
                <Box display='flex' alignItems='center' mb={1}>
                  <Avatar
                    alt='User'
                    src='/images/user.png'
                    style={{ marginRight: '10px' }}
                  />
                  <Paper
                    elevation={3}
                    style={{
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '10px',
                      display: 'inline-block',
                      position: 'relative',
                      maxWidth: 'calc(100% - 40px)',
                    }}
                  >
                    <Typography
                      variant='body1'
                      style={{
                        wordWrap: 'break-word',
                        display: 'inline-block',
                      }}
                    >
                      {chat.prompt}
                    </Typography>
                  </Paper>
                </Box>
                {chat.response ? (
                  <Box
                    display='flex'
                    alignItems='flex-start'
                    position='relative'
                  >
                    <Avatar
                      alt='Bot'
                      src='/images/bot.png'
                      style={{ marginRight: '10px', marginTop: '1rem' }}
                    />
                    <Paper
                      elevation={3}
                      style={{
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '10px',
                        display: 'inline-block',
                        position: 'relative',
                        maxWidth: 'calc(100% - 40px)',
                      }}
                    >
                      <Typography
                        variant='body1'
                        style={{
                          wordWrap: 'break-word',
                          display: 'inline-block',
                        }}
                      >
                        {chat.response}
                      </Typography>
                      <IconButton
                        style={{
                          position: 'absolute',
                          // top: '10px',
                          right: '10px',
                        }}
                        onClick={() => handleCopy(chat.response)}
                      >
                        <FileCopyIcon fontSize='small' />
                      </IconButton>
                    </Paper>
                  </Box>
                ) : (
                  <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    style={{ height: '60px' }}
                  >
                    <CircularProgress size={20} />
                  </Box>
                )}
              </Box>
            ))
          )}
        </Box>
      </CardContent>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant='outlined'
            placeholder='Type your prompt here...'
            value={additionalPrompt}
            onChange={(e) => setAdditionalPrompt(e.target.value)}
            multiline
            onKeyPress={handleKeyPress}
            InputProps={{
              style: {
                height: '60px',
                overflowY: 'auto',
                wordWrap: 'break-word',
              },
            }}
            style={{ width: '90%' }}
            sx={{
              '& label.Mui-focused': {
                color: '#1976D2',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976D2',
                },
              },
            }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleGo}
            style={{ height: '46px', marginLeft: '10px' }}
          >
            <TelegramIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
