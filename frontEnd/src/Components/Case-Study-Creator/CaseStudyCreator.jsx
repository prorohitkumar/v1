import React, { useRef, useState, useEffect } from 'react';
import './CaseStudyCreator.css';
import Spinner from '../Spinner';

import CaseStudyResponse from '../CaseStudyResponse/CaseStudyResponse';

import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useNavigate } from 'react-router-dom';
import MinusIcon from '@mui/icons-material/Remove';
import { Button, MenuItem, Select, TextField, InputLabel, FormControl, OutlinedInput, Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import ChipInput from './ChipInput';

const CaseStudyCreator = () => {
  // State for each form field
  const [caseStudyTitle, setcaseStudyTitle] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [numberOfDevelopers, setNumberOfDevelopers] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [caseStudyNameError, setCaseStudyNameError] = useState('');
  const [scDescError, setScDescError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [keywordsError, setKeywordsError] = useState('');
  const [participantsError, setParticipantsError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [technologiesError, setTechnologiesError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const myRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);

  const [isFormValid, setIsFormValid] = useState(false);

  const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      '& .MuiTooltip-tooltip': {
        top: 'calc(-4vh + 10px)',
      },
    })
  );

  const [toolsAndTechnologies, setToolsAndTechnologies] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const navigate = useNavigate();
  const backToHome = () => {
    navigate('/home');
  };

  // Function to toggle the visibility of additional fields
  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  // Reference for the output container
  const outputRef = useRef(null);

  


  useEffect(() => {
    const validateForm = () => {
      const isTitleValid = caseStudyTitle.trim().length >= 8 && /^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(caseStudyTitle);
      const isRoleValid = role.trim().length > 0 && /^[a-zA-Z][a-zA-Z ]*$/.test(role);
      const isScenarioValid = scenarioDescription.trim().length > 0;
      const areKeywordsValid = keywords.length > 0 && keywords.every(keyword => /^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(keyword));
      const areTechnologiesValid = toolsAndTechnologies.every(tech => /^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(tech));
      const isParticipantsValid =  numberOfDevelopers === '' || (numberOfDevelopers >= 1 && numberOfDevelopers <= 15 && Number.isInteger(Number(numberOfDevelopers)));
      const isDurationValid = duration === '' || (duration >= 1 && duration <= 24 && Number.isInteger(Number(duration)));

      setIsFormValid(isTitleValid && isRoleValid && isScenarioValid && areKeywordsValid && areTechnologiesValid && isParticipantsValid && isDurationValid);
    };

    validateForm();
  }, [caseStudyTitle, role, scenarioDescription, keywords, toolsAndTechnologies, numberOfDevelopers, duration]);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setisLoading(true);

    // Validate Case Study Title
    if (!caseStudyTitle.trim()) {
      setCaseStudyNameError('Case Study Title is required.');
      setisLoading(false);
      return;
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(caseStudyTitle)) {
      setCaseStudyNameError('Case Study Title should start with an alphanumeric value and can only contain alphabets, numbers, spaces, underscore (_) and hyphen (-).');
      setisLoading(false);
      return;
    } else if (caseStudyTitle.trim().length < 8) {
      setCaseStudyNameError('Case Study Title should be at least 8 characters long.');
      setisLoading(false);
      return;
    } else {
      setCaseStudyNameError('');
    }

    // Validate Role
    if (!role.trim()) {
      setRoleError('Role is required.');
      setisLoading(false);
      return;
    } else if (!/^[a-zA-Z][a-z A-Z- ]+$/.test(role)) {
      setRoleError('Role should only contain alphabets.');
      setisLoading(false);
      return;
    } else {
      setRoleError('');
    }

    // Validate Scenario Description
    if (!scenarioDescription.trim()) {
      setScDescError('Scenario Description is required.');
      setisLoading(false);
      return;
    } else {
      setScDescError('');
    }

    // Validate Keywords
    if (keywords.length === 0) {
      setKeywordsError('Keywords are required.');
      setisLoading(false);
      return;
    } else if (!keywords.every(keyword => /^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(keyword))) {
      setKeywordsError('Keywords should only contain alphanumeric values.');
      setisLoading(false);
      return;
    } else {
      setKeywordsError('');
    }

    // Validate Tools and Technologies
    if (!toolsAndTechnologies.every((tech) => /^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(tech))) {
      setTechnologiesError('Tools/Technologies should only contain alphanumeric values.');
      setisLoading(false);
      return;
    } else {
      setTechnologiesError('');
    }

    // Validate Number of Participants
    if (!/^[0-9]*$/.test(numberOfDevelopers) || numberOfDevelopers && (numberOfDevelopers < 1 || numberOfDevelopers > 15 || !Number.isInteger(Number(numberOfDevelopers)))) {
      setParticipantsError('Number of Participants should be an integer between 1 and 15.');
      setisLoading(false);
      return;
    } else {
      setParticipantsError('');
    }

    // Validate Duration in Hours
    if (duration && (duration < 1 || duration > 24 || !Number.isInteger(Number(duration)))) {
      setDurationError('Duration should be an integer between 1 and 24 hours.');
      setisLoading(false);
      return;
    } else {
      setDurationError('');
    }

    const formData = {
      case_study_name: caseStudyTitle,
      role: role,
      scenario_description: scenarioDescription,
      keywords: keywords,
      tools_and_technologies: toolsAndTechnologies,
      number_of_participants: numberOfDevelopers || 1,
      duration_in_hrs: duration || 12,
    };

    try {
      console.log(formData);
      const response = await axios.post('https://content-crafter-dev.stackroute.in/crafter/api/v2/CaseStudyCreator/generate', formData);
      // const response = await axios.post('https://localhost:5002/crafter/api/v2/generate_case_study', formData);
      setMessage(response.data.case_study);

      // Scroll to the output container
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error generating case study:', error);
      setMessage('Error generating case study');
    } finally {
      setisLoading(false);
    }
  };

  // Function to save markdown file
  const saveMarkDownFile = async () => {
    try {
      const response = await axios.post(
        'https://localhost:8000/download-docx',
        {
          markdown_content: message,
        },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      if (caseStudyTitle == ''){
        link.setAttribute('download', `Case_Study.docx`);
      } else {
        link.setAttribute('download', `${caseStudyTitle}.docx`);
      }
      
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

// Function to handle change in Case Study Title input
const handleCaseStudyTitleChange = (e) => {
  const inputValue = e.target.value;
  setcaseStudyTitle(inputValue);

  // Check for validation
  if (inputValue.trim() === '') {
    setCaseStudyNameError('Case Study Title is required.');
  } else if (/^\s/.test(inputValue)) {
    setCaseStudyNameError('First character should not be a space.');
  } else if (!/^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/.test(inputValue)) {
    setCaseStudyNameError('Case Study Title should start with an alphanumeric value and can only contain alphabets, numbers, spaces, and special characters.');
  } else if (inputValue.length < 8) {
    setCaseStudyNameError('Case Study Title should be at least 8 characters long.');
  } else {
    setCaseStudyNameError('');
  }
};

// Function to handle change in Role input
const handleRoleChange = (e) => {
  const inputValue = e.target.value;
  setRole(inputValue);

  // Check for validation
  if (inputValue.trim() === '') {
    setRoleError('Role is required.');
  } else if (/^\s/.test(inputValue)) {
    setRoleError('First character should not be a space.');
  } else if (!/^[a-zA-Z][a-zA-Z ]*$/.test(inputValue)) {
    setRoleError('Role should only contain alphabets and spaces.');
  } else {
    setRoleError('');
  }
};




// Function to handle change in Number of Participants input
const handleNumberOfParticipantsChange = (e) => {
  const inputValue = e.target.value.trim();
  setNumberOfDevelopers(inputValue);

  // Check for validation
  if (inputValue !== '' && (isNaN(inputValue) || parseInt(inputValue) < 1 || parseInt(inputValue) > 15 || !Number.isInteger(Number(inputValue)))) {
    setParticipantsError('Number of Participants should be an integer between 1 and 15.');
  } else {
    setParticipantsError('');
  }
};

// Function to handle change in Duration input
const handleDurationChange = (e) => {
  const inputValue = e.target.value.trim();
  setDuration(inputValue);

  // Check for validation
  if (inputValue !== '' && (isNaN(inputValue) || parseInt(inputValue) < 1 || parseInt(inputValue) > 24 || !Number.isInteger(Number(inputValue)))) {
    setDurationError('Duration should be an integer between 1 and 24 hours.');
  } else {
    setDurationError('');
  }
};

const handleKeywordsChange = (newKeywords) => {
  setKeywords(newKeywords);

  // Updated regular expression to correctly escape \ and include /
  const keywordPattern = /^[a-zA-Z0-9][a-zA-Z0-9 _\-\\\/<>*&$@~{}\[\]?]*$/;

  // Check for validation
  if (!newKeywords.every(keyword => keywordPattern.test(keyword))) {
    setKeywordsError('Keywords should only contain alphanumeric values.');
  } else {
    setKeywordsError('');
  }
};






// Function to handle change in Tools/Technologies input
const handleToolsTechnologiesChange = (newTechnologies) => {
  setToolsAndTechnologies(newTechnologies);

  // Check for validation
  if (!newTechnologies.every(tech => /^[a-zA-Z][a-zA-Z0-9 _-]+$/.test(tech))) {
    setTechnologiesError('Tools/Technologies should only contain alphanumeric values.');
  } else {
    setTechnologiesError('');
  }
};




  const handleReset = () => {
    setcaseStudyTitle('');
    setRole('');
    setScenarioDescription('');
    setKeywords([]);
    setToolsAndTechnologies([]);
    setNumberOfDevelopers('');
    setDuration('');
    setCaseStudyNameError('');
    setRoleError('');
    setScDescError('');
    setKeywordsError('');
    setParticipantsError('');
    setDurationError('');
    setTechnologiesError('');
    setResetKey((prevKey) => prevKey + 1);
  };
  const handleScenarioDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length == '') {
      setScenarioDescription(text.slice(0, 250)); // Limit to 250 characters
      setScDescError('Scenario Description is required.');
    } else if (text.length < 20) {
      setScenarioDescription(text.slice(0, 250)); // Limit to 250 characters
      setScDescError('Scenario Description should have atleast 20 chracters.');
    } else if (text.length > 250) {
      setScenarioDescription(text.slice(0, 250)); // Limit to 250 characters
      setScDescError('Scenario Description should not exceed 250 characters.');
    } else {
      setScenarioDescription(text);
      setScDescError('');
    }
  };

  useEffect(() => {
    if (message) {
      outputRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [message]);

  return (
    <>
      <div className="header-p">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowBackIosNewIcon style={{ color: 'white' }} />
        </button>
        <div className="title-container">
          <h3>Case Study Creator</h3>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-p">
        <div className="form-table-p">
          <div className="case-study">
            <Tooltip title="Enter a title for the case study." arrow>
              <FormControl fullWidth>
                <TextField
                  error={!!caseStudyNameError}
                  fullWidth
                  id="outlined-basic"
                  className="textinput"
                  type="text"
                  name="assessmentName"
                  placeholder="Enter a title for the case study."
                  label={
                    <span>
                      Case Study Title<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  value={caseStudyTitle}
                  onChange={
                    handleCaseStudyTitleChange}
                />
                <div className="error-message-csc">{caseStudyNameError}</div>
              </FormControl>
            </Tooltip>
          </div>
          <div className="role">
            <Tooltip title="Enter the role who will take the case study." arrow>
              <FormControl fullWidth error={!!roleError}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  className="textinput"
                  type="text"
                  name="role"
                  placeholder="Enter the role who will take the case study."
                  label={
                    <span>
                      Role<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  value={role}
                  onChange={handleRoleChange}
                />
                <div className="error-message-csc">{roleError}</div>
              </FormControl>
            </Tooltip>
          </div>
          <div className="chips-container-csc">
            <FormControl fullWidth>
              <div className="chips-csc">
                <Chip label="Full Stack Developer" className="chip-csc" />
                <Chip label="Business Analyst" className="chip-csc" />
                <Chip label="IT Project Manager" className="chip-csc" />
                <Chip label="Technical Recruiter" className="chip-csc" />
                <Chip label="Sales Manager" className="chip-csc" />
              </div>
            </FormControl>
          </div>
          <div className="sc-desc">
            <Tooltip title="Add the scenario description for the case study." arrow>
              <FormControl fullWidth error={!!scDescError}>

                <TextField
                placeholder="Add the scenario description for the case study."
                  error={!!scDescError}
                  fullWidth
                  name="text"
                  label={
                    <span>
                      Scenario Description<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  multiline
                  rows={4}
                  value={scenarioDescription}
                  onChange={handleScenarioDescriptionChange}
                />
                <div className="error-message-csc">{scDescError}</div>
                <div className="character-count" >{scenarioDescription.length}/250</div>
              </FormControl>
            </Tooltip>
          </div>

          <div className="form-row-p">
            <Tooltip title="Add keywords (Ex: java, springboot, healthcare robotics)." arrow>
              <FormControl fullWidth error={!!keywordsError} sx={{ marginBottom: '5px' }}>
                <ChipInput
                  placeholder="Press , or enter to add one or more keywords(s) for the case study."
                  label={
                    <span>
                      Keywords<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  onChange={handleKeywordsChange}
                  key={`keywords-${resetKey}`} // Include resetKey in the key
                />
                <div className="error-message-csc">{keywordsError}</div>
              </FormControl>
            </Tooltip>
          </div>
          <div className="chips-container-csc">
            <FormControl fullWidth>
              <div className="chips-csc">
                <Chip label="SWOT Analysis" className="chip-csc" />
                <Chip label="Agile Methodologies" className="chip-csc" />
                <Chip label="Risk Management" className="chip-csc" />
                <Chip label="Array" className="chip-csc" />
                <Chip label="DevOps" className="chip-csc" />
              </div>
            </FormControl>
          </div>


          <div className="addMore-container">
            <StyledTooltip
              title={showAdditionalFields ? 'Click to hide additional fields' : 'Add more context'}
              arrow
            >
              <button type="button" className="button-p add-button" onClick={toggleAdditionalFields}>
                {showAdditionalFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </button>
            </StyledTooltip>
            <h5 style={{ margin: '0 0 0 0.5rem' }}>Add more context</h5>
          </div>
          <div className="learning-objectives">
            {showAdditionalFields && (
              <>
                <div className="form-row-p">
                  <Tooltip title="Add tools and technologies." arrow>
                    <FormControl fullWidth error={!!technologiesError}>
                      <ChipInput
                        placeholder="Press , or enter to add one or more tools/technologies to use."
                        label={
                          <span>
                            Tools/Technologies
                          </span>
                        }
                        onChange={handleToolsTechnologiesChange}
                        key={`tools and technologies-${resetKey}`}
                      />
                      <div className="error-message-csc">{technologiesError}</div>
                    </FormControl>
                  </Tooltip>
                </div>
                <div className="form-cell-p-participant">
                  <Tooltip title="Add number of participants(1-15)." arrow>
                    <FormControl fullWidth>
                      <InputLabel>Number of Participants</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name="num_of_devs"
                        id="numOfDevs"
                        value={numberOfDevelopers}
                        onChange={handleNumberOfParticipantsChange}
                        label="Number of Participants"
                        type="number"
                        inputProps={{ min: 1, max: 15 }}
                      />
                      <div className="error-message-csc">
                        {participantsError}
                      </div>
                    </FormControl>
                  </Tooltip>
                </div>
                <div className="form-cell-p-duration" >
                  <FormControl fullWidth >
                    <Tooltip title="Add duration in hours(1-24)." arrow>
                      <InputLabel>Duration in hrs</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name="duration"
                        id="duration"
                        value={duration}
                        onChange={handleDurationChange}
                        label="Duration (hrs)"
                        type="number"
                        inputProps={{ min: 1, max: 60 }}
                      />
                      <div className="error-message-csc">
                        {durationError}
                      </div>
                    </Tooltip>
                  </FormControl>
                </div>
              </>
            )}


          </div>


        </div>

        <div className={message.length > 0 ? 'gen-dwn-btn' : 'genbtn'}>
          <StyledTooltip title="Reset the form" arrow>
            <div>
              <Button
                type="button"
                onClick={handleReset}
                disabled={false}
                style={{ maxWidth: '10px', marginRight: '10px', backgroundColor: '#1976d2', color: 'white' }}
                s
              >
                <RefreshIcon />
              </Button>
            </div>
          </StyledTooltip>

          <StyledTooltip title="Click to generate case study" arrow>
            <Button variant="contained" onClick={handleSubmit} ref={outputRef}  disabled={!isFormValid || isLoading}>
              Generate
            </Button>
          </StyledTooltip>

          {/* Download button */}
          {/* {message.length > 0 && (
            <StyledTooltip title="Download the Case Study in .docx" arrow>
              <Button
                type="button"
                className="download-btn"
                onClick={saveMarkDownFile}
                style={{ backgroundColor: 'green', color: 'white', marginLeft: '4px' }}
              >
                <DownloadIcon />
              </Button>
            </StyledTooltip>
          )} */}
        </div>
      </form>
      {isLoading && (
        <div className="loading-dots">
          <Spinner />
        </div>
      )}
      {message.length > 0 && (
        <div className="output-csc" ref={outputRef} >
          <div className="response-containerr" >
            <CaseStudyResponse answer={message} />
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyCreator;
