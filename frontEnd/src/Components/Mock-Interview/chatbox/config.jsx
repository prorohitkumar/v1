import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import StartBtn from './components/StartBtn';

import StartQuizBtn from './components/StartQuizBtn';
import DifficultyOptions from './components/DifficultyOptions';
import BotAvatar from './components/BotAvatar/BotAvatar';





const config = {
    botName: "Interview Coach",
    
    initialMessages: [createChatBotMessage(`🌟 Welcome to your personalized mock interview session! 🌟`, {
      widget: "startBtn"
  })],

  customComponents: {
    botAvatar: (probs) => <BotAvatar {...probs} />

  },
  
    state: {
        checker: null,
        userData: {
            domain: "",
            role: "",
            specific_topic: "",
            difficulty_level: ""
        },
        questions:""
    },
    widgets: [

    
      {
        widgetName: "startBtn",
        widgetFunc: (props) => <StartBtn {...props} />,
    },
    {
      widgetName: "difficultyOptions",
      widgetFunc: (props) => <DifficultyOptions {...props} />,
    },
    {
      widgetName: "startQuizBtn",
      widgetFunc: (props) => <StartQuizBtn {...props} />,
  },
    ],
     
};

export default config;