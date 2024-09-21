import React, { createContext } from 'react';

export const ChatContext = createContext();

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const initialAction = () => {
    const message = createChatBotMessage(` Please tell me which domain or industry you're targeting? (e.g., IT, Healthcare, Retail)`);
    updateState(message, "domain");
  }

  const afterInitialMessage = (domain) => {
    if (!domain) {
      const errorMessage = createChatBotMessage("Please provide a valid domain.");
      updateState(errorMessage, "domain");
      return;
    }
  
    const message = createChatBotMessage(
      <>
        Please specify the role or job profile you're aiming for. (e.g., Full Stack Developer, Cloud Programmer, Project Manager, Solution Architect).
      </>
    );
    updateState(message, "role");
  }
  
  const afterDomainMessage = (role) => {
    if (!role) {
      const errorMessage = createChatBotMessage("Please provide a valid role.");
      updateState(errorMessage, "role");
      return;
    }

    const message = createChatBotMessage(<>Now, let's close in on the topics you'd like to tackle. Please type the topics, separated by comma (eg., Competitive Programming, Data Structure and Algorithms,  UX Design, JUnit Tests, DevOps, Digital Marketing).</>);
    updateState(message, "specific_topic");
  }

  const afterRoleMessage = (specific_topic) => {
    if (!specific_topic) {
      const errorMessage = createChatBotMessage("Please provide topics!");
      updateState(errorMessage, "specific_topic");
      return;
    }
  
    const message = createChatBotMessage("Please select the type of questions you'd like to tackle:", {
      widget: "difficultyOptions",
    });

    updateState(message, "difficulty_level");

  }

  const finalResult = (difficulty_level) => {
   
  
    // Update userData with difficulty_level
    setState((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        difficulty_level: difficulty_level,
      },
    }));
  
    // Check if difficulty_level is not provided
    if (!difficulty_level) {
    
      const errorMessage = createChatBotMessage("Please select a difficulty level");
      updateState(errorMessage, "difficulty_level");
      return;
    }
  
    // Construct message using difficulty_level
    const message = createChatBotMessage(
      <>
        Thanks for providing the information. If you're ready to begin, click Start. 🚀
      </>,
      {
        widget: "startQuizBtn",
      }
    );
  
    // Update state with message
    updateState(message, "questions");
  };
  

  const finalAction = () => {
    const message = createChatBotMessage(`Input is disabled as the interview is in progress. Please use the ongoing interview card.`);
    updateState(message, "questions");
  }

  const updateState = (message, checker) => {
    setState((prev) => ({
      ...prev,
      messages: checker === 'replace' ? [message] : [...prev.messages, message],
      checker,
    }));
  };
  
  

  // Define the context value
  const contextValue = {
    updateState,
    createChatBotMessage,
    
  };

    return (
      <ChatContext.Provider value={contextValue}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            actions: {
              initialAction,
              afterInitialMessage,
              afterDomainMessage,
              afterRoleMessage,
              finalResult,
              finalAction,
           
            },
          });
        })}
      </ChatContext.Provider>
    );
  };
  
  export default ActionProvider;