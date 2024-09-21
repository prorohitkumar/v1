import React, { useState } from 'react';
import './HomePage.css';
import SearchBar from 'material-ui-search-bar';
import PlayCircleFilledWhiteSharpIcon from '@mui/icons-material/PlayCircleFilledWhiteSharp';
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Import the icon
// import Modal from 'react-modal'; // Import the modal component
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function HomePage() {
  const mark = `## What's New in Release v1.0.3

  We are excited to announce the general availability of ContentCrafter version 1.0.3 as of April 19th, 2024. This update incorporates a range of new features and enhancements designed to streamline your workflow and empower you to achieve greater productivity.
  ## New Agents

* **Code Review Agent:** This agent acts as your coding companion, meticulously reviewing code, suggesting improvements, and even documenting it for better maintainability.
* **User Story Generator:** Generate user stories with ease! This agent automates the process based on provided problem statements, saving you valuable time and effort.
* **Document Quest (RAG) Agent:** Interact with uploaded documents through this agent, which can answer your questions based on the content. It's like having an AI-powered assistant for your documents.

## Enhancements

* **Mock Interview 2.0:** Experience a more realistic and effective interview simulation thanks to new features and optimizations in Mock Interview 2.0.
    - **Difficulty Level:** Accurate storage for fetching questions based on difficulty. 
    - **Download Function:** Download interview questions.
    - **Navigation:** Previous button to revisit questions, End button restarts simulation.
    - **Visuals:** Bot avatar icon, scenario-based questions added to prompts.

**How to Access**

These new agents and enhanced features can be found within the relevant sections of the application. We believe these additions will significantly improve your productivity and workflow. 

 `;

  const [searchTerm, setSearchTerm] = useState('');
  const [isWhatsNewModalOpen, setIsWhatsNewModalOpen] = useState(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false); // Declare the state variables

  const cardDetails = [
    // {
    //   imageSrc: '/images/quic.jpg',
    //   title: 'Quick Quiz Generator',
    //   text: 'Rapidly Create Engaging Quizzes',
    //   link: '/quick-quizz',
    //   isActive: true,
    // },
    {
      imageSrc: '/images/assess.jpg',
      title: 'Assessment Creator',
      text: 'Create Custom Assessments',
      link: '/assessment-creator',
      isActive: true,
    },
    {
      imageSrc: '/images/case.jpg',
      title: 'Case Study Creator',
      text: 'Craft Engaging Case Studies',
      link: '/case-study-creator',
      isActive: true,
    },
    {
      imageSrc: '/images/image.jpg',
      title: 'Snap Scriptor',
      text: 'Transform Visuals To Text',
      link: '/image-translate',
      isActive: true,
    },
    {
      imageSrc: '/images/promptt.jpg',
      title: 'User Stories Generator',
      text: 'Generate User Stories',
      link: '/user-story',
      isActive: true,
    },
    {
      imageSrc: '/images/quic.jpg',
      title: 'Subjective Based Assessment',
      text: 'Role-Driven Exercises',
      link: '/subjective-based-assessment',
      isActive: true,
    },
    {
      imageSrc: '/images/codee.jpg',
      title: 'Code Reviewer',
      text: 'Evaluate Code Effectively',
      link: '/code-reviewer',
      isActive: true,
    },
    {
      imageSrc: '/images/mock.jpg',
      title: 'Interview Coach',
      text: 'Ace the Interview',
      link: '/mock-interview',
      isActive: true,
    },
    // {
    //   imageSrc: '/images/blogg.jpg',
    //   title: 'Blog Crafter',
    //   text: 'Generate Blog Posts',
    //   link: '/blog-generator',
    //   isActive: true,
    // },
    // {
    //   imageSrc: '/images/role.jpg',
    //   title: 'Role Play Generator  ',
    //   text: 'Generate Role Play Activities',
    //   link: '/role-play',
    //   isActive: true,
    // },
    // {
    //   imageSrc: '/images/DocQuest.jpg',
    //   title: 'Document Quest',
    //   text: 'Chat with your document',
    //   link: '/docChat',
    //   isActive: true,
    // },
  ];

  const filteredCards =
    searchTerm.trim() === '' ? cardDetails : cardDetails.filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sort filteredCards so that active cards come first
  filteredCards.sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));

  return (
    <div className="home-page">
      <div className="search-line">
        <div className="search-bar">
          <SearchBar
            style={{ width: '680px' }}
            type="text"
            value={searchTerm}
            onChange={newValue => setSearchTerm(newValue)}
            onCancelSearch={() => setSearchTerm('')}
          />
        </div>
        <div className="whats-new-button">
        <Button
          sx={{ textTransform: 'none', textAlign: 'center', fontSize: '15px' }}
          className="whats-new-button"
          onClick={() => setIsWhatsNewOpen(true)}
        >
          What's new ?
          <WhatshotIcon sx={{ color: 'orange', marginBottom: '5px' }} />
        </Button>
        </div>
      </div>
      <Dialog sx={{marginTop:'20px'}} open={isWhatsNewOpen} onClose={() => setIsWhatsNewOpen(false)} className="right-aligned-dialog">
        {/* <DialogTitle>What's New</DialogTitle> */}
        <DialogContent>
          <MarkdownPreview className="response-content" source={mark} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsWhatsNewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="card-container">
        {filteredCards.map((card, index) => (
          <div
            className={`card-home card-hover ${card.isActive ? 'card-hover' : ''}  ${!card.isActive ? 'card-disabled' : ''}`}
            style={{ width: '100%' }}
            key={index}
          >
            <img src={card.imageSrc} className="card-img-top" alt="Card" />
            <div className="card-body">
              <h5 className="card-title">{card.title}</h5>
              <p className="card-text">{card.text}</p>
              <div className="custom-btn-container">
                <a
                  href={card.link}
                  className={`btn btn-primary custom-btn ${!card.isActive ? 'disabled-link' : ''}`}
                  style={!card.isActive ? { pointerEvents: 'none' } : {}}
                >
                  Start <PlayCircleFilledWhiteSharpIcon />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
