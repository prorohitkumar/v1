import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Choice.css';

const Choice = () => {
  const navigate = useNavigate();

  return (
    <div className='choice-main-container'>
      <div className='cards-and-image'>
        <div className='cards-container'>
          <div className='choice-card' onClick={() => navigate('/review-code')}>
            <div className='choice-card-inner'>
              <div className='choice-card-front'>
                <h2>Review Code</h2>
              </div>
              <div className='choice-card-back'>
                <p>Review and enhance your code with ease.</p>
              </div>
            </div>
          </div>
          <div
            className='choice-card'
            // onClick={() => navigate('/review-project')}
          >
            <div className='choice-card-inner'>
              <div className='choice-card-front'>
                <h2>Review Project</h2>
              </div>
              <div className='choice-card-back'>
                <p>
                  Get a comprehensive review of your entire project. <br />{' '}
                  (Coming Soon)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='image-container'>
          <img src='/images/choice.jpg' alt='Choice' />
        </div>
      </div>
    </div>
  );
};

export default Choice;
