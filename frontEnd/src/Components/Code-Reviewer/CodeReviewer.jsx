// import React, { useState } from 'react';
// import './CodeReviewer.css';
// import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import {TextField} from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import Spinner from '../Spinner';
// import MarkdownPreview from '@uiw/react-markdown-preview';

// import Tooltip from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// const CodeReviewer = () => {

//   const StyledTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ popper: className }} />
//   ))(({ theme }) => ({
//     '& .MuiTooltip-tooltip': {
//       top:'calc(-2vh + 10px)',
//       fontSize: '13px',
//       backgroundColor: '#007bff;',
//       // marginTop:'20px'
//        // Adjust background color as needed
//     },
//   }));

//   const handleMouseDown = () => {
//     // Hide the tooltip when the field is clicked
//     document.querySelector('.MuiTooltip-popper').style.visibility = 'hidden';
//   };

//   const [isAnswerReady, setIsAnswerReady] = useState(false);
//   const [isClick, setIsClick] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState([]);
//   const welcomeText = "Hello, I'm your Code Reviewer, a dedicated agent poised to assist you in evaluating code effectively and efficiently.";
//   const [code, setCode] = useState('');
//   const [description, setDescription] = useState('');
//   const [isFieldsFrozen, setIsFieldsFrozen] = useState(false);
//   const [isResetEnabled, setIsResetEnabled] = useState(false);

//   const descriptionOptions = ['Fix issues of my code', 'Optimize my code','Document my code'];

//   const [codeError, setCodeError] = useState('');
//   const [descriptionError, setDescriptionError] = useState('');

//   const navigate = useNavigate();
//   const backToHome = () =>{
//     navigate("/")
//   }

//   const handleReset = () => {
//     setCode('');
//     setCodeError('');
//     setIsClick(false);
//     setDescription('');
//     setDescriptionError('');
//     setIsFieldsFrozen(false);
//     setIsResetEnabled(false);

//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsClick(true);
//     setIsLoading(true);

//     let valid = true;

//   // Validate programming language
//   if (!code) {
//     setCodeError('Please write code');
//     valid = false;
//   } else {
//     setCodeError('');
//   }
//   if (!description) {
//     setDescriptionError('Please select action');
//     valid = false;
//   } else {
//     setDescriptionError('');
//   }

//   if (!valid) {
//     setIsLoading(false);
//     setIsClick(false);
//     return;
//   }
//     const payload = {
//     code: code,
//     description:description
//      };

//     console.log(payload);
//     try {
//       const response = await fetch(
//         'https://contentcrafter-python-userstory.onrender.com/review_code',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         }
//       );
//       if (!response.ok) throw new Error('Network response was not ok.');

//       const answer = await response.json();
//       console.log(answer.review);
//       // Format array elements for better readability
//       const formattedMessage = answer.review.map((item, index) => {
//       return `${item}`;
//       }).join('\n\n');

//       // Set the formatted message
//       setMessage(formattedMessage);
//       setIsAnswerReady(true);
//     } catch (error) {
//       console.error('There has been a problem with your fetch operation:', error);
//     } finally {
//       setIsLoading(false);
//       // setIsClick(fals);
//     }

//   };

//   return (
//     <div className="code-reviewer-container">
//       <div className="left-portion">
//         <div className="header2">
//           <button className="back-button" onClick={backToHome}>
//             <ArrowBackIosNewIcon style={{ color: 'white' }}/>
//           </button>
//           <div className="title-container">
//             <h3>Code Reviewer</h3>
//           </div>
//         </div>
//         <div className="card" >
//           <form onSubmit={handleSubmit}>
//           <FormControl fullWidth margin="normal">
//               <InputLabel id="discription-simple-select-helper-label">Action<span style={{color:'red'}}>*</span></InputLabel>
//               <StyledTooltip title="Select the Action" arrow>
//               <Select
//                 labelId="discription-simple-select-helper-label"
//                 id="discription-select"
//                 value={description}
//                 label="Description"
//                 disabled={isFieldsFrozen} // Disable field if fields are frozen
//                 onChange={(e) => {
//                   setIsResetEnabled(true)
//                   if (descriptionError.length > 1) {
//                     setDescriptionError('');
//                   }
//                   setDescription(e.target.value);
//                   setIsFieldsFrozen(true);
//                   console.log(description);
//                 }}
//                 error={!!descriptionError}
//                 onMouseDown={handleMouseDown} // Hide tooltip on mouse down

//                 MenuProps={{
//                   MenuListProps: {
//                     style: {
//                       color: 'rgb(97,97,97)', // Change text color
//                       fontFamily: 'Roboto, sans-serif', // Change font family
//                     },
//                   },
//                 }}
//                 >
//                 <MenuItem value=''>
//                       <em>Select Action</em>
//                     </MenuItem>
//                     {descriptionOptions.map((option, idx) => (
//                       <MenuItem key={idx} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//               </Select>
//               </StyledTooltip>
//               <div className="error-message">
//                  {descriptionError && <span>{descriptionError}</span>}
//               </div>
//             </FormControl>
//             <StyledTooltip title="Add your code" arrow>
//           <TextField
//                 error={!!codeError}
//                 fullWidth
//                 name='text'
//                 label={<span>Add your code here<span style={{color:'red'}}>*</span></span>}
//                 multiline
//                 rows={16}
//                 value={code}
//                 inputProps={{
//                   style: { fontFamily: 'Courier New, monospace' } // Set the font family to Courier New
//                 }}
//                 onChange={(e) => {
//                   setIsResetEnabled(true)
//                   if (codeError.length > 1) {
//                     setCodeError('');
//                   }
//                   setCode(e.target.value);
//                 }}
//               />
//               </StyledTooltip>
//               <div className='error-message'>
//                 {codeError && <span>{codeError}</span>}
//               </div>

//             <div className="button-container">
//             <StyledTooltip title="Reset" arrow>
//               <Button variant="contained" onClick={handleReset} disabled={!isResetEnabled} style={{ maxWidth: '10px', marginRight: '10px' }}>
//                 <RefreshIcon/>
//               </Button>
//               </StyledTooltip>
//               <StyledTooltip title="Get The Review" arrow>
//               <Button variant="contained" type="submit">
//                 Start
//               </Button>
//               </StyledTooltip>
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="right-portion">
//        {/* <div className='response'>
//         Response
//        </div> */}

//        <div>
//           {!isClick ? <div className='response'>
//         <div className='welcome'>{welcomeText}
//              </div>
//         </div> : <>
//             {isLoading ? <div className='response'><Spinner /></div> :
//               <div className="response" style={{ width: '920px' }}>
//                 <MarkdownPreview className='response-content' source={message} />
//               </div>}
//           </>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeReviewer;
