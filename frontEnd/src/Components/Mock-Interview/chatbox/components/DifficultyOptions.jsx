import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const DifficultyOptions = ({ actions }) => {
  const handleDifficultySelection = (difficulty_level) => {
    
    actions.finalResult(difficulty_level); // Pass selected difficulty level
  };

  return (
    <div>
      <Tooltip title="Click here to select Basic level">
      <button className='start-btn' onClick={() => handleDifficultySelection("Basic")}>Basic 🌱</button>
      </Tooltip>
      <Tooltip title="Click here to select Intermediate level">
      <button className='start-btn' onClick={() => handleDifficultySelection("Intermediate")}>Intermediate 🌳</button>
      </Tooltip>
      <Tooltip title="Click here to select Advance level">
      <button className='start-btn' onClick={() => handleDifficultySelection("Advance")}>Advance 🌲</button>
      </Tooltip>
      <Tooltip title="Click here to select Mix of all">
      <button className='start-btn' onClick={() => handleDifficultySelection("Mix of all")}>Mix of all 🎨</button>
      </Tooltip>
    </div>
  );
};

export default DifficultyOptions;
