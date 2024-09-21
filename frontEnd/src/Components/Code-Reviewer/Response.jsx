import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  Paper,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import MergeIcon from '@mui/icons-material/Merge';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Chatbot from './Chatbot';

const getColorByCriticality = (level) => {
  if (level > 3) return '#FF6347'; // Red
  if (level === 2 || level === 3) return '#FFD700'; // Yellow
  return '#32CD32'; // Green
};

const IssueList = ({ issues, title }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Paper style={{ marginBottom: '10px' }}>
      <ListItem
        button
        onClick={handleClick}
        style={{ backgroundColor: '#A052B0', color: 'white' }}
      >
        <ListItemText primary={`${title} (${issues.length})`} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {issues.map((issue, index) => (
            <ListItem
              key={index}
              style={{
                paddingLeft: '20px',
                backgroundColor: getColorByCriticality(issue.criticalityLevel),
              }}
            >
              <ListItemText
                primary={issue.issueType}
                secondary={
                  <>
                    <Typography
                      component='span'
                      variant='body2'
                      color='textPrimary'
                    >
                      {`Criticality: ${issue.criticalityLevel}`}
                    </Typography>
                    {` — ${issue.description}`}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

const calculateIssueCounts = (reviewData) => {
  const counts = { critical: 0, moderate: 0, normal: 0 };

  const allIssues = [
    ...(reviewData.codeIssues || []),
    ...(reviewData.performanceOptimizationIssues || []),
    ...(reviewData.securityVulnerabilityIssues || []),
    ...(reviewData.scalabilityIssues || []),
    ...(reviewData.engineeringPracticesIssues || []),
  ];

  allIssues.forEach((issue) => {
    if (issue.criticalityLevel > 3) counts.critical += 1;
    else if (issue.criticalityLevel === 2 || issue.criticalityLevel === 3)
      counts.moderate += 1;
    else counts.normal += 1;
  });

  return counts;
};

const IssueSummary = ({ counts }) => (
  <Box
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    padding='10px'
    bgcolor='#1e1e1e'
  >
    <Box>
      <Typography
        variant='h6'
        style={{ color: '#FF6347' }}
      >{`${counts.critical} Critical issues`}</Typography>
      <Typography
        variant='h6'
        style={{ color: '#FFD700' }}
      >{`${counts.moderate} Moderate issues`}</Typography>
      <Typography
        variant='h6'
        style={{ color: '#32CD32' }}
      >{`${counts.normal} Normal issues`}</Typography>
    </Box>
    <ResponsiveContainer width='50%' height={100}>
      <BarChart
        data={[
          { name: 'Critical', value: counts.critical, fill: '#FF6347' },
          { name: 'Moderate', value: counts.moderate, fill: '#FFD700' },
          { name: 'Normal', value: counts.normal, fill: '#32CD32' },
        ]}
      >
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='value' />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

function Response({
  code,
  setCode,
  fixedCode,
  enhancedCode,
  errorDescription,
  errorMessage,
}) {
  const [tabIndex, setTabIndex] = useState(0); // Default to the first tab (Review Result)
  const [showMergeIcon, setShowMergeIcon] = useState(false);
  const [issueCounts, setIssueCounts] = useState({
    critical: 0,
    moderate: 0,
    normal: 0,
  });
  const [reviewData, setReviewData] = useState(null);
  const [showIssueSummary, setShowIssueSummary] = useState(false); // New state to control visibility
  const [isCardOpen, setIsCardOpen] = useState(false); // State to manage card visibility

  useEffect(() => {
    try {
      const parsedData = JSON.parse(errorDescription);
      setReviewData(parsedData);
      setIssueCounts(calculateIssueCounts(parsedData));
      setShowIssueSummary(true); // Show IssueSummary when response data is available
    } catch (e) {
      console.error('Error parsing JSON:', e);
      setReviewData(null);
      setShowIssueSummary(false); // Hide IssueSummary if there's an error
    }
  }, [errorDescription]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue === 1) {
      setShowMergeIcon(true);
    } else {
      setShowMergeIcon(false);
    }
  };

  const handleMerge = () => {
    if (tabIndex === 1) {
      setCode(fixedCode);
    }
  };

  const handleCardClose = () => {
    setIsCardOpen(false);
  };

  const handleBotClick = () => {
    setIsCardOpen(true);
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        height: '99%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor='inherit'
          className='custom-tabs'
        >
          <Tab label='Review Result' className='custom-tab' />
          <Tab label='Fixed code' className='custom-tab' />
        </Tabs>
        {showMergeIcon && (
          <IconButton onClick={handleMerge} style={{ color: 'white' }}>
            {/* <MergeIcon /> */}
          </IconButton>
        )}
      </div>
      <Box style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {tabIndex === 0 && (
          <>
            {errorMessage ? (
              <Typography variant='body1' style={{ color: 'red' }}>
                {errorMessage}
              </Typography>
            ) : reviewData ? (
              <List>
                <IssueList
                  issues={reviewData.codeIssues || []}
                  title='Code Issues'
                />
                <IssueList
                  issues={reviewData.performanceOptimizationIssues || []}
                  title='Performance/Optimization Issues'
                />
                <IssueList
                  issues={reviewData.securityVulnerabilityIssues || []}
                  title='Security Vulnerabilities'
                />
                <IssueList
                  issues={reviewData.scalabilityIssues || []}
                  title='Scalability Concerns'
                />
                <IssueList
                  issues={reviewData.engineeringPracticesIssues || []}
                  title='Engineering Practices'
                />
              </List>
            ) : (
              <Typography variant='body1' style={{ color: 'gray' }}>
                Your response will appear here...
              </Typography>
            )}
          </>
        )}
        {tabIndex === 1 && (
          <CodeMirror
            value={fixedCode}
            options={{
              mode: 'javascript',
              theme: 'dracula',
              lineNumbers: true,
              lineWrapping: true, // Enable line wrapping
            }}
          />
        )}
      </Box>
      {showIssueSummary && <IssueSummary counts={issueCounts} />}{' '}
      {/* Show IssueSummary only if showIssueSummary is true */}
      <Chatbot onClose={handleCardClose} />
    </div>
  );
}

export default Response;
