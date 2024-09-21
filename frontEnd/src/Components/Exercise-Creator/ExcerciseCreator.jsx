import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import './ExcerciseCreator.css';
import axios from 'axios';
import ChipInput from './ChipInput';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import { Button, Chip, OutlinedInput, Tooltip, FormControlLabel, Checkbox, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import Spinner from '../Spinner';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import MarkdownPreview from '@uiw/react-markdown-preview';

// const API_URL_L = "https://agent-subjective-based-assessment-backend.onrender.com/api/v1/Exercise/exercise";
  const API_URL_L = "https://content-crafter-dev.stackroute.in/crafter/api/v2/Exercise/exercise"

const ExerciseGenerator = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [roleError, setRoleError] = useState('');
  const [levels, setLevels] = useState([{ level: '', noOfQuestions: '', keywords: [], levelError: '', noOfQuestionsError: '', keywordsError: '' }]);
  const [tools, setTools] = useState([]);
  const [toolsError, setToolsError] = useState('');
  const [hints, setHints] = useState(false);
  const [generatedExercise, setGeneratedExercise] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnsReady, setIsAnsReady] = useState(false);
  const responseContainerRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const LevelOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  const handleAddLevel = () => {
    setLevels([...levels, { level: '', noOfQuestions: '', keywords: [], levelError: '', noOfQuestionsError: '', keywordsError: '' }]);
  };

  const handleRemoveLevel = (index) => {
    const newLevels = levels.slice();
    newLevels.splice(index, 1);
    setLevels(newLevels);
  };

  const checkFormValidity = () => {
    // if (!role || tools.length === 0) {
    //   return false;
    // }
    for (const level of levels) {
      if (!level.level || !level.noOfQuestions || level.keywords.length === 0) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setIsFormValid(checkFormValidity());
  }, [role, levels]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    setIsLoading(true);
  
    const exerciseData = {
      role,
      levels,
      tools: tools.join(", "), // Assuming tools is an array of strings
      hints
    };
  
    try {
      setIsLoading(true);
      setIsAnsReady(false);
      const response = await fetch(API_URL_L, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      setGeneratedExercise(result);
      setIsAnsReady(true);
    } catch (error) {
      console.error("Error generating exercise:", error);
      toast.error('Failed to generate exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (isAnsReady) {
      responseContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isAnsReady]);

  const handleReset = () => {
    setRole('');
    setTools([]);
    setIsLoading(false);
    setHints(false);
    setLevels([{ level: '', noOfQuestions: '', keywords: [], levelError: '', noOfQuestionsError: '', keywordsError: '' }]);
    setResetKey(prevKey => prevKey + 1);
    setRoleError('')
    setToolsError('')
  };

  const backToHome = () => {
    navigate('/home');
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setRole(newRole);
    if (!newRole) {
      setRoleError('Role is required');
    } else {
      setRoleError('');
    }
  };
  
  const handleLevelChange = (index, field, value) => {
    const newLevels = levels.slice();
    newLevels[index][field] = value;

    if (field === 'level' && !value) {
      newLevels[index].levelError = 'Complexity is required';
    } else {
      newLevels[index].levelError = '';
    }

    if (field === 'noOfQuestions') {
      if (!value || value < 1 || value > 20) {
        newLevels[index].noOfQuestionsError = 'Please enter a valid number of questions (between 1-20)';
      } else {
        newLevels[index].noOfQuestionsError = '';
      }
    }

    setLevels(newLevels);
  };

  const handleKeywordsChange = (newChips, index) => {
    setLevels(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[index].keywords = newChips;
      updatedCards[index].keywordsError = newChips.length === 0 ? 'Please press \',\' or \'Enter\' to add the keywords' : '';
      return updatedCards;
    });
  };

  const handleToolsChange = (newChips) => {
    if (newChips.length === 0) {
      setToolsError('Please press \'\,\'\ or \'\Enter\'\ to add the tools/technologies');
      return;
    }
    setToolsError('');
    setTools(newChips);
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      const downloadFormData = new FormData();
      downloadFormData.append('markdown_content', generatedExercise);
      const downloadResponse = await axios.post('https://localhost:8000/download-docx', downloadFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Assessment.docx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating docx:', error);
      toast.error('Failed to generate docx. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRefresh = () => {
    setGeneratedExercise('');
    setIsAnsReady(false);
  };
  
  return (
    <div className="exerciseCreatorBody">
      <div className="heading">
        <div className="exercise-header">
          <button className="back-button" onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
          <div className="title-container">
            <h3>Subjective Based Assessment</h3>
          </div>
        </div>
      </div>
      <div className="input">
        <div className="exercise-top">
          <div className="first">
            <div className="Text">
              <FormControl sx={{ marginBottom: '-20px' }} fullWidth>
                <TextField
                  placeholder="Enter the role who will take the exercise"
                  fullWidth
                  label={
                    <span>
                      Role<span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}
                  onChange={handleRoleChange}
                  value={role}
                  error={!!roleError}
                  
                />
                <div className='error-messages' style={{color: "Red"}}>{roleError}</div>
              </FormControl>
            </div>
            <div className="Text">
              <FormControl fullWidth>
                <div className="chips">
                  <Chip style={{maxWidth: "15vw", marginTop: "1vh"}} label="Full Stack Developer" className="chip" />
                  <Chip style={{maxWidth: "15vw", marginTop: "1vh"}}  label="Business Analyst" className="chip" />
                  <Chip style={{maxWidth: "15vw", marginTop: "1vh"}}  label="IT Project Manager" className="chip" />
                  <Chip style={{maxWidth: "15vw", marginTop: "1vh"}} label="Technical Recruiter" className="chip" />
                  <Chip style={{maxWidth: "15vw", marginTop: "1vh"}} label="Sales Manager" className="chip" />
                </div>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="topp">
          <div className="cards-container">
            {levels.map((level, index) => (
              <div className="exercise-card" key={index}>
                <div className="left">
                  <div className="card-row">
                    <FormControl fullWidth>
                      <ChipInput
                        initialChips={level.keywords}
                        placeholder="Enter one or more keywords by pressing ' , /ENTER' for the exercise"
                        onChange={newChips => handleKeywordsChange(newChips, index)}
                        key={`keywords-${index}-${resetKey}`}
                        value={level.keywords}
                        error={!!level.keywordsError}
                        label={
                          <span>
                            Keywords<span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                      
                      />
                      {/* <div className='error-messages' style={{color: "Red"}}>{level.keywordsError}</div> */}
                    </FormControl>
                  </div>
                  <div className="card-row">
                    <FormControl fullWidth sx={{ marginTop: '1px' }}>
                      <div className="chips">
                        <Chip style={{maxWidth: "15vw", marginTop: "1vh"}} label="Array" />
                        <Chip style={{maxWidth: "15vw", marginTop: "1vh"}} label="API Design" />
                        <Chip  style={{maxWidth: "15vw", marginTop: "1vh"}} label="SWOT Analysis" />
                        <Chip  style={{maxWidth: "15vw", marginTop: "1vh"}} label="Risk Management" />
                        <Chip  style={{maxWidth: "15vw", marginTop: "1vh"}} label="Testing" />
                      </div>
                    </FormControl>
                    
                  </div>
                  <div className="levels">
                    <div className="levell">
                      <FormControl fullWidth>
                        <InputLabel>
                          <span>
                            Complexity<span style={{ color: 'red' }}>*</span>
                          </span>
                        </InputLabel>
                        <Select
                          fullWidth
                          label="Complexity*"
                          name="level"
                          autoWidth
                          value={level.level}
                          onChange={(e) => handleLevelChange(index, 'level', e.target.value)}
                          sx={{ height: '50px', '.MuiInputBase-input': { height: '30px' } }}
                          error={!!level.levelError}
                          inputProps={{
                            max: 100,
                            min: 1,
                            onKeyPress: (event) => {
                              const charCode = event.which ? event.which : event.keyCode;
                              if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 8) {
                                event.preventDefault();
                              }
                            }
                          }}
                        >
                          {LevelOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <div className='error-messages' style={{color: "Red"}}>{level.levelError}</div>
                      </FormControl>
                    </div>
                    <div className="levell">
                      <FormControl fullWidth>
                        <InputLabel>
                          <span>
                            Number of Questions<span style={{ color: 'red' }}>*</span>
                          </span>
                        </InputLabel>
                        <OutlinedInput
                          fullWidth
                          value={level.noOfQuestions}
                          onChange={(e) => handleLevelChange(index, 'noOfQuestions', e.target.value)}
                          required
                          label="Number of Questions*"
                          type="number"
                          inputProps={{
                            max: 100,
                            min: 1,
                          }}
                          sx={{ height: '50px', '.MuiInputBase-input': { height: '30px' } }}
                          error={!!level.noOfQuestionsError}
                        />
                        <div className='error-messages' style={{color: "Red"}}>{level.noOfQuestionsError}</div>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="lvl-btn">
                    {levels.length > 1 && (
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
                        title="Remove the card"
                        placement="top"
                        arrow
                      >
                        <Button variant="outlined" onClick={() => handleRemoveLevel(index)} style={{ border: '1px solid red' }}>
                          <DeleteIcon sx={{ color: 'red' }} />
                        </Button>
                      </Tooltip>
                    )}
                    {index === levels.length - 1 && levels.length < 3 && (
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
                        title="Add another card"
                        placement="top"
                        arrow
                      >
                        <Button variant="contained" onClick={handleAddLevel}>
                          +
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <FormControl fullWidth>
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
                }}
              }
              title="Add tools/technologies for the exercise"
              arrow
            >
              <ChipInput
                initialChips={tools}
                placeholder="Enter one or more tools/technologies to use."
                onChange={handleToolsChange}
                key={`tools${resetKey}`}
                label={<span>Tools/Technologies</span>}
                error={!!toolsError}
                
              />
              {/* <div className='error-messages' style={{color: "Red"}}>{toolsError}</div> */}
            </Tooltip>
          </FormControl>
        </div>

        <div className="submit-area">
          <FormControlLabel control={<Checkbox checked={hints} onChange={(e) => setHints(e.target.checked)} />}
            label="Provide hints in exercises"
            sx={{ marginLeft: "1%" }}
          />

          <div className="submit-btn">
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
                }}
              }
              title="Reset the form"
              placement="top"
              arrow
            >
              <Button variant="contained" onClick={handleReset} style={{ marginRight: '10px' }}>
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
  title="Generate the Assessment"
  placement="top"
  arrow
>
  <Button variant="contained" type="submit" onClick={handleSubmit} disabled={!isFormValid}>
    Generate
  </Button>
</Tooltip>

            {/* {isAnsReady && (
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
                title="Download the assessment in .docx"
                placement="top"
                arrow
              >
                <Button
                  type="button"
                  className="download-btn"
                  style={{ backgroundColor: 'green', color: 'white', marginLeft: '4px' }}
                  onClick={handleDownloadDocx}
                >
                  <DownloadIcon />
                </Button>
              </Tooltip>
            )} */}
          </div>
        </div>
      </div>
    
      {isLoading && !isAnsReady ? (
        <div className="loading-dots">
          <div className="spinner-container">
          <Spinner />
        </div>
        </div>
      ) : null}
      {isAnsReady && (
        <div className="output-area" ref={responseContainerRef}>
          <div className="response-containerr">
            <MarkdownPreview source={generatedExercise} />
          </div>
        </div>
      )}
      <ToastContainer style={{ zIndex: '10000000' }} />
    </div>
  );
}

export default ExerciseGenerator;
