import React, { useState,useEffect } from 'react';
import './UserStories.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import axios from 'axios';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import Spinner from '../Spinner';
import {
  Box,
  Button,
  Tooltip,
  TextField,
  InputLabel,
  FormControl,
  InputAdornment,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Chip,
  Dialog,
  Card,
  DialogTitle,
  CardContent,
  DialogContent,
  FormHelperText,
} from '@mui/material';

const UserStories = () => {
  const navigate = useNavigate();
  const featureForOptions = ['End-to-End', 'Front-end', 'Back-end', 'DevOps', 'Testing'];
  const [applicationType, setApplicationType] = useState('');
  const [featureToImplement, setFeatureToImplement] = useState('');
  const [featureFor, setFeatureFor] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isFeatureToImplementValid, setIsFeatureToImplementValid] = useState(true);
  const [isUserRoleValid, setIsUserRoleValid] = useState(true);
  const [isFeatureForValid, setIsFeatureForValid] = useState(true);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [selectedStories, setSelectedStories] = useState([]); // Array to track selected stories for copy
  const [isUserRoleRequired, setIsUserRoleRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDialogStories, setSelectedDialogStories] = useState([]);
  const [applicationTypeError, setApplicationTypeError] = useState('');
  const [isApplicationTypeInvalid, setIsApplicationTypeInvalid] = useState(false);
  const [featureError, setFeatureError] = useState('');
  const [isFeatureInvalid, setIsFeatureInvalid] = useState(false);
  const [userRoleError, setUserRoleError] = useState('');
  const [isUserRoleInvalid, setIsUserRoleInvalid] = useState(false);
  const [isGenerateEnabled, setIsGenerateEnabled] = useState(false); 




  const handleChange = event => {
    const { name, value } = event.target;

    switch (name) {
      case 'applicationType':
        const trimmedValue = value.trimStart();
        const isValidStart = /^[a-zA-Z][a-zA-Z0-9_ -]*$/.test(trimmedValue);

        setApplicationType(trimmedValue);

        // Update error message directly
        if (trimmedValue === '') {
          setApplicationTypeError('Application Type is required.');
          setIsApplicationTypeInvalid(true);
        } else if (!isValidStart) {
          setApplicationTypeError('Application Type cannot start with a number or special character.');
          setIsApplicationTypeInvalid(true);
        } else {
          setApplicationTypeError('');
          setIsApplicationTypeInvalid(false);
        }
        break;
        case 'featureToImplement':
        const trimmedFeatureValue = value.trimStart();
        const isValidFeatureStart = /^[a-zA-Z]/.test(trimmedFeatureValue); 

        setFeatureToImplement(trimmedFeatureValue);

        if (trimmedFeatureValue === '') {
          setFeatureError('Feature to Implement is required.');
          setIsFeatureInvalid(true);
        } else if (!isValidFeatureStart) {
          setFeatureError('Cannot start with a number or special character.');
          setIsFeatureInvalid(true);
        } else {
          setFeatureError('');
          setIsFeatureInvalid(false);
        }
        break;
        case 'featureFor':
          setFeatureFor(value);
          setIsUserRoleRequired(['End-to-End', 'Front-end', 'Back-end'].includes(value));
  
          // Clear/validate User Role 
          if (isUserRoleRequired) {
            const isUserRoleValid = userRole.trimStart().length > 0 && /^[a-zA-Z]/.test(userRole.trimStart());
            setIsUserRoleInvalid(!isUserRoleValid);
            setUserRoleError(!isUserRoleValid ? 'User Role is required and must start with a letter.' : '');
          } else {
            setUserRole(''); 
            setUserRoleError('');
            setIsUserRoleInvalid(false);
          }
  
          // Check Feature For validity
          const isFeatureForValid = value !== 'Feature for';
          setIsFeatureForValid(isFeatureForValid);

        break;
        case 'userRole':
          const trimmedUserValue = value.trimStart();
          const isValidUserRoleStart = /^[a-zA-Z]/.test(trimmedUserValue); // Check for valid start
  
          setUserRole(trimmedUserValue);
  
          if (trimmedUserValue === '') {
            setUserRoleError('User Role is required.');
            setIsUserRoleInvalid(true);
          } else if (!isValidUserRoleStart) { // Check if it starts with a number
            setUserRoleError('Cannot start with a number or special character.');
            setIsUserRoleInvalid(true);
          } else {
            setUserRoleError('');
            setIsUserRoleInvalid(false);
          }
          break;
      default:
        break;
    }
   
  };

  useEffect(() => {
    // Calculate isGenerateEnabled based on all form values
    setIsGenerateEnabled(
      applicationType.trimStart().length > 0 &&
      /^[a-zA-Z][a-zA-Z0-9_ -]*$/.test(applicationType.trimStart()) &&
      featureToImplement.trimStart().length > 0 &&
      /^[a-zA-Z]/.test(featureToImplement.trimStart()) &&
      featureFor !== 'Feature for' && featureFor !== '' &&
      (!isUserRoleRequired || (userRole.trimStart().length > 0 && /^[a-zA-Z]/.test(userRole.trimStart())))
    );
  }, [applicationType, featureToImplement, featureFor, isUserRoleRequired, userRole]); // Dependencies

  // ... (rest of your component code) ...




  

  const UserRoleValidatio = () => {
    setIsUserRoleInvalid(userRole.trim() == '');
    setUserRoleError('User Role is required.');

    return userRole.trim() !== '';
  };

  const featureForValidatio = () => {
    // alert(isFeatureToImplementValid);
    setIsFeatureForValid(!featureFor.trim() == '' || !featureFor.trim() == 'feature for');
    return !featureFor.trim() == '' || !featureFor.trim() == 'feature for';
  };

  const ApplicationTypeValidation = () => {
    // alert("Called")
    setIsApplicationTypeInvalid(applicationType.trim() == ''); // Basic validation
    setApplicationTypeError('Application Type is required.');

    return applicationType.trim() !== ''; // Basic validation
  };

  const FeatureValidation = () => {
    // alert('Hiiiiiiiiiii');
    setIsFeatureInvalid(featureToImplement.trim() == ''); // Basic validation
    setFeatureError('Feature to Implement is required.');


    return featureToImplement.trim() !== ''; // Basic validation
  };

  const backToHome = () => {
    navigate('/home');
  };

  const handleGenerateClick = async () => {
    // Validation (adjust to your needs)
    if (!ApplicationTypeValidation() || !FeatureValidation() || !featureForValidatio()) {
      toast.error('Please fill in all required fields.');
      setIsLoading(false);

      return;
    }

    if (isUserRoleRequired) {
      if (!UserRoleValidatio()) {
        toast.error('Please fill in all required fields.');
        return;
      }
    }

    setIsLoading(true);

    // Gather data in an object
    const userStoryData = {
      application_type: applicationType,
      feature: featureToImplement,
      feature_for: featureFor,
      user_role: userRole,
    };

    console.log(userStoryData);

    try {
      // const response = await axios.post('https://localhost:8000/crafter/api/v2/generate-user-story', userStoryData);
      const response = await axios.post('https://content-crafter-dev.stackroute.in/crafter/api/v2/user-story/generate', userStoryData);

      setStories([
        ...stories,
        // { title: `User Stories for ${applicationType} ${featureToImplement} ${stories.length + 1}`, content: response.data },

        // { title: `User Stories for ${applicationType} ${featureToImplement} (${featureFor}) `, content: response.data },
        { title: `${featureToImplement} feature for ${applicationType} application (${featureFor}) `, content: response.data },
      ]);
      setIsResult(true);
      setIsLoading(false);
    } catch (error) {
      toast.error('Error from server');
      console.error('Error generating user story:', error);
      setIsLoading(false);
    }
  };
 

  const handleReset = () => {
    setApplicationType('');
    setFeatureToImplement('');
    setFeatureFor('');
    setUserRole('');
    setIsFeatureToImplementValid(true);
    setIsUserRoleRequired(false);
    setIsApplicationTypeInvalid(false);
    setIsFeatureInvalid(false);
    setIsUserRoleInvalid(false)
    setIsResult(false);
    setStories([])
  };
  const handleStoryClick = story => {
    setSelectedStory(story);
    setSelectedDialogStories([]); // Clear selection on dialog open

    console.log(story);
    setOpenModal(true);
  };

  const handleDeleteStory = story => {
    // 1. Filter out the deleted story
    const updatedStories = stories.filter(item => item !== story);
    const updatedSelectedStories = selectedStories.filter(item => item !== story);
    setSelectedStories(updatedSelectedStories);
    if (updatedStories.length === 0) {
      setIsResult(false);
    }

    // 2. Update the 'stories' state
    setStories(updatedStories);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleStorySelection = story => {
    if (selectedStories.includes(story)) {
      setSelectedStories(selectedStories.filter(s => s !== story)); // Remove if already selected
    } else {
      setSelectedStories([...selectedStories, story]); // Add if not selected
    }
  };

  const handleCopySelected = () => {
    if (stories.length === 0) {
      // alert('Please select at least one story');
      toast.info('Please select at least one story');

      return;
    }
    handleSelectAll();

    const textToCopy = stories
      .map(story => {
        return story.content.map(item => item.userStory).join('\n\n');
      })
      .join('\n\n');

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success('User stories copied!'))
      .catch(err => console.error('Error copying user stories:', err));
  };

  const handleSelectAll = () => {
    if (selectedStories.length === stories.length) {
      setSelectedStories([]); // Deselect all
    } else {
      setSelectedStories([...stories]); // Select all
    }
  };

  const handleDialogStorySelection = story => {
    if (selectedDialogStories.includes(story)) {
      setSelectedDialogStories(selectedDialogStories.filter(s => s !== story));
    } else {
      setSelectedDialogStories([...selectedDialogStories, story]);
    }
  };

  const handleDialogDeleteStory = item => {
    // 1. Dialog State Update
    const updatedContent = selectedStory.content.filter(storyItem => storyItem !== item);
    const updatedDialogSelectedStroies = selectedDialogStories.filter(story => story !== item);
    setSelectedDialogStories(updatedDialogSelectedStroies);

    // 2. Check for Empty Content
    if (updatedContent.length === 0) {
      // Remove the story from 'stories' entirely
      const updatedStories = stories.filter(story => story.title !== selectedStory.title);
      setStories(updatedStories);

      // Close the dialog (optional)
      handleCloseModal();
    } else {
      // Update states as before
      setSelectedStory({ ...selectedStory, content: updatedContent });

      const updatedStories = stories.map(story => {
        if (story.title === selectedStory.title) {
          return { ...story, content: updatedContent };
        } else {
          return story;
        }
      });
      setStories(updatedStories);
    }
  };

  const handleDialogSelectAll = () => {
    if (selectedDialogStories.length === selectedStory.content.length) {
      setSelectedDialogStories([]); // Deselect all
    } else {
      setSelectedDialogStories([...selectedStory.content]); // Select all
    }
  };

  const handleDialogCopySelected = () => {
    if (selectedDialogStories.length === 0) {
      // alert('Please select at least one story');
      toast.info('Please select at least one story');

      return;
    }

    const textToCopy = selectedDialogStories.map(item => item.userStory).join('\n\n');
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success('Selected stories copied!'))
      .catch(err => console.error('Error copying text:', err));
  };

  const updateApplicationType = type => {
    setIsApplicationTypeInvalid(type.trim() !== ''); // Basic validation
    setApplicationType(type);
    setIsApplicationTypeInvalid(false)
  };

  const updateUserRole = role => {
    setUserRole(role);
    setIsUserRoleValid(role.trim() !== '')
  }

  console.log(stories);

  return (
    <>
      <div className="userStoryBody">
        <div className="heading">
          <div className="ur-header">
            <button className="back-button" onClick={backToHome}>
              <ArrowBackIosNewIcon style={{ color: 'white' }} />
            </button>
            <div className="title-container">
              <h3>User Stories Generator </h3>
            </div>
          </div>
        </div>
        <div className="main-body">
          <div className="ur-left">
            <div className="application-type">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',
                        marginLeft: '1%',
                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title="Ex: Apparel E - commerce store, Food delivery platform, Mobile payment solutions, Personal finance and investment solution, etc.."
                  placement="top"
                  arrow
                >
                  <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
                </Tooltip>
                <FormControl fullWidth className="input-field" error={isApplicationTypeInvalid}>
                  <TextField
                  
                    id="application-type"
                    label="Application Type *"
                    error={isApplicationTypeInvalid}
                    name="applicationType"
                    value={applicationType}
                    onChange={handleChange}
                    // error={!isApplicationTypeValid}
                    // helperText={isApplicationTypeInvalid ? '' : {applicationTypeError}}
                    sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}

                    variant="outlined"
                    fullWidth
                  />
                {isApplicationTypeInvalid && <FormHelperText id="component-error-text">{applicationTypeError}</FormHelperText>}

                </FormControl>
              </Box>
              <FormControl fullWidth>
                <div className="application-chips">
                  <Chip onClick={() => updateApplicationType('E-commerce')} label="E-commerce" className="chip" />
                  <Chip onClick={() => updateApplicationType('Mobile Payment')} label="Mobile Payments" className="chip" />
                  <Chip onClick={() => updateApplicationType('Social Media')} label="Social Media" className="chip" />
                  <Chip onClick={() => updateApplicationType('Food delivery')} label="Food delivery" className="chip" />
                </div>
              </FormControl>
            </div>
            <div className="second-row">
              <div className="seconf-row-items">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: '13px',
                          marginLeft: '1%',
                          bgcolor: '#007bff',
                          '& .MuiTooltip-arrow': {
                            color: 'common.black',
                          },
                        },
                      },
                    }}
                    title="Ex: Product search, User registration, Checkout, etc.."
                    placement="top"
                    arrow
                  >
                    <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
                  </Tooltip>
                  <FormControl fullWidth className="input-field" error={isFeatureForValid}>
                    <TextField
                      id="feature-to-implement"
                      label="Feature to Implement *"
                      // placeholder="Feature to Implement"
                      name="featureToImplement"
                      value={featureToImplement}
                      onChange={handleChange}
                      error={isFeatureInvalid}
                      helperText={isFeatureToImplementValid ? '' : 'Feature to Implement is required'}
                      variant="outlined"
                      fullWidth
                      sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}

                    />
                 {isFeatureInvalid && <FormHelperText id="component-error-text">{featureError}</FormHelperText>}

                  </FormControl>
                </Box>
              </div>
              <div className="seconf-row-items">
                <FormControl
                  className="input-field"
                  fullWidth
                  error={!isFeatureForValid}
                  sx={{
                    '.MuiOutlinedInput-input': { height: '560px' },
                    '.MuiSelect-select': { height: '450px', display: 'flex', alignItems: 'center' },
                  }}
                >
                  <InputLabel id="feature-for-label">Feature For *</InputLabel>
                  <Select
                    labelId="feature-for-label"
                    id="feature-for"
                    value={featureFor}
                    label="Feature For *"
                    name="featureFor"
                    onChange={handleChange}
                    sx={{ height: '50px', '.MuiInputBase-input': { height: '30px' } }}
                    MenuProps={{
                      MenuListProps: {
                        style: {
                          color: 'rgb(97,97,97)', // Change text color
                          fontFamily: 'Roboto, sans-serif', // Change font family
                        },
                      },
                    }}
                  >
                    <MenuItem value="Feature for">{/* <em>Feature for</em> */}</MenuItem>
                    {featureForOptions.map((domain, index) => (
                      <MenuItem key={index} value={domain}>
                        {domain}
                      </MenuItem>
                    ))}
                  </Select>

                  {!isFeatureForValid && <FormHelperText sx={{marginTop:'-2px'}}  id="component-error-text">{"Please select a value"}</FormHelperText>}


                </FormControl>
              </div>
            </div>
            <div className="application-type">
              {isUserRoleRequired && ( // Only render if required
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: '13px',
                            marginLeft: '1%',
                            bgcolor: '#007bff',
                            '& .MuiTooltip-arrow': {
                              color: 'common.black',
                            },
                          },
                        },
                      }}
                      title="Ex: Registered User, Logged In User, Guest User, Administrator, Project Manager, etc.."
                      placement="top"
                      arrow
                    >
                      <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
                    </Tooltip>
                    <FormControl fullWidth className="input-field" error={isUserRoleInvalid}>
                      <TextField
                        id="user-role"
                        label="User Role *"
                        // placeholder="User Role"
                        name="userRole"
                        value={userRole}
                        onChange={handleChange}
                        error={isUserRoleInvalid}
                        helperText={isUserRoleValid ? '' : 'User Role is required'}
                        variant="outlined"
                        fullWidth
                        sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}
                      />
                     {isUserRoleInvalid && <FormHelperText id="component-error-text">{userRoleError}</FormHelperText>}


                    </FormControl>

                  </Box>
                  <FormControl fullWidth>
                    <div className="application-chips">
                      <Chip onClick={() => updateUserRole('Registered User')} label="Registered User" className="chip" />
                      <Chip onClick={() => updateUserRole('Guest User')} label="Guest User" className="chip" />
                      <Chip onClick={() => updateUserRole('Logged In User')} label="Logged In User" className="chip" />
                      <Chip onClick={() => updateUserRole('Administrator')} label="Administrator" className="chip" />
                    </div>
                  </FormControl>
                </>
              )}
            </div>
            <div className="us-button-container">
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      // marginLeft: '1%',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Reset"
                arrow
              >
                <Button
                  variant="contained"
                  // onClick={handleReset}
                  // disabled={!isResetEnabled}
                  style={{ maxWidth: '10px', marginRight: '10px' }}
                  onClick={handleReset}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      // marginLeft: '1%',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Generate user stories"
                arrow
              >
                <Button variant="contained" type="submit" onClick={handleGenerateClick}   disabled={!isGenerateEnabled}        >
                  Generate
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="ur-right">
            {!isResult ? (
              <div className="init">
                Hello there! I'm User Story Generator, your dedicated agent ready to help you transform your application ideas and features
                into technical user-stories.
              </div>
            ) : (
              <></>
            )}

           

            <>
              {isResult && (
                <>
                  <div className="button-copy">

                    <h4>User Stories</h4>

                    <Tooltip
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: '13px',
                            // marginLeft: '1%',
                            bgcolor: '#007bff',
                            '& .MuiTooltip-arrow': {
                              color: 'common.black',
                            },
                          },
                        },
                      }}
                      title="Copy user stories"
                      placement="top"
                      arrow
                    >
                    <Button // Existing Copy Button
                      variant="contained"
                      type="button"
                      onClick={handleCopySelected}
                    // startIcon={<ContentCopyIcon />}
                    >
                      {/* Copy Selected */}
                      <ContentCopyIcon />
                    </Button>
                    </Tooltip>
                  </div>
                  {stories.map((story, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', width: '97%' }}>
                      {' '}
                      <div>


                        <Accordion key={story.title} sx={{ width: '100%', minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.08)', color: 'black', marginBottom: '0px', overflow: 'hidden' }}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`story-content-${index}`}
                            id={`story-header-${index}`}
                            sx={{
                              // ... (other styles)
                              position: 'sticky',
                              top: 0, // Stick to the top
                              zIndex: 101, // Ensure it's above the content
                              minWidth:'100%'
                            }}
                          >
                            <Typography sx={{ width: '93%', flexShrink: 0, zIndex: '100', zIndex: 100, position: 'sticky', backgroundColor: 'rgba(0, 0, 0, 0.0)' }}>{story.title}</Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              maxHeight: 400,
                              zIndex: 1,
                              position: 'relative',
                              overflowY: 'auto',
                              // padding: '16px 24px',
                              marginTop: '-10px',
                           
                            }}
                          >
                            <List sx={{ marginBottom: '5px', zIndex: 1, position: 'relative' }}>
                              {story.content?.map((item, itemIndex) => (
                                <ListItem sx={{
                                  borderBottom: '1px solid blue', marginBottom: '5px', backgroundColor: '#F6F6F6', zIndex: 1, zIndex: -200,
                                  position: 'relative',
                                }} key={item.userStory}>
                                  {' '}
                                  {/* Changed key to item.userStory */}
                                  <ListItemText
                                    primary={item?.userStory || ''} />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </div>
                  ))}

                </>
              ) }
               {isLoading && ( // Show loader during loading
              <div className="loader">
                <Spinner />
              </div>
            )}


            </>


          </div>
        </div>
      </div>
      ;
      <ToastContainer style={{ zIndex: '10000000' }} />

    </>
  );
};

export default UserStories;
