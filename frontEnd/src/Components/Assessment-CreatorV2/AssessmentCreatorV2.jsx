import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import './AssessmentCreatorV2.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import { Button, Chip, FormHelperText, OutlinedInput, Tooltip, makeStyles } from '@mui/material';
import ChipInput from './ChipInput';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Spinner from '../Spinner';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';

export default function AssessmentCreatorV2() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnsReady, setIsAnsReady] = useState(false);
  const [resp, setResp] = useState('');
  const responseContainerRef = useRef(null);
  const [quizData, setQuizData] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [resetKeyPressed, setResetKeyPressed] = useState(false);

  const [cards, setCards] = useState([
    {
      keywords: [],
      tools: [],
      level: '',
      noOfQuestions: '',
      levelError: { error: false, message: '' },
      noOfQuestionsError: { error: false, message: '' },
      keywordsError: false,
    },
  ]);

  const [assessmentName, setAssessmentName] = useState('');
  const [role, setRole] = useState('');

  const [assessmentNameError, setAssessmentNameError] = useState(false);
  const [assessmentNameErrorMsg, setAssessmentNameErrorMsg] = useState('');
  const [roleError, setRoleError] = useState(false);
  const [roleErrorMsg, setRoleErrorMsg] = useState('');

  const stringValidationRegex = /^\D.*$/;
  const assessmentNameRegex = /^[a-zA-Z][a-zA-Z0-9_ -]*$/;
  const [isFieldsFrozen, setIsFieldsFrozen] = useState(false);

  const navigate = useNavigate();

  const handleKeywordsChange = (newChips, cardIndex) => {
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[cardIndex].keywords = newChips;
      updatedCards[cardIndex].keywordsError = newChips.length === 0;
      updateFormValidity(updatedCards, assessmentName, role);
      return updatedCards;
    });
  };

  const handleToolsChange = (newChips, cardIndex) => {
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[cardIndex].tools = newChips;
      updateFormValidity(updatedCards, assessmentName, role);
      return updatedCards;
    });
  };

  const handleFieldChange = (event, cardIndex) => {
    const { name, value } = event.target;

    setCards(prevCards => {
      const updatedCards = [...prevCards];
      updatedCards[cardIndex][name] = value;

      if (name === 'noOfQuestions') {
        let newValue = parseInt(value, 10);
        newValue = isNaN(newValue) ? '' : Math.max(1, Math.min(10, newValue));

        const isValid = newValue !== '' && newValue >= 1 && newValue <= 100;
        updatedCards[cardIndex].noOfQuestionsError = {
          error: !isValid,
          message: isValid ? '' : 'Please enter a valid number of questions',
        };
        updatedCards[cardIndex].noOfQuestions = newValue.toString();
      } else if (name === 'level') {
        const isValid = value !== '';
        updatedCards[cardIndex].levelError = {
          error: !isValid,
          message: isValid ? '' : 'Complexity is required',
        };
      }

      updateFormValidity(updatedCards, assessmentName, role);
      return updatedCards;
    });
  };

  const validateCard = card => {
    const { keywords, level, noOfQuestions } = card;

    const keywordsValid = keywords.length > 0;
    const levelValid = level !== '';
    const noOfQuestionsValid = !isNaN(parseInt(noOfQuestions, 10)) && parseInt(noOfQuestions, 10) > 0;

    return {
      keywordsError: !keywordsValid,
      levelError: { error: !levelValid, message: 'Complexity is required' },
      noOfQuestionsError: {
        error: !noOfQuestionsValid,
        message: 'Please enter a valid number of questions',
      },
      isValid: keywordsValid && levelValid && noOfQuestionsValid,
    };
  };

  const handleAddCard = () => {
    let allCardsValid = true;

    setCards(prevCards => {
      const updatedCards = prevCards.map(card => {
        const validation = validateCard(card);
        if (!validation.isValid) {
          allCardsValid = false;
        }
        return { ...card, ...validation };
      });

      if (!allCardsValid) {
        return updatedCards;
      }

      return [
        ...prevCards,
        {
          keywords: [],
          tools: [],
          level: '',
          noOfQuestions: '',
          levelError: { error: false, message: '' },
          noOfQuestionsError: { error: false, message: '' },
          keywordsError: false,
        },
      ];
    });

    updateFormValidity();
  };

  const handleRemoveCard = cardIndex => {
    setCards(prevCards => prevCards.filter((_, i) => i !== cardIndex));
    updateFormValidity();
  };

  const backToHome = () => {
    navigate('/home');
  };

  const validateAssessmentName = name => {
    if (!name.trim()) {
      setAssessmentNameError(true);
      setAssessmentNameErrorMsg('Assessment name is required');
      return false;
    }
    if (!stringValidationRegex.test(name)) {
      setAssessmentNameError(true);
      setAssessmentNameErrorMsg("Assessment name can't start with numbers");
      return false;
    }
    if (!assessmentNameRegex.test(name)) {
      setAssessmentNameError(true);
      setAssessmentNameErrorMsg('Please enter a valid assessment name');
      return false;
    }
    setAssessmentNameError(false);
    return true;
  };

  const handleAssessmentNameChange = event => {
    const { value } = event.target;
    const trimmedValue = value.trimStart();
    setAssessmentName(trimmedValue);
    validateAssessmentName(trimmedValue);
    updateFormValidity(cards, trimmedValue, role);
  };

  const validateRole = value => {
    if (!value.trim()) {
      setRoleErrorMsg('Role is required.');
      setRoleError(true);
      return false;
    }
    if (!stringValidationRegex.test(value)) {
      setRoleError(true);
      setRoleErrorMsg("Role can't start with numbers");
      return false;
    }
    if (!assessmentNameRegex.test(value)) {
      setRoleErrorMsg('Please enter a valid role');
      setRoleError(true);
      return false;
    }
    setRoleError(false);
    return true;
  };

  const handleRoleChange = event => {
    const { value } = event.target;
    const trimmedValue = value.trimStart();
    setRole(trimmedValue);
    validateRole(trimmedValue);
    updateFormValidity(cards, assessmentName, trimmedValue);
  };

  const sanitizeCardsData = cards => {
    return cards.map(({ keywords, tools, level, noOfQuestions }) => ({
      keywords,
      tools,
      level,
      noOfQuestions,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!validateAssessmentName(assessmentName) || !validateRole(role)) {
      return;
    }

    const updatedCards = cards.map(card => {
      const validation = validateCard(card);
      return { ...card, ...validation };
    });

    const allCardsValid = updatedCards.every(card => card.keywords.length > 0 && card.level !== '' && card.noOfQuestions !== '');

    setCards(updatedCards);

    if (!allCardsValid) {
      setIsLoading(false);
      setIsAnsReady(false);
      return;
    }

    const sanitizedCards = sanitizeCardsData(updatedCards);
    const postData = {
      role,
      cards: sanitizedCards,
    };

    // console.log(postData);

    try {
      setIsLoading(true);
      setIsAnsReady(false);
      const response = await fetch('https://content-crafter-dev.stackroute.in/crafter/api/v2/generate_assessment', {
        // const response = await fetch('http://localhost:8000/crafter/api/v2/generate_assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-secure-token'
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      setResp(formatString(result.assessment));
      // console.log(result.assessment);
      try {
        const quizDataa = parseResponseString(result.assessment);

        setQuizData(quizDataa);
      } catch (error) {
        toast.error('Oh no, something went wrong!');
        setIsLoading(false);
        setIsAnsReady(false);
      }
      setIsLoading(false);
      setIsAnsReady(true);
    } catch (error) {
      toast.error('Oh no, something went wrong!');
      setIsLoading(false);
      setIsAnsReady(false);
    }
  };

  function formatString(input) {
    const questionPattern = /\*\*Question \d+:\*\*/g;
    const answerPattern = / \*\*Answer:\*\*\s*([A-D]\.\s*[\d\s]+) /;
    const optionPattern = /[A-D]\. /g;

    let formatted = input.replace(questionPattern, '\n$&').replace(answerPattern, '\n$&').replace(optionPattern, '\n$&');

    return formatted.trim();
  }

  const handleReset = () => {
    setAssessmentName('');
    setRole('');
    setCards([
      {
        keywords: [],
        tools: [],
        level: '',
        noOfQuestions: '',
        levelError: { error: false, message: '' },
        noOfQuestionsError: { error: false, message: '' },
        keywordsError: false,
      },
    ]);
    setIsAnsReady(false);
    setIsLoading(false);
    setAssessmentNameError(false);
    setRoleError(false);
    setResetKey(prevKey => prevKey + 1);

    // Ensuring form validity is updated after state changes
    setTimeout(() => {
      updateFormValidity(
        [
          {
            keywords: [],
            tools: [],
            level: '',
            noOfQuestions: '',
            levelError: { error: false, message: '' },
            noOfQuestionsError: { error: false, message: '' },
            keywordsError: false,
          },
        ],
        '',
        '',
      );
    }, 0);
  };

  const parseResponseString = responseString => {
    const questions = responseString.split('**Question');

    questions.shift();

    return questions.map(question => {
      const [questionWithCode, answerText] = question.split('**Answer:');

      const [questionText, codeSnippet] = questionWithCode.split('```');

      const optionsAndCode = questionText.split('\n').filter(line => line.trim() !== '');
      const questionWithoutCode = optionsAndCode[0];
      const options = optionsAndCode.slice(1);
      const optionss = [];
      const extractOptions = question => {
        const optionRegex = /[A-D]\.\s*(.*)/g;
        let match;

        while ((match = optionRegex.exec(question)) !== null) {
          optionss.push(match[1]);
        }
      };
      if (codeSnippet != null) {
        extractOptions(question);
        options[1] = optionss[0];
        options[2] = optionss[1];
        options[3] = optionss[2];
        options[4] = optionss[3];
      }

      const answer = answerText.trim();

      return {
        question: questionWithoutCode.trim(),
        options: options.map(option => option.trim()),
        codeSnippet: codeSnippet ? codeSnippet.trim() : null,
        answer,
      };
    });
  };

  const downloadExcel = () => {
    if (quizData.length > 0) {
      const cleanedData = quizData.map(item => {
        const cleanedItem = {};
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'string') {
            cleanedItem[key] = item[key].replace(/^\*\*/, '').replace(/\*\*$/, '');
          } else {
            cleanedItem[key] = item[key];
          }
        });
        return cleanedItem;
      });

      const formattedData = cleanedData.map(item => {
        const formattedItem = {};
        item.options.forEach((option, index) => {
          if (item.codeSnippet == null) {
            formattedItem[`option${index + 1}`] = index === 0 ? option : option.substring(2);
          } else {
            formattedItem[`option${index + 1}`] = index === 0 ? option : option;
          }
        });
        formattedItem.codeSnippet = item.codeSnippet;

        if (typeof item.answer === 'string') {
          formattedItem.answer = item.answer.replace(/^\*\*/, '').replace(/\*\*$/, '');
          if (formattedItem.answer.startsWith('.')) {
            const dotIndex = formattedItem.answer.indexOf('.');
            formattedItem.answer = dotIndex !== -1 ? formattedItem.answer.substring(0, dotIndex) : formattedItem.answer;
          } else {
            formattedItem.answer = formattedItem.answer.substring(formattedItem.answer.indexOf('.') + 1).trim();
          }
        } else {
          formattedItem.answer = item.answer;
        }

        return formattedItem;
      });

      const formattedDataa = formattedData.map(item => {
        return {
          Question: item.option1,
          codeSnippet: item.codeSnippet,
          A: item.option2,
          B: item.option3,
          C: item.option4,
          D: item.option5,
          answer: item.answer.replace(/^\*\*/, '').replace(/\*\*$/, ''),
        };
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedDataa);
      XLSX.utils.book_append_sheet(workbook, worksheet, assessmentName);
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = assessmentName + '.xlsx';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const updateFormValidity = (updatedCards = cards, updatedAssessmentName = assessmentName, updatedRole = role) => {
    const cardsValid = updatedCards.every(card => card.keywords.length > 0 && card.level !== '' && card.noOfQuestions !== '');
    const assessmentNameValid = updatedAssessmentName.trim() !== '';
    const roleValid = updatedRole.trim() !== '';
    setIsFormValid(assessmentNameValid && roleValid && cardsValid);
  };

  useEffect(() => {
    if (isAnsReady) {
      responseContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isAnsReady]);

  const totalQuestions = cards.reduce((acc, card) => acc + (parseInt(card.noOfQuestions, 10) || 0), 0);

  return (
    <div className="assessmentCreatorBody">
      <div className="heading">
        <div className="assessment-header">
          <button className="back-button" onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
          <div className="title-container">
            <h3>Assessment Creator</h3>
          </div>
        </div>
      </div>
      <div className="input">
        <div className="assessment-top">
          <div className="first">
            <div className="Assessment-Text">
              <FormControl fullWidth error={assessmentNameError}>
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
                  title="Enter a name of the assessment"
                  placement="bottom"
                  arrow
                >
                  <TextField
                    fullWidth
                    error={assessmentNameError}
                    id="outlined-basic"
                    className="textinput"
                    type="text"
                    name="assessmentName"
                    placeholder="Enter a name of the assessment"
                    label={
                      <span>
                        Assessment Name<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    disabled={isFieldsFrozen}
                    value={assessmentName}
                    onChange={handleAssessmentNameChange}
                    sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}
                  />
                  {assessmentNameError && <FormHelperText id="component-error-text">{assessmentNameErrorMsg}</FormHelperText>}
                </Tooltip>
              </FormControl>
            </div>
            <div className="Assessment-Text">
              <FormControl sx={{ marginBottom: '-10px' }} fullWidth error={roleError}>
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
                  title="Enter the role who will take the assessment"
                  placement="bottom"
                  arrow
                >
                  <TextField
                    placeholder="Enter the role who will take the assessment"
                    fullWidth
                    label={
                      <span>
                        Role<span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}
                    onChange={handleRoleChange}
                    value={role}
                    error={roleError}
                  />
                  {roleError && <FormHelperText id="component-error-text">{roleErrorMsg}</FormHelperText>}
                </Tooltip>
              </FormControl>
            </div>
            <div className="Assessment-Text">
              <FormControl fullWidth>
                <div className="assessment-chips">
                  <Chip label="Full Stack Developer" className="chip" />
                  <Chip label="Business Analyst" className="chip" />
                  <Chip label="IT Project Manager" className="chip" />
                  <Chip label="Technical Recruiter" className="chip" />
                  <Chip label="Sales Manager" className="chip" />
                </div>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="topp">
          <div className="cards-container">
            {cards.map((card, cardIndex) => (
              <div className="assessment-card" key={cardIndex}>
                <div className="left">
                  <div className="card-row">
                    <FormControl fullWidth error={card.keywordsError} sx={{ marginBottom: '-10px' }}>
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
                        title="Add one or more keywords for the assessment"
                        placement="bottom"
                        arrow
                      >
                        <ChipInput
                          initialChips={card.keywords}
                          placeholder="Press , or enter to add one or more keywords for the assessment"
                          onChange={newChips => handleKeywordsChange(newChips, cardIndex)}
                          key={`keywords-${cardIndex}-${resetKey}`}
                          label={
                            <span>
                              Keywords<span style={{ color: 'red' }}>*</span>
                            </span>
                          }
                          value={card.keywords}
                          errorState={card.keywordsError}
                        />
                        {card.keywordsError && <FormHelperText>At least one keyword is required</FormHelperText>}
                      </Tooltip>
                    </FormControl>
                  </div>
                  <div className="card-row">
                    <FormControl fullWidth sx={{ marginTop: '1px' }}>
                      <div className="chips">
                        <Chip label="Array">Programmer</Chip>
                        <Chip label="API Design">Programmer</Chip>
                        <Chip label="SWOT Analysis​">Business Analyst​</Chip>
                        <Chip label="Risk Management​"></Chip>
                        <Chip label="Testing"></Chip>
                      </div>
                    </FormControl>
                  </div>
                  <div className="card-row">
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
                          },
                        }}
                        title="Add one or more tools/technolgies to use"
                        placement="bottom"
                        arrow
                      >
                        <ChipInput
                          initialChips={card.tools}
                          placeholder="Press , or enter to add one or more tools/technolgies to use"
                          onChange={newChips => handleToolsChange(newChips, cardIndex)}
                          label="Tools/Technologies"
                          value={card.tools}
                          errorState={false}
                          key={`tools-${cardIndex}-${resetKey}`}
                        />
                        <></>
                      </Tooltip>
                    </FormControl>
                  </div>
                  <div className="levels">
                    <div className="levell">
                      <FormControl fullWidth error={card.levelError.error}>
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
                          title="Select complexity of assessment"
                          placement="bottom"
                          arrow
                        >
                          <InputLabel>
                            {' '}
                            <span>
                              Complexity<span style={{ color: 'red' }}>*</span>
                            </span>
                          </InputLabel>
                          <Select
                            fullWidth
                            label="Complexity*"
                            name="level"
                            value={card.level}
                            sx={{ height: '50px', '.MuiInputBase-input': { height: '30px' } }}
                            onChange={event => handleFieldChange(event, cardIndex)}
                            error={card.levelError.error}
                          >
                            {['low', 'medium', 'high'].map(option => (
                              <MenuItem value={option} key={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                          {card.levelError.error && <FormHelperText>{card.levelError.message}</FormHelperText>}
                        </Tooltip>
                      </FormControl>
                    </div>
                    <div className="levell">
                      <FormControl fullWidth error={card.noOfQuestionsError.error}>
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
                          title="Enter no of questions(1-10)"
                          placement="bottom"
                          arrow
                        >
                          <InputLabel>
                            {' '}
                            <span>
                              Number of Questions<span style={{ color: 'red' }}>*</span>
                            </span>
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            name="noOfQuestions"
                            value={card.noOfQuestions}
                            onChange={event => handleFieldChange(event, cardIndex)}
                            label={
                              <span>
                                Number of Questions<span style={{ color: 'red' }}>*</span>
                              </span>
                            }
                            type="number"
                            sx={{ height: '50px', '.MuiInputBase-input': { height: '30px' } }}
                            error={card.noOfQuestionsError.error}
                          />
                          {card.noOfQuestionsError.error && <FormHelperText>{card.noOfQuestionsError.message}</FormHelperText>}
                        </Tooltip>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="lvl-btn">
                    {cards.length > 1 && (
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
                        placement="bottom"
                        arrow
                      >
                        <Button variant="outlined" onClick={() => handleRemoveCard(cardIndex)} style={{ border: '1px solid red' }}>
                          <DeleteIcon sx={{ color: 'red' }} />
                        </Button>
                      </Tooltip>
                    )}
                    {cardIndex === cards.length - 1 && cards.length < 7 && (
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
                        placement="bottom"
                        arrow
                      >
                        <Button variant="contained" onClick={handleAddCard}>
                          +
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="submit-area">
          <div className="footer">
            <span>Total Questions: {totalQuestions}</span>
          </div>
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
                },
              }}
              title="Reset the form"
              placement="bottom"
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
              placement="bottom"
              arrow
            >
              <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid}>
                Generate
              </Button>
            </Tooltip>

            {isAnsReady && (
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
                title="Download Excel sheet"
                placement="bottom"
                arrow
              >
                <Button
                  type="button"
                  className="download-btn"
                  onClick={downloadExcel}
                  style={{ backgroundColor: 'green', color: 'white', marginLeft: '4px' }}
                >
                  <DownloadIcon />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      {isLoading && !isAnsReady ? (
        <div className="loading-dots">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      {isAnsReady && (
        <div className="output-area" ref={responseContainerRef}>
          <div className="response-containerr">
            <MarkdownPreview source={resp} />
          </div>
        </div>
      )}
      <ToastContainer style={{ zIndex: '10000000' }} />
    </div>
  );
}
