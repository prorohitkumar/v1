import React, { useState, useEffect } from 'react';
import { Chip, TextField, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)({
  display: 'flex',
  gap: '5px',
  alignItems: 'center',
});

function ChipInput({
  initialChips = [],
  onChange,
  errorState,
  placeholder = "Type here and press ',' or 'Enter' to add a chip",
  label = 'Chips',
}) {
  const [chips, setChips] = useState(initialChips);
  const [inputValue, setInputValue] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [showError, setShowError] = useState(false); // State to track if error should be shown

  useEffect(() => {
    if ((chips.length > 0 || isDelete) && showError) {
      setShowError(false); // Reset error state when chips are added or deleted
    }
    onChange(chips);
  }, [chips, isDelete, onChange, showError]);

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault(); // Prevent form submission if it's in a form
      const value = inputValue.trim();
      if (value && !chips.includes(value)) {
        setChips([...chips, value]);
        setInputValue('');
      }
      setShowError(false)
    } else {
      setShowError(true); // Show error if user types without adding a chip
    }
  };

  const handleDeleteChip = chipToDelete => {
    setIsDelete(true);
    setChips(chips.filter(chip => chip !== chipToDelete));
    onChange(chips);
  };

  const inputProps =
    chips.length > 0 || inputValue
      ? {
          startAdornment: (
            <StyledBox>
              {chips.map(chip => (
                <Chip
                  sx={{
                    marginTop: '8px',
                    height: '25px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white',
                    },
                  }}
                  key={chip}
                  label={chip}
                  onDelete={() => handleDeleteChip(chip)}
                />
              ))}
            </StyledBox>
          ),
        }
      : {};

  return (
    <>
      
      <TextField
        fullWidth
        placeholder={placeholder}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        InputProps={inputProps}
        error={errorState}
        sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}
      />
      {showError && <div style={{ color: 'red' }}>Please press ',' or 'Enter' to add the chip</div>}
    </>
  );
}

export default ChipInput;
