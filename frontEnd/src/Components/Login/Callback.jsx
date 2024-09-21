import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const [groupIds, setGroupIds] = useState([]);

  useEffect(() => {
    // Retrieve data from cookies
    const dataFromCookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      dataFromCookies[key] = decodeURIComponent(value);  // Properly decode the value
    });

    console.log('Cookies:', dataFromCookies);

    // Store data in localStorage
    Object.keys(dataFromCookies).forEach(key => {
      localStorage.setItem(key, dataFromCookies[key]);
    });

    // Debugging: Log the raw groups data before parsing
    if (dataFromCookies.groups) {
      console.log('Raw groups data:', dataFromCookies.groups);

      try {
        // Clean up the string: Remove surrounding quotes and replace \054 with commas
        const cleanGroupsData = dataFromCookies.groups.replace(/\\054/g, ',').replace(/(^")|("$)/g, '');
        console.log('Cleaned groups data:', cleanGroupsData);

        // Parse the cleaned JSON string back into an array
        const groupIdsData = JSON.parse(cleanGroupsData);
        
        // Debugging: Log the parsed groups data
        console.log('Parsed groups data:', groupIdsData);

        setGroupIds(groupIdsData);
        localStorage.setItem('groups', JSON.stringify(groupIdsData));  // Store the array as a string
      } catch (error) {
        console.error('Error parsing group IDs:', error);
      }
    }

    navigate('/home');
  }, [navigate]);

  return (
    <div>
      <h1>Buckle up, your agents are getting ready...</h1>
      <pre>{JSON.stringify(groupIds, null, 2)}</pre>
    </div>
  );
};

export default Callback;
