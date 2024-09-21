import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import './ReviewProject.css';

const ReviewProject = () => {
  const [projectName, setProjectName] = useState('');

  const handleOpenProject = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setProjectName(handle.name);
    } catch (error) {
      console.error('Error opening project:', error);
    }
  };

  return (
    <div className='review-project-container'>
      <Card className='card-rp'>
        <CardContent>
          <TextField
            variant='outlined'
            placeholder='Enter project URL'
            fullWidth
            className='input-field'
          />
          <Typography variant='h6' className='or-text'>
            OR
          </Typography>
          <Button
            variant='contained'
            color='primary'
            className='open-project-button'
            onClick={handleOpenProject}
          >
            Open Project
          </Button>
          {projectName && (
            <>
              <Typography variant='h6' className='project-name'>
                Selected Project: {projectName}
              </Typography>
              <Button
                variant='contained'
                color='secondary'
                className='review-project-button'
              >
                Review Project
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewProject;
