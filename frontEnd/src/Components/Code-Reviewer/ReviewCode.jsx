import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ProjectExplorer from './ProjectExplorer';
import CodeEditor from './CodeEditor';
import Response from './Response';
import Draggable from 'react-draggable';
import Chatbot from './Chatbot';

import { useNavigate } from 'react-router-dom';

const ReviewCode = () => {
  const [folder, setFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [fixedCode, setFixedCode] = useState(
    '// Your fixed code will appear here...',
  );
  const [enhancedCode, setEnhancedCode] = useState(
    '// Your enhanced code will appear here...',
  );
  const [errorDescription, setErrorDescription] = useState(
    'Errors description content goes here...',
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [botOpen, setBotOpen] = useState(false);

  const navigate = useNavigate();

  const openFolder = async () => {
    try {
      setLoading(true);
      const handle = await window.showDirectoryPicker();
      const rootFolder = await buildFileTree(handle);
      setFolder(rootFolder);
      setSelectedFile(null);
      setLoading(false);
    } catch (err) {
      console.error('Error opening folder:', err);
      setLoading(false);
    }
  };

  const buildFileTree = async (handle) => {
    const folder = {
      name: handle.name,
      path: handle.name,
      subFolders: [],
      files: [],
    };
    for await (const entry of handle.values()) {
      if (entry.kind === 'directory') {
        folder.subFolders.push(await buildFileTree(entry));
      } else {
        folder.files.push({
          name: entry.name,
          path: entry.name,
          handle: entry,
        });
      }
    }
    return folder;
  };

  const saveFile = async (file, content) => {
    const writable = await file.handle.createWritable();
    await writable.write(content);
    await writable.close();
  };

  const filterFiles = (folder) => {
    if (!searchQuery) return folder;

    const filterFolder = (folder) => {
      const filteredSubFolders = folder.subFolders
        .map(filterFolder)
        .filter(
          (subFolder) => subFolder.files.length || subFolder.subFolders.length,
        );
      const filteredFiles = folder.files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return {
        ...folder,
        subFolders: filteredSubFolders,
        files: filteredFiles,
      };
    };

    return filterFolder(folder);
  };

  const handleBotClick = () => {
    setBotOpen(!botOpen);
  };

  return (
    <Grid container spacing={2} style={{ height: '100vh' }}>
      <Grid
        item
        xs={2.4}
        style={{
          height: '101%',
          overflowY: 'auto',
          padding: '10px',
          paddingRight: '0px',
          paddingLeft: '16px',
          backgroundColor: '#000',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1px',
            backgroundColor: 'white',
          }}
        >
          <img
            src='/images/stackroute_logo.png'
            alt='StackRoute Logo'
            className='logo-shadow'
            style={{ height: '120px' , backgroundColor: 'white', padding: '5px' , marginLeft: '1px' }}
          />
          <button
            className='back-button'
            onClick={() => navigate('/')}
            style={{ marginLeft: '1px', marginTop: '1rem' }}
          >
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            marginTop: '40px',
          }}
        >
          <Button
            variant='contained'
            color='primary'
            style={{ width: '230px', height: '40px', marginLeft:'50px' }}
            onClick={openFolder}
          >
            Open Project
          </Button>
        </div>
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div className='loader' style={{ marginRight: '90px' }}></div>
            <div className='loader-text' style={{ marginLeft: '20px' }}></div>
          </div>
        ) : (
          <ProjectExplorer
            folder={filterFiles(folder)}
            onFileSelect={setSelectedFile}
          />
        )}
      </Grid>
      <Grid item xs={4.8} style={{ height: '100%' }}>
        <CodeEditor
          file={selectedFile}
          onSave={saveFile}
          setCode={setCode}
          setFixedCode={setFixedCode}
          setEnhancedCode={setEnhancedCode}
          setErrorDescription={setErrorDescription}
          setErrorMessage={setErrorMessage}
        />
      </Grid>
      <Grid item xs={4.7} style={{ height: '100%' }}>
        <Response
          code={code}
          setCode={setCode}
          fixedCode={fixedCode}
          enhancedCode={enhancedCode}
          errorDescription={errorDescription}
          errorMessage={errorMessage}
        />
      </Grid>
      {/* <Draggable>
        <img
          src='/images/bot.png'
          alt='Chatbot'
          style={{
            position: 'absolute',
            // top: '10px',
            right: '10px',
            width: '100px',
            height: '100px',
            zIndex: 1000,
            cursor: 'pointer',
            marginTop: '1rem',
          }}
          onClick={handleBotClick}
        />
      </Draggable>
      {botOpen && (
        <Chatbot code={code} isVisible={botOpen} onClose={handleBotClick} />
      )} */}
    </Grid>
  );
};

export default ReviewCode;
