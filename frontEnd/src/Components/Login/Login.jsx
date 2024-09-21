import React from 'react';
import './Login.css'; // Import your CSS file

const Login = () => {
  const initiateOAuth = () => {
    // window.location.href = 'http://localhost:8000/crafter/api/v2/auth/login';
    //   window.location.href = '/api/v1/auth/login';
    window.location.href =
      'https://content-crafter-dev.stackroute.in/crafter/api/v2/auth/login';
  };

  return (
    <div className='loginbackground'>
      <div className='image'>
        <img className='bit' src='/images/bit.png' alt='StackRoute Logo' />
      </div>
      <div className='buttonArea'>
        <img className='logo1' src='/images/srlogo.png' alt='StackRoute Logo' />
        <button className='button-64' onClick={initiateOAuth}>
          <span className='text'>
            <img src='/images/gitlab.png' alt='gitlab_logo' className='logoo' />
            Authorize with GitLab
          </span>
        </button>
      </div>
      {/* <div className='logo1-container'>
            <img className='logo1' src="/images/srlogo.png" alt="StackRoute Logo" />
        </div>
        <div>
            <button className="button-64" onClick={initiateOAuth}><span className="text"><img src="/images/gitlab_logo.png" alt="gitlab_logo" Name="logoo" />Authorize with GitLab</span></button>
        </div>
        <div>
            <img className='bit' src="/images/bit.png" alt="StackRoute Logo"/>
        </div> */}
    </div>
  );
};

export default Login;
