import React, { createContext, useContext } from 'react';

export const ChatContext = createContext();

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { fetchScenarios, userData } = useContext(ChatContext);

  const initialAction = () => {
    const message = createChatBotMessage(`Please tell me which domain or industry you're targeting? (e.g., IT, Healthcare, Retail)`);
    updateState(message, "industry");
  };

  const afterInitialMessage = (industry) => {
    if (!industry) {
      const errorMessage = createChatBotMessage("Please provide a valid domain.");
      updateState(errorMessage, "industry");
      return;
    }

    const message = createChatBotMessage(`Please specify the role or job profile you're aiming for. (e.g., Full Stack Developer, Cloud Programmer, Project Manager, Solution Architect).`);
    updateState(message, "job_role");
  };

  const afterDomainMessage = (job_role) => {
    if (!job_role) {
      const errorMessage = createChatBotMessage("Please provide a valid role.");
      updateState(errorMessage, "job_role");
      return;
    }

    const message = createChatBotMessage(`Now, let's close in on the topics you'd like to tackle. Please type the topics, separated by comma (eg., Competitive Programming, Data Structure and Algorithms, UX Design, JUnit Tests, DevOps, Digital Marketing).`);
    updateState(message, "topics");
  };

  const afterRoleMessage = (topics) => {
    if (!topics) {
      const errorMessage = createChatBotMessage("Please provide topics!");
      updateState(errorMessage, "topics");
      return;
    }

    const message = createChatBotMessage(`How confident are you in your skills related to this topic? Please provide a score out of 10.`);
    updateState(message, "self_score");
  };

  const finalResult = (self_score) => {
    if (!self_score) {
      const errorMessage = createChatBotMessage("Please provide a self score");
      updateState(errorMessage, "self_score");
      return;
    }

    const loadingMessage = createChatBotMessage(`Please wait! Your interview is preparing.`);
    updateState(loadingMessage, "loading");

    fetchScenarios(userData);
  };

  const finalAction = () => {
    const message = createChatBotMessage(`Input is disabled as the interview is in progress. Please use the ongoing interview card.`);
    updateState(message, "questions");
  };

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
