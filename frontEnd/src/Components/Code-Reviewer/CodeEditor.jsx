import React, { useState, useEffect } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Button, Typography } from '@mui/material';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import Loading from './Loading'; // Import the Loading component
import styles from '../Styles.css'; // Adjust the import path as necessary

function CodeEditor({
  file,
  onSave,
  setCode,
  setFixedCode,
  setEnhancedCode,
  setErrorDescription,
  setErrorMessage,
}) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (file) {
      file.handle
        .getFile()
        .then((f) => f.text())
        .then(setContent);
    } else {
      setContent(''); // Clear content when file is null
    }
  }, [file]);

  const handleSave = async () => {
    const writable = await file.handle.createWritable();
    await writable.write(content);
    await writable.close();
    onSave(file, content);
  };

  useEffect(() => {
    setCode(content);
  }, [content, setCode]);

  const isValidCode = (code) => {
    // Check if the content is not empty and does not resemble simple English text
    if (code.trim() === '') return false;

    const validFileExtensions = [
      '.xml',
      '.yaml',
      '.yml',
      '.json',
      'dockerfile',
      '.sql',
      '.sh',
      '.mk',
      '.gitignore',
      '.pom',
    ];
    const fileName = file ? file.name.toLowerCase() : '';
    if (validFileExtensions.some((ext) => fileName.endsWith(ext))) {
      return true;
    }

    // Further check to validate non-empty content that is not simple English text
    const simpleEnglishTextRegex = /^[a-zA-Z0-9\s,.'"-]*$/;
    return (
      !simpleEnglishTextRegex.test(code) ||
      code.includes(';') ||
      code.includes('{') ||
      code.includes('}')
    );
  };

  const handleReview = async () => {
    if (!isValidCode(content)) {
      setErrorMessage(
        'Unfortunately, you have not provided any code for me to review. Please provide the code so that I can conduct the analysis and return the observations in the requested JSON format.',
      );
      return;
    }

    setErrorMessage('');
    setLoading(true); // Start loading
    let reviewResponse;
    try {
      reviewResponse = await fetch(
        // 'https://code-reviewr-backend-python.onrender.com/review_code',
        'https://content-crafter-dev.stackroute.in/crafter/api/v2/code_reviewer/review_code',
        // 'http://localhost:8000/crafter/api/v2/code_reviewer/review_code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: content }),
        },
      );

      if (!reviewResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await reviewResponse.json();
      const { review } = responseData;

      if (review.error) {
        console.error('Error:', review.error);
        setErrorDescription(
          JSON.stringify(
            {
              error: review.error,
              raw_response: responseData,
            },
            null,
            2,
          ),
        );
      } else {
        setFixedCode(
          review.refactoredCode || '// No refactored code provided.',
        );
        setErrorDescription(
          JSON.stringify(
            {
              codeIssues: review.codeIssues,
              engineeringPracticesIssues: review.engineeringPracticesIssues,
              performanceOptimizationIssues:
                review.performanceOptimizationIssues,
              scalabilityIssues: review.scalabilityIssues,
              securityVulnerabilityIssues: review.securityVulnerabilityIssues,
            },
            null,
            2,
          ),
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorDescription(
        JSON.stringify(
          {
            error: 'Error decoding JSON response',
            raw_response: reviewResponse
              ? await reviewResponse.text()
              : 'No response',
          },
          null,
          2,
        ),
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        height: '99%',
        position: 'relative',
      }}
    >
      {loading && <Loading />} {/* Show spinner if loading */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <Typography variant='h6' style={{ color: 'white' }}>
          {file ? file.name : 'No file selected'}
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSave}
          style={{ height: '46px' }}
        >
          Save
        </Button>
      </div>
      <div style={{ height: 'calc(100vh - 250px)', position: 'relative' }}>
        <CodeMirror
          key={file ? file.name : 'editor'}
          value={content}
          options={{
            mode: 'javascript',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true, // Enable line wrapping
          }}
          onChange={(editor, data, value) => {
            setContent(value);
          }}
        />
      </div>
      <Button
        variant='contained'
        color='secondary'
        onClick={handleReview}
        style={{ height: '50px', marginTop: '10px', marginLeft: '80%' }}
      >
        Review Code
      </Button>
    </div>
  );
}

export default CodeEditor;
