import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBlogger } from '@fortawesome/free-brands-svg-icons';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Spinner from '../Spinner';
import { useNavigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChipInput from 'material-ui-chip-input';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';

const LevelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advance', label: 'Advance' },
];

const App = () => {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState('500');
  const [audienceLevel, setAudienceLevel] = useState('Beginner');
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [wordCountError, setWordCountError] = useState('');
  const [keywordsError, setKeywordsError] = useState('');
  const [response, setResponse] = useState('');
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [isCopyIconChanged, setIsCopyIconChanged] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    if (!newTitle) {
      setTitleError('Please add a blog post title.');
    } else {
      setTitleError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!title.trim()) {
      setTitleError('Please add a blog post title.');
      return;
    }
    if (title.length > 75) {
      setTitleError('Title should not exceed 75 characters.');
      return;
    }
    const count = parseInt(wordCount);
    if (isNaN(count) || count < 10 || count > 750) {
      setWordCountError('Word count should be between 10-750.');
      return;
    } else {
      setTitleError('');
      setWordCountError(''); // Clear word count error if validation passes
    }

    const formData = new FormData();
    formData.append('input_text', title);
    formData.append('no_words', wordCount);
    formData.append('blog_style', audienceLevel);
    formData.append('keywords', keywords.join(','));
    setIsLoading(true);
    setIsClick(true);

    try {
      const payload = {
        input_text: title,
        no_words: wordCount,
        blog_style: audienceLevel,
        keywords: keywords.join(','),
      };

      const response = await axios.post(
        'https://content-crafter-dev.stackroute.in/crafter/api/v2/blog_crafter/blog',
        payload,
      );
      setResponse(response.data.blog_content);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Invalid request. Please check your input.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState('');
  const handlepost = async () => {
    const formData = new FormData();
    formData.append('input_text', title);
    formData.append('no_words', wordCount);
    formData.append('blog_style', audienceLevel);
    formData.append('keywords', keywords.join(','));
    setIsPosting(true);
    setIsClick(true);
    try {
      const res = await axios.post(
        'https://content-crafter-dev.stackroute.in/crafter/api/v2/blog_crafter/blogPost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setPostStatus(res.data.status);
      setError('');
      setSuccessMessage('Blog Posted Successfully');
      console.log(successMessage);
    } catch (error) {
      console.log('Error', error);
      setError('An error occurred while posting the blog. Please try again!');
    }
    setIsPosting(false);
  };

  // Implement logic to obtain and manage access token using OAuth 2.0 flow

  const handleRefresh = () => {
    setTitle('');
    setWordCount('500');
    setAudienceLevel('Beginner');
    setKeywords([]);
    setError('');
    // setIsClick(false);
    setIsLoading(false);
    setIsCopyIconChanged(false);
    setSuccessMessage('');
    setIsCopied(false);
    setTitleError('');
    setWordCountError('');
    setKeywordsError('');
  };

  const handleAddChip = (chip) => {
    const newChips = chip
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');
    const remainingSpace = 5 - keywords.length;
    if (newChips.length > remainingSpace) {
      setKeywordsError('You can only add up to 5 keywords.');
      return;
    }
    const chipsToAdd = newChips.slice(0, remainingSpace);
    setKeywords([...keywords, ...chipsToAdd]);
  };

  const handleDeleteChip = (chip, index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
    setKeywordsError('');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setIsCopyIconChanged(true);
    setIsCopied(true);
  };

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: '-2vh',
      fontSize: '13px',
      backgroundColor: '#007bff',
    },
  }));

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      const downloadFormData = new FormData();
      downloadFormData.append('markdown_content', response); // Send the markdown content to the backend
      const downloadResponse = await axios.post(
        'https://localhost:8000/download-docx',
        downloadFormData,
        {
          headers: {
            'Content-Type': 'application/json', // Specify content type
          },
          responseType: 'blob', // Specify the response type as blob
        },
      );
      // Trigger the download of the generated .docx file
      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title + '_blog.docx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      // Handle errors
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='blog-container'>
      <div className='header1'>
        <div className='title-container'>
          <button
            className='back-button'
            onClick={() => navigate('/home')}
            style={{ color: 'white' }}
          >
            <ArrowBackIosNewIcon />
          </button>
          <h1>Blog Crafter</h1>
        </div>
      </div>
      <div className='blog-card-containers'>
        <div className='blog-card'>
          <div className='form-container'>
            <form onSubmit={handleSubmit}>
              <label>
                <div style={{ color: 'black' }}>
                  Create a blog post titled
                  <span style={{ color: 'red' }}>*</span>
                </div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',

                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title='Enter the title of your blog'
                  arrow
                >
                  <TextField
                    id='standard-basic'
                    variant='standard'
                    value={title}
                    onChange={handleTitleChange}
                    error={!!titleError}
                    helperText={titleError}
                  />
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}>,</div>
                <div style={{ color: 'black', marginTop: '15px' }}>
                  with the
                </div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',

                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title='Enter keywords for your blog'
                  arrow
                >
                  <ChipInput
                    value={keywords}
                    onAdd={(chip) => handleAddChip(chip)}
                    onDelete={(chip, index) => handleDeleteChip(chip, index)}
                    style={{ width: '32.8vw', marginLeft: '10px' }}
                    chipProps={{
                      style: { backgroundColor: 'blue', color: 'blue' },
                    }}
                    newChipKeys={[',']} // Adding comma as a new chip key
                    error={!!keywordsError}
                    helperText={keywordsError}
                  />{' '}
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}>
                  {' '}
                  keywords.{' '}
                </div>
                <div style={{ color: 'black', marginTop: '15px' }}>
                  {' '}
                  It should be around <span style={{ color: 'red' }}>*</span>
                </div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title='Enter the word count for your blog (10-750)'
                  arrow
                >
                  <TextField
                    id='outlined-number'
                    type='number'
                    InputLabelProps={{ shrink: true }}
                    value={wordCount}
                    inputProps={{ min: 10, max: 750 }}
                    onChange={(e) => {
                      setWordCount(e.target.value);
                      setWordCountError('');
                    }}
                    variant='standard'
                    error={!!wordCountError} // Pass error state to TextField component
                    helperText={wordCountError} // Display error message if there's an error
                  />
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}>
                  words and for<span style={{ color: 'red' }}>*</span>
                </div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',
                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title='Select the audience level'
                  arrow
                  placement='right'
                >
                  <TextField
                    id='standard-select-level'
                    select
                    value={audienceLevel}
                    onChange={(e) => setAudienceLevel(e.target.value)}
                    variant='standard'
                    style={{ marginLeft: '10px' }}
                  >
                    {LevelOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}>
                  {' '}
                  level audience.
                </div>
              </label>
            </form>
          </div>
          <div className='btt-err-container'>
            <div className='error-cont'>
              {error && (
                <p className='error' style={{}}>
                  {error}
                </p>
              )}

              {successMessage && <p className='success'> {successMessage}</p>}
            </div>
          </div>
        </div>
        <div className='blog-response' style={{ maxWidth: '100%' }}>
          <div className='iicons'>
            {/*           {response && (  <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Click to publish blog in Google Blogger"
                arrow
              ><Button
            isLoading= 'false'
            onClick={handlepost}
       > 
         <FontAwesomeIcon icon={faBlogger} size="2xl" style={{ color: "#f5c000"}} />

          </Button></Tooltip>
          )} */}
            {response && (
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title='Click to download in .docx format'
                arrow
              >
                <Button
                  // variant="contained"
                  color='primary'
                  disabled={isDownloading}
                  onClick={handleDownloadDocx}
                  style={{ height: '42px' }}
                >
                  <DownloadIcon />
                </Button>
              </Tooltip>
            )}
            {response && (
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title={isCopied ? 'Blog Copied' : 'Click to copy blog'}
                arrow
              >
                <Button
                  className='copy-button'
                  onClick={handleCopyToClipboard}
                  style={{ height: '35px' }}
                >
                  {isCopyIconChanged ? <CheckCircleIcon /> : <FileCopyIcon />}
                </Button>
              </Tooltip>
            )}
          </div>
          {isClick && isLoading && (
            <div className='spinner-container'>
              <Spinner />
            </div>
          )}
          {isClick && !isLoading && (
            <MarkdownPreview
              className='response-content'
              source={response}
              style={{ marginTop: '-6px' }}
            />
          )}
          {!isClick && (
            <div className='welcome'>
              Welcome to Blog Crafter, your virtual assistant in crafting
              compelling blog content to enhance your online visibility.
            </div>
          )}
        </div>
      </div>
      <div className='buttons-container'>
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '13px',
                bgcolor: '#007bff',
                '& .MuiTooltip-arrow': {
                  color: 'common.black',
                },
              },
            },
          }}
          title='Click to reset'
          arrow
        >
          <Button
            className='refresh-button'
            variant='contained'
            onClick={handleRefresh}
            style={{ height: '40px', marginTop: '1%', marginRight: '2vh' }}
          >
            <RefreshIcon />
          </Button>
        </Tooltip>
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '13px',
                bgcolor: '#007bff',
                '& .MuiTooltip-arrow': {
                  color: 'common.black',
                },
              },
            },
          }}
          title='Click to generate text'
          arrow
        >
          <Button
            className='generate-button'
            variant='contained'
            onClick={handleSubmit}
            // disabled={!!response}
            style={{ height: '40px', marginTop: '1%' }}
          >
            Generate
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default App;
