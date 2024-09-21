import React, { useEffect } from 'react';
import './Error.css';

function Error() {
  useEffect(() => {
    const handleMouseMove = (event) => {
      const eyes = document.querySelectorAll('.eye');
      eyes.forEach((eye) => {
        const rect = eye.getBoundingClientRect();
        const x = rect.left + eye.clientWidth / 2;
        const y = rect.top + eye.clientHeight / 2;
        const rad = Math.atan2(event.clientX - x, event.clientY - y);
        const rot = rad * (180 / Math.PI) * -1 + 180;
        eye.style.transform = `rotate(${rot}deg)`;
      });
    };

    document.body.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='error-container'>
      <span className='error-num'>5</span>
      <div className='eye'></div>
      <div className='eye'></div>
      <p className='sub-text'>
        Oh eyeballs! Something went wrong. We're <i>looking</i> to see what
        happened.
      </p>
      <a href='/'>Go back</a>
    </div>
  );
}

export default Error;
