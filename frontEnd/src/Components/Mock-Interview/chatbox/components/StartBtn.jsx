import React, { useState } from 'react';
import './StartBtn.css'; // Import CSS file for styling
import Tooltip from '@mui/material/Tooltip';

export default function StartBtn(props) {
    const [buttonClicked, setButtonClicked] = useState(false);

    const initialAction = () => {
        props.actions.initialAction();
        setButtonClicked(true);
    }

    return (
        <div>
            <Tooltip title="Click here to start interview">
            <button className={`start-btn ${buttonClicked ? 'disabled' : ''}`} onClick={initialAction} disabled={buttonClicked}>
                Click here to Start
            </button>
            </Tooltip>
        </div>
    )
}
