import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './SideNav.css'; // Import the CSS file

const SideNav = () => {
  const [isNavOpen, setIsNavOpen] = useState(false); // Initialize to false so nav is closed by default
  const navRef = useRef(); // Ref for the nav to detect clicks inside it
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle the state
  };

  const openFeedback = () => {
    console.log('Opening feedback link');
    // URL to be opened in a new tab
    const url =
      'https://docs.google.com/forms/d/1SRhkUmtsl_agb9QzW204w2gkbmvrUybnuAoK9gKwUJA/edit?usp=drive_link';

    // Open the link in a new tab
    window.open(url, '_blank');
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    checkToken();
    navigate('/login');
  }

  const checkToken = () => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);
  }

  // Effect to add event listener for clicks outside the nav
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false); // Close the nav if click is outside
      }
    }

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);

    checkToken();

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this runs on mount and unmount only

  return (
    <div className="main-nav">
      <div className='nav-left'>
        <div
          className={`overlay ${isNavOpen ? 'open' : ''}`}
          onClick={toggleNav} // Close the nav when the overlay is clicked
        ></div>

        <div ref={navRef} className={`side-nav ${isNavOpen ? '' : 'closed'}`}>
          <img
            src='/images/stackroute.png'
            alt='Stackroute Logo'
            style={{ width: '50%', height: '50%' }}
          />
          <p>v1.0.1</p>
          <Link to='/quick-quiz'>Quick Quiz</Link>
          <Link to='/assessment-creator'>Assessment Creator</Link>
          <Link to='/case-study-creator'>Case Study Creator</Link>
          <Link to='/code-reviewer'>Code Reviewer</Link>
        </div>
        <div className='top-bar' style={{ zIndex: '100000' }}>
          <div className='logo'>
            {/* Updated onClick handler to toggleNav function */}
            {/* <span className="hamburger-icon" onClick={toggleNav}>&#9776;</span> */}
            {/* logo */}
            <img
              src='/images/logo3.png'
              alt='Stackroute Logo'
              style={{ width: '3.75rem', height: '3.75rem' }}
            />
            <a style={{ textDecoration: 'none' }} href='/home'>
              <p>ContentCrafter</p>{' '}
            </a>
            <p
              className='beta'
              style={{ color: 'white', fontSize: '15px', marginTop: '30px' }}
            >
              Beta (v1.0.2)
            </p>
          </div>
          <div className='feedback-btn-container'>
            <button onClick={openFeedback}>Feedback</button>
            {token && <button onClick={logout}>Logout</button>}
            <img
            src="images/SR logos-16.png"
            alt="Stackroute Logo"
            style={{ width: '8rem', height: '5rem', backgroundColor: 'white' }}
          />
          </div>

        </div>
        </div>

        {/* <div className='logo-container'>
          <img
            src="images/SR logos-16.png"
            alt="Stackroute Logo"
            style={{ width: '3rem', height: '5.75rem' }}
          />
        </div> */}
      </div>


  );
};

export default SideNav;
