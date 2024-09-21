import React, { useState, useEffect, useRef } from 'react';
import './RolePlay.css';
import jsondata from '../Data.json';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chips from './Chips';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '@mui/material/Button';
import Spinner from '../Spinner';
import MarkdownPreview from '@uiw/react-markdown-preview';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import FormHelperText from '@mui/material/FormHelperText';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const RolePlay = () => {
  const navigate = useNavigate();
  const responseContainerRef = useRef(null);

  const renderLabelWithIcon = (labelText, tooltipText) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {labelText}
      <StyledTooltip title={tooltipText}>
        <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
      </StyledTooltip>
    </Box>
  );

  const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: 'calc(-2vh + 10px)',
      fontSize: '13px',
      backgroundColor: '#007BFF;',
    },
  }));

  const domainOptions = jsondata['Domain'].map(obj => obj.name);
  const [domain, setDomain] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [complexity, setComplexity] = useState('');
  const [experience, setExperience] = useState('');

  const [industryContext, setIndustryContext] = useState('');
  const [scenarioSettings, setScenarioSettings] = useState('');
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [result, setResult] = useState('');

  const [isRedirect, setIsRedirect] = useState(false);
  const [isAnsReady, setIsAnsReady] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation state variables
  const [domainError, setDomainError] = useState('');
  const [isDomainValid, setIsDomainValid] = useState(true);
  const [learningObjectiveError, setLearningObjectiveError] = useState('');
  const [isLearningObjectiveValid, setIsLearningObjectValid] = useState(true);
  const [rolesError, setRolesError] = useState('');
  const [isRolesValid, setIsRolesValid] = useState(true);
  const [skillsError, setSkillsError] = useState('');
  const [isSkillsValid, setIsSkillsValid] = useState(true);
  const [isOtherValid, setIsOtherValid] = useState(true);
  const [otherError, setOtherError] = useState('');

  // Touched state variables
  const [touched, setTouched] = useState({
    domain: false,
    otherIndustry: false,
    learningObjective: false,
    roles: false,
    skills: false,
  });

  const validateDomain = value => {
    if (!value.trim()) {
      setDomainError('Please select industry');
      setIsDomainValid(false);
      return false;
    }
    setDomainError('');
    setIsDomainValid(true);
    return true;
  };

  const validateOther = value => {
    if (!value.trim()) {
      setOtherError('Please add other industry');
      setIsOtherValid(false);
      return false;
    }
    if (/^\d/.test(value.trim()) || value.trim().length < 2) {
      setOtherError('Please add a valid industry');
      setIsOtherValid(false);
      return false;
    }
    setOtherError('');
    setIsOtherValid(true);
    return true;
  };

  const validateLearningObjective = value => {
    if (!value.trim()) {
      setLearningObjectiveError('Please add learning objective');
      setIsLearningObjectValid(false);
      return false;
    }
    if (/^\d/.test(value.trim()) || value.trim().length < 2) {
      setLearningObjectiveError('Please add a valid learning objective');
      setIsLearningObjectValid(false);
      return false;
    }
    setLearningObjectiveError('');
    setIsLearningObjectValid(true);
    return true;
  };

  const validateRoles = roles => {
    if (roles.length === 0) {
      setRolesError('Please add at least 1 role');
      setIsRolesValid(false);
      return false;
    }
    setRolesError('');
    setIsRolesValid(true);
    return true;
  };

  const validateSkills = skills => {
    if (skills.length === 0) {
      setSkillsError('Please add at least 1 skill');
      setIsSkillsValid(false);
      return false;
    }
    setSkillsError('');
    setIsSkillsValid(true);
    return true;
  };

  const updateFormValidity = () => {
    const isValidDomain = validateDomain(domain);
    const isValidLearningObjective = validateLearningObjective(learningObjective);
    const isValidRoles = validateRoles(roles);
    const isValidSkills = validateSkills(skills);
    const isValidOther = !isOther || validateOther(otherIndustry);

    setIsFormValid(isValidDomain && isValidLearningObjective && isValidRoles && isValidSkills && isValidOther);
  };

  useEffect(() => {
    updateFormValidity();
  }, [domain, otherIndustry, learningObjective, roles, skills, isOther]);

  useEffect(() => {
    if (isAnsReady) {
      responseContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isAnsReady]);

  const handleDomainChange = event => {
    const selectedDomainName = event.target.value;
    setTouched({ ...touched, domain: true });
    if (selectedDomainName === 'Others') {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
    setDomain(selectedDomainName);
    validateDomain(selectedDomainName);
  };

  const handleOtherIndustryChange = event => {
    const value = event.target.value;
    setTouched({ ...touched, otherIndustry: true });
    setOtherIndustry(value);
    validateOther(value);
  };

  const handleLearningObjectiveChange = event => {
    const value = event.target.value;
    setTouched({ ...touched, learningObjective: true });
    setLearningObjective(value);
    validateLearningObjective(value);
  };

  const handleRolesChange = newRoles => {
    setTouched({ ...touched, roles: true });
    setRoles(newRoles);
    validateRoles(newRoles);
  };

  const handleSkillsChange = newSkills => {
    setTouched({ ...touched, skills: true });
    setSkills(newSkills);
    validateSkills(newSkills);
  };

  const handleIndustryContextChange = event => {
    setIndustryContext(event.target.value);
  };

  const handleScenarioSettingsChange = event => {
    setScenarioSettings(event.target.value);
  };

  const handleComplexityChange = event => {
    setComplexity(event.target.value);
  };

  const handleExperienceChange = event => {
    setExperience(event.target.value);
  };

  const handleSubmit = async () => {

    const industry = isOther ? otherIndustry : domain;

    const formData = {
      industry,
      learningObjective,
      complexity,
      experience,
      industryContext,
      scenarioSettings,
      roles,
      skills,
    };

    try {
      setIsRedirect(true);
      setIsAnsReady(false);
      const response = await fetch('https://localhost:8000/role_play_creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setIsRedirect(false);
      setIsAnsReady(true);

      if (!response.ok) {
        toast.error('Oh no, something went wrong!');
        setIsRedirect(false);
        setIsAnsReady(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setResult(result[0]);
    } catch (error) {
      toast.error('Oh no, something went wrong!');
      setIsRedirect(false);
      setIsAnsReady(false);
    }
  };

  const handleReset = () => {
    setDomain('');
    setLearningObjective('');
    setComplexity('');
    setExperience('');
    setIndustryContext('');
    setScenarioSettings('');
    setRoles([]);
    setSkills([]);
    setResult('');
    setIsDomainValid(true);
    setDomainError('');
    setIsLearningObjectValid(true);
    setLearningObjectiveError('');
    setIsRolesValid(true);
    setRolesError('');
    setIsSkillsValid(true);
    setSkillsError('');
    setIsRedirect(false);
    setIsAnsReady(false);
    setIsOther(false);
    setOtherIndustry('');
    setTouched({
      domain: false,
      otherIndustry: false,
      learningObjective: false,
      roles: false,
      skills: false,
    });
  };

  const backToHome = () => {
    navigate('/home');
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        'https://localhost:8000/download-docx',
        {
          markdown_content: result,
        },
        { responseType: 'blob' },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'role_play_exercise.docx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error('Oh no, something went wrong!');
    }
  };

  return (
    <div className="RolePlayBody">
      <div className="heading">
        <div className="headerr">
          <button className="back-button" onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
          <div className="title-container">
            <h3>Role Play Generator </h3>
          </div>
        </div>
      </div>
      <div className="inputArea">
        <div className="input1">
          <div className="rolePlay-domain">
            <FormControl
              fullWidth
              sx={{
                '.MuiOutlinedInput-input': { height: '560px' },
                '.MuiSelect-select': { height: '450px', display: 'flex', alignItems: 'center' },
              }}
              error={!isDomainValid && touched.domain}
            >
              <InputLabel id="pl">
                Select industry <span style={{ color: '' }}>*</span>
              </InputLabel>

              <Select
                required
                fullWidth
                name="domain"
                label="Select industry *"
                value={domain}
                onChange={handleDomainChange}
                sx={{ height: '50px', '.MuiOutlinedInput-input': { height: '30px' } }}
                MenuProps={{
                  MenuListProps: {
                    style: {
                      color: 'rgb(97,97,97)',
                      fontFamily: 'Roboto, sans-serif',
                    },
                  },
                }}
              >
                <MenuItem value="Select Domain">
                  <em>Select industry</em>
                </MenuItem>
                {domainOptions.map((domain, index) => (
                  <MenuItem key={index} value={domain}>
                    {domain}
                  </MenuItem>
                ))}
              </Select>
              {!isDomainValid && touched.domain && (
                <FormHelperText id="component-error-text" sx={{ marginTop: '1px', fontSize: 'md', textDecoration: 'bold' }}>
                  {domainError}
                </FormHelperText>
              )}
            </FormControl>
            {isOther && (
              <FormControl style={{ marginLeft: '10px' }} fullWidth error={!isOtherValid && touched.otherIndustry}>
                <TextField
                  error={!isOtherValid && touched.otherIndustry}
                  fullWidth
                  id="outlined-basic"
                  className="textinput"
                  type="text"
                  name="otherIndustry"
                  placeholder="Enter other industry"
                  label={
                    <>
                      Add other industry <span style={{ color: '' }}>*</span>
                    </>
                  }
                  value={otherIndustry}
                  onChange={handleOtherIndustryChange}
                  sx={{ height: '50px', '.MuiInputBase-input': { width: '100%', height: '30px' } }}
                />
                {!isOtherValid && touched.otherIndustry && (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '2px', fontSize: 'md', textDecoration: 'bold' }}>
                    {otherError}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </div>

          <div className="input1">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledTooltip
                title="Ex: identifying and managing risks in IT projects, integrating ethical considerations in AI development, developing and implementing a cloud migration strategy, optimizing the Agile software development process, managing a cybersecurity incident effectively"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth error={!isLearningObjectiveValid && touched.learningObjective}>
                <TextField
                  error={!isLearningObjectiveValid && touched.learningObjective}
                  labelId="pl"
                  fullWidth
                  id="outlined-basic"
                  className="textinput"
                  type="text"
                  name="learningObjective"
                  placeholder="Add learning objective"
                  label={
                    <>
                      Add learning objective <span style={{ color: '' }}>*</span>
                    </>
                  }
                  value={learningObjective}
                  onChange={handleLearningObjectiveChange}
                  sx={{ height: '50px', '.MuiInputBase-input': { width: '100%', height: '30px' } }}
                />
                {!isLearningObjectiveValid && touched.learningObjective && (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '2px', fontSize: 'md', textDecoration: 'bold' }}>
                    {learningObjectiveError}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </div>

          <div className="input1">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} error={isRolesValid}>
              <StyledTooltip
                title="Specific roles to be played in this exercise, Ex: Tech Lead, Security Analyst, Full Stack Developer, Devops Engineer"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <Chips
                  placeHolder={'Add roles to be played in this exercise '}
                  initialTags={roles}
                  suggestions={[]}
                  isRestClicked={resetKey}
                  onTagsChange={handleRolesChange}
                />
                {!isRolesValid && touched.roles && (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '1px', color: 'red', fontSize: 'md', textDecoration: 'bold' }}>
                    {rolesError}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </div>

          <div className="input1">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} error={isSkillsValid}>
              <StyledTooltip
                title="Skills that participants should gain post completing this exercise, Ex: incident response,backlog prioritization, UI responsiveness"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <Chips
                  placeHolder={'Add skills to gain post completing this exercise '}
                  initialTags={skills}
                  suggestions={[]}
                  isRestClicked={resetKey}
                  onTagsChange={handleSkillsChange}
                />
                {!isSkillsValid && touched.skills && (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '1px', color: 'red', fontSize: 'md', textDecoration: 'bold' }}>
                    {skillsError}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          </div>

          <div className="inputt">
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 0 }}>
              <FormControl
                fullWidth
                sx={{
                  '.MuiOutlinedInput-input': { height: '30px' },
                  '.MuiSelect-select': { height: '45px', display: 'flex', alignItems: 'center' },
                }}
              >
                <InputLabel id="complexity-select-label">Complexity</InputLabel>
                <Select
                  labelId="complexity-select-label"
                  id="complexity-select"
                  value={complexity}
                  label="Complexity"
                  sx={{ height: '50px', '.MuiOutlinedInput-input': { height: '35px' } }}
                  MenuProps={{
                    MenuListProps: {
                      style: {
                        color: 'rgb(97,97,97)',
                        fontFamily: 'Roboto, sans-serif',
                      },
                    },
                  }}
                  onChange={handleComplexityChange}
                >
                  <MenuItem value="">Select Complexity</MenuItem>
                  <MenuItem value="Easy">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">High</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="experience-select-label">Participants years of experience</InputLabel>
                <Select
                  labelId="experience-select-label"
                  id="experience-select"
                  value={experience}
                  label="Participants years of experience"
                  sx={{ height: '50px', '.MuiOutlinedInput-input': { height: '25px' } }}
                  MenuProps={{
                    MenuListProps: {
                      style: {
                        color: 'rgb(97,97,97)',
                        fontFamily: 'Roboto, sans-serif',
                      },
                    },
                  }}
                  onChange={handleExperienceChange}
                >
                  <MenuItem value="0-3">0-3 </MenuItem>
                  <MenuItem value="3-5">3-5 </MenuItem>
                  <MenuItem value="5-10">5-10 </MenuItem>
                  <MenuItem value="10-15">10-15 </MenuItem>
                  <MenuItem value="15+">15+ </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="role-input">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledTooltip
                title="Ex: A company developing AI-driven products, an IT project facing multiple potential risks, an organization migrating to cloud "
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Add industry context"
                  margin="normal"
                  value={industryContext}
                  onChange={handleIndustryContextChange}
                  sx={{ height: '50px', '.MuiInputBase-input': { width: '100%', height: '30px' } }}
                />
              </FormControl>
            </Box>
          </div>
          <div className="role-input">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledTooltip
                title="Specific time, location, and circumstances within which the role-playing exercise unfolds, Ex: project risk assessment meeting, Sprint planning meet, design walkthrough meet, data modelling meet, design phase of a new AI feature"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Add scenario settings"
                  margin="normal"
                  value={scenarioSettings}
                  onChange={handleScenarioSettingsChange}
                  sx={{ height: '50px', '.MuiInputBase-input': { width: '100%', height: '30px' } }}
                />
              </FormControl>
            </Box>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <StyledTooltip title="Reset" arrow>
            <Button variant="contained" onClick={handleReset} style={{ maxWidth: '10px', marginRight: '10px' }}>
              <RefreshIcon />
            </Button>
          </StyledTooltip>
          <StyledTooltip title="Click to generate role play activity" arrow>
            <Button type="button" variant="contained" color="primary" onClick={handleSubmit}>
              Generate
            </Button>
          </StyledTooltip>
          {isAnsReady && (
            <StyledTooltip title="Download the response" arrow>
              <Button
                type="button"
                className="download-btn"
                onClick={handleDownload}
                style={{ backgroundColor: 'green', color: 'white', marginLeft: '4px' }}
              >
                <DownloadIcon />
              </Button>
            </StyledTooltip>
          )}
        </div>
      </div>
      {isRedirect & !isAnsReady ? (
        <div className="loading-dots">
          <Spinner />
        </div>
      ) : (
        isAnsReady && (
          <div className="role-output" ref={responseContainerRef}>
            <div className="response-containerr">
              <MarkdownPreview source={result} />
            </div>
          </div>
        )
      )}
      <ToastContainer />
    </div>
  );
};

export default RolePlay;
