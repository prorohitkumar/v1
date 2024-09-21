import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './ProjectExplorer.css'; // Import the CSS file

/**
 * The ProjectExplorer component displays the file and folder structure.
 * @param {Object} props - The component props.
 * @param {Object} props.folder - The folder object.
 * @param {Function} props.onFileSelect - The function to call when a file is selected.
 */
function ProjectExplorer({ folder, onFileSelect }) {
  const [open, setOpen] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  /**
   * Toggles the open state of a folder.
   * @param {string} path - The path of the folder.
   */
  const toggleOpen = (path) => {
    setOpen({ ...open, [path]: !open[path] });
    setActiveFolder(path);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file.path);
    onFileSelect(file);
  };

  const listItemStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    backgroundColor: '#000',
    color: '#fff',
  };

  const listItemHoverStyle = {
    ...listItemStyle,
    backgroundColor: '#444',
  };

  const selectedFileStyle = {
    ...listItemStyle,
    backgroundColor: '#555',
  };

  const activeFolderStyle = {
    ...listItemStyle,
    backgroundColor: '#666',
  };

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#000',
        color: '#fff',
      }}
    >
      {folder ? (
        <List>
          {folder.subFolders.map((subFolder) => (
            <div key={subFolder.path}>
              <ListItem
                button
                onClick={() => toggleOpen(subFolder.path)}
                style={
                  activeFolder === subFolder.path
                    ? activeFolderStyle
                    : listItemStyle
                }
              >
                <ListItemIcon>
                  <FolderIcon style={{ color: '#f1c40f' }} />
                </ListItemIcon>
                <ListItemText primary={subFolder.name} />
                {open[subFolder.path] ? (
                  <ExpandLess style={{ color: '#fff' }} />
                ) : (
                  <ExpandMore style={{ color: '#fff' }} />
                )}
              </ListItem>
              <Collapse in={open[subFolder.path]} timeout='auto' unmountOnExit>
                <ProjectExplorer
                  folder={subFolder}
                  onFileSelect={onFileSelect}
                />
              </Collapse>
            </div>
          ))}
          {folder.files.map((file) => (
            <ListItem
              button
              key={file.path}
              onClick={() => handleFileSelect(file)}
              style={
                file.path === selectedFile ? selectedFileStyle : listItemStyle
              }
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#444';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor =
                  file.path === selectedFile ? '#555' : '#000';
              }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon style={{ color: '#2980b9' }} />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography variant='h6' style={{ color: '#fff' }}>
            Click "OPEN PROJECT" button to
            <div>add/upload a project.</div>
          </Typography>
        </div>
      )}
    </div>
  );
}

export default ProjectExplorer;
