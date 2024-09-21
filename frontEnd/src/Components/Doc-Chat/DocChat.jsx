import React, { useEffect, useState } from 'react';
import './DocChat.css';
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Chatbot from 'react-chatbot-kit';
import config from './ChatBot/config';
import messageParser from './ChatBot/MessageParser';
import actionProvider from './ChatBot/ActionProvider';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

import Spinner from 'react-bootstrap/Spinner';

const DocChat = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);

    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [documentToDelete, setDocumentToDelete] = useState();
    const [deleteDisabled, setDeleteDisabled] = useState(false);

    const [uploadOpen, setUploadOpen] = React.useState(false);
    const [file, setFile] = useState(null);
    const [uploadDisabled, setUploadDisabled] = useState(false);
    const [uploadError, setUploadError] = useState();

    const [endSessionOpen, setEndSessionOpen] = React.useState(false);

    useEffect(() => {
      const id = localStorage.getItem("session_id");
      console.log("Session id:", id);
      if (!id) {
        console.log("New session")
        localStorage.setItem("session_id", Date.now());
      }
      fetchData();
      const handleBeforeUnload = async (event) => {
        // Show your custom dialog box here
        const confirmationMessage = 'Are you sure you want to leave Document Quest?';
        event.preventDefault();
        event.returnValue = confirmationMessage;
        try {
          const session_id = localStorage.getItem("session_id");
          await fetch(`https://localhost:8000/delete-all-files/${session_id}`, {
            method: 'DELETE'
          });
        } catch (error) {
          console.error('Error cleaning backend:', error);
        }
        return confirmationMessage; 
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

    const fetchData = async () => {
      try {
        const session_id = localStorage.getItem("session_id");
        const response = await fetch(`https://localhost:8000/files/${session_id}`);
        const data = await response.json();
        console.log('Response data:', data);
        setDocuments(data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    const handleUploadClick = () => {
      setFile();
      setUploadOpen(true);
    };

    const handleFileChange = (event) => {
      if (event.target.files[0].type !== "application/pdf") {
        setUploadError("Please choose only PDF documents");
      } else {
        setFile(event.target.files[0]);
        setUploadError();
      }
    };

    const handleUploadDisagree = () => {
        setUploadOpen(false);
        setUploadError();
        console.log("Don't upload")
    };

    const handleUploadAgree = async () => {
      if (!file) {
        alert("Please select a file.");
        return;
      }

      setUploadDisabled(true);
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const session_id = localStorage.getItem("session_id");
        const response = await fetch(`https://localhost:8000/upload/${session_id}`, {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          setDocuments(data.files);
          setUploadDisabled(false);
          setUploadOpen(false);
          setUploadError();
        } else {
          console.error('Failed to upload file');
          setUploadError("Failed to upload document, please try again later..");
          setUploadDisabled(false);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError("Failed to upload document, please try again later..");
        setUploadDisabled(false);
      }
    };

    const handleDelete = (document) => {
      console.log("Item to delete:", document);
      setDocumentToDelete(document);
      setDeleteOpen(true);
    };

    const handleDeleteDisagree = () => {
      setDeleteOpen(false);
        console.log("Don't Delete data")
    };

    const handleDeleteAgree = async () => {
      try {
        const session_id = localStorage.getItem("session_id");
        setDeleteDisabled(true);
        const response = await fetch(`https://localhost:8000/delete_file/${session_id}?filename=${documentToDelete}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          console.log('File deleted successfully');
          fetchData();
          setDeleteDisabled(false);
          setDeleteOpen(false);
        } else {
          setDeleteDisabled(false);
          setDeleteOpen(false);
          console.error('Failed to delete file');
        }
      } catch (error) {
        setDeleteDisabled(false);
        setDeleteOpen(false);
        console.error('Error deleting file:', error);
      }
    };

    const handleSessionOut = () => {
      setEndSessionOpen(true);
    };
    const handleEndSessionDisagree = () => {
      setEndSessionOpen(false);
      console.log("Don't End the session!")
    };

    const handleEndSessionAgree = async () => {
      try {
        const session_id = localStorage.getItem("session_id");
        const response = await fetch(`https://localhost:8000/delete-all-files/${session_id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          console.log('File deleted successfully');
          setEndSessionOpen(false);
          navigate('/home');
        } else {
          console.error('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    };

    return (
      <div className="container">
        <div className="left-column">
          <h3>Document list(s)</h3>
          <div>
          {documents.length > 0 ? (
            <table >
              <tbody>
                  {documents.map((document, index) => (
                  <tr key={index} className="document-row">
                      <td style={{width: '100vw'}}>{document}</td>
                      <td style={{ padding: '5px 0 5px 0'}}>
                          <Button
                          variant="outlined"
                          onClick={() => handleDelete(document)}
                          style={{ minWidth: '40px', color: 'white' }}>
                              <DeleteOutlineOutlinedIcon />
                          </Button>
                      </td>
                  </tr>
                  ))}
              </tbody>
            </table>) : (
        <p>Please upload your document to get started.</p>
      )}
          </div>

          <Button variant="contained" onClick={handleUploadClick} style={{ margin: '10px', width: '100%',}}>
            <UploadFileIcon />
            Upload Document
          </Button>
          <Button variant="contained" onClick={handleSessionOut} style={{ width: '100%',}}>
            <ExitToAppOutlinedIcon /> 
            End Session
            </Button>
        </div>
        <div className="right-column">
          <Chatbot config={config} messageParser={messageParser} actionProvider={actionProvider}/>
        </div>

        {/* Delete dialog */}
        <Dialog
        open={deleteOpen}
        onClose={handleDeleteDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure in deleting this document?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Note: Deleting this document will remove the indexing and doesn't allow you to ask questions related to this document.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={deleteDisabled} onClick={handleDeleteDisagree}>Disagree</Button>
          {/* <Button disabled={deleteDisabled} onClick={handleDeleteAgree} autoFocus>
            Agree
          </Button> */}
          {!deleteDisabled ? (
            <Button disabled={deleteDisabled} onClick={handleDeleteAgree} autoFocus>Agree</Button>
          ): (
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              />
              Indexing...
              </Button>)}
        </DialogActions>
      </Dialog>

      {/* Upload dialog */}
      <Dialog
        open={uploadOpen}
        onClose={handleUploadDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Upload your document"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Note: Please upload only PDF documents.
          </DialogContentText>
          {/* <input type="file" accept=".txt, .csv, .docx, .xlsx, .pdf" onChange={handleFileChange} /> */}
          <div className="file-input-container">
            <label htmlFor="file-upload" className="custom-file-upload">
              <CloudUploadIcon className="cloud-icon" />Upload File
            </label>
            <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            />
            {file && <span>{file.name}</span>}
            {uploadError && <p style={{ color: 'red'}}>{uploadError}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={uploadDisabled} onClick={handleUploadDisagree}>Cancel</Button>
            {!uploadDisabled ? (
            <Button disabled={uploadDisabled} onClick={handleUploadAgree} autoFocus>Upload</Button>): 
            (<Button variant="primary" disabled>
              <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              />
              Indexing...
              </Button>)}
        </DialogActions>
      </Dialog>

      {/* End Session dialog */}
      <Dialog
        open={endSessionOpen}
        onClose={handleEndSessionDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to exit 'Document Quest'?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Note: Exiting 'Document Quest' will delete all documents and indexing from ContentCrafter.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEndSessionDisagree}>Disagree</Button>
          <Button onClick={handleEndSessionAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  };  
export default DocChat;
