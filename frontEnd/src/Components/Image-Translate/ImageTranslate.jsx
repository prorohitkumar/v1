import React, { useState, useRef } from 'react';
import { Button, Tooltip } from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Add this import
import './Image-translate.css';
import Spinner from '../Spinner';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MarkdownPreview from '@uiw/react-markdown-preview';

function App() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState('');
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isCopyIconChanged, setIsCopyIconChanged] = useState(false); // Add this state
  const welcomeText =
    "Hello there! I'm Snap Scriptor, your dedicated agent ready to help you transform your visuals into text effortlessly.";

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropAreaRef = useRef(null);

  const handleGenerate = async () => {
    if (!image) {
      setValidationError('Upload image to generate text');
      return;
    }

    // Check file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedFormats.includes(image.type)) {
      setValidationError(
        'Invalid file format. Please upload jpeg, jpg, or png files.',
      );
      return;
    }

    setIsLoading(true);
    setIsClick(true);
    setValidationError('');

    const formData = new FormData();
    formData.append('file', image);

    const payload = {
      image: image,
    };
    try {
      const response = await axios.post(
        'https://content-crafter-dev.stackroute.in/crafter/api/v2/snap_scriptor/chat',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // console.log('Response Data:', response.data.response); // Log the response data
      console.log(response);

      // Ensure response data is a string
      const responseData =
        typeof response.data.response === 'string'
          ? response.data.response
          : '';
      const responseText = responseData.toLowerCase();

      console.log(responseData);

      // Check if the response contains specific words
      if (
        responseText.includes('no technical') ||
        responseText.includes('non-technical') ||
        responseText.includes(
          'not related to software engineering, project management, or information technology. ',
        ) ||
        responseText.includes(
          'It is not related to software engineering, project management, or information technology.',
        )
      ) {
        setResponse('Please upload an image related to technical aspects.');
      } else {
        setResponse(responseData);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
      if (error.response) {
        // Handle HTTP errors
        if (error.response.status === 500) {
          setResponse('Please upload an image related to technical aspects.');
        } else {
          setResponse(`Error: ${error.response.data.response}`);
        }
      } else if (error.request) {
        // Handle network errors
        setResponse(
          'Network error occurred. Please check your internet connection.',
        );
      } else {
        // Handle other errors
        setResponse('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setValidationError('');
  };

  const handleRefresh = () => {
    setImage(null);
    setResponse('');
    setIsClick(false);
    setIsCopyIconChanged(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response); // Copy text to clipboard
    setIsCopyIconChanged(true); // Set state to indicate that the icon has been changed
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

  const handleCloudUploadClick = () => {
    inputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setImage(e.dataTransfer.files[0]);
  };

  return (
    <div
      className='image-translate-container'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className='header'>
        <div className='title-container'>
          <button
            className='back-button'
            onClick={() => navigate('/home')}
            style={{ color: 'white' }}
          >
            <ArrowBackIosNewIcon />
          </button>
          <h1>Snap Scriptor</h1>
        </div>
        {/* {response && (
          <StyledTooltip title="Click to copy text" arrow>
            <Button
              className="copy-button"
              // variant="contained"
              onClick={handleCopyToClipboard}
              style={{height: '40px', marginRight: "5vh"}}
            >
              {isCopyIconChanged ? <CheckCircleIcon /> : <FileCopyIcon />}
            </Button>
          </StyledTooltip>
        )} */}
      </div>
      <div className='card-containers'>
        <div className='card1'>
          <div className='image-cont'>
            {image ? (
              <div
                className='image-container'
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt='Uploaded'
                  className='uploaded-image'
                  style={{ maxWidth: '100%' }}
                />
              </div>
            ) : (
              <div
                className={`upload-box ${dragOver ? 'drag-over' : ''}`}
                onClick={handleCloudUploadClick}
                ref={dropAreaRef}
              >
                <StyledTooltip
                  title='Drag & Drop an image/ Click here to upload'
                  arrow
                >
                  <CloudUploadIcon
                    style={{ fontSize: '10vw', color: 'blue' }}
                  />
                  <input
                    ref={inputRef}
                    accept='image/*'
                    style={{ display: 'none' }}
                    id='contained-button-file'
                    type='file'
                    onChange={handleImageChange}
                  />
                </StyledTooltip>
              </div>
            )}
            {validationError && (
              <div
                style={{
                  color: 'red',
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                {validationError}
              </div>
            )}
          </div>
        </div>

        <div className='response1' style={{ maxWidth: '100%' }}>
          {response && (
            <Tooltip title='Click to copy text' arrow>
              <Button
                className='copy-button'
                onClick={handleCopyToClipboard}
                style={{ height: '30px', marginLeft: '80vh' }}
              >
                {isCopyIconChanged ? <CheckCircleIcon /> : <FileCopyIcon />}
              </Button>
            </Tooltip>
          )}
          {isClick ? (
            isLoading ? (
              <div className='spinner-container'>
                <Spinner />
              </div>
            ) : (
              <MarkdownPreview
                className='response-content'
                source={response}
                style={{ marginTop: '-8px' }}
              />
            )
          ) : (
            <div className='welcome'>{welcomeText}</div>
          )}
        </div>
      </div>
      <div className='buttons-containers'>
        <StyledTooltip title='Click to reset' arrow>
          <Button
            className='refresh-button'
            variant='contained'
            onClick={handleRefresh}
            style={{
              backgroundColor: 'red',
              height: '6vh',
              marginTop: '1%',
              marginRight: '2vh',
            }}
          >
            <RefreshIcon />
          </Button>
        </StyledTooltip>
        <StyledTooltip title='Click to generate text' arrow>
          <Button
            className='generate-button'
            variant='contained'
            onClick={handleGenerate}
            disabled={!!response}
            style={{ height: '6vh', marginTop: '1%' }}
          >
            Generate
          </Button>
        </StyledTooltip>
      </div>
    </div>
  );
}

export default App;
