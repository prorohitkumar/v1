import React, { useState, useEffect } from 'react';
import { Chip, TextField, Box, FormHelperText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormControl } from 'react-bootstrap';
import './ChipInout.css';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state to track typing

  useEffect(() => {
    if (chips.length > 0 || isDelete) {
      onChange(chips);
    }
  }, [chips, onChange]);

  const handleInputChange = event => {
    setInputValue(event.target.value);

    setErrorMessage(''); // Clear the error message when user types
    if (!isTyping) setIsTyping(true); // Set typing state to true
    if (event.target.value == '') {
      setIsTyping(false);
    }
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault(); // Prevent form submission if it's in a form
      const value = inputValue.trim();

      if (!value) {
        return;
      }

      if (/^[^a-zA-Z]/.test(value)) {
        setErrorMessage('Chip cannot start with a number or special character.');
        return;
      }

      if (value == '') {
        setIsTyping(false);
      }

      if (!chips.includes(value)) {
        setChips([...chips, value]);
        setIsTyping(false);
        setInputValue('');
      }
    }
  };

  const handleDeleteChip = chipToDelete => {
    setIsDelete(true);
    setChips(chips.filter(chip => chip !== chipToDelete));
  };

  // Define a custom class
  const CustomHelperText = styled(FormHelperText)(({ theme }) => ({
    root: {
      margin: 4,
      '&$error': {
        color: 'white',
      },
    },
    error: {},
  }));

  <CustomHelperText className="custom-helper-text" error={true}>
    {errorMessage}
  </CustomHelperText>;

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
    <Box>
      <TextField
        fullWidth
        placeholder={placeholder}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        InputProps={inputProps}
        error={errorState || errorMessage}
        sx={{ height: '44px', '.MuiInputBase-input': { height: '30px' } }}
        FormHelperTextProps={{ sx: { color: 'blue' } }}
      />
      {(errorState || !!errorMessage) && <FormHelperText sx={{ color: 'red' }}>{errorMessage}</FormHelperText>}
      {isTyping && !errorState && (
        <Box sx={{ display: 'inline-block' }}>
          <Typography variant="caption" color="red" sx={{ marginTop: '-8px', display: 'block' }}>
            Press enter or comma(,) to add
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ChipInput;
