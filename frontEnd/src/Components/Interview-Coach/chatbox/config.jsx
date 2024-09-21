import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import StartBtn from './components/StartBtn';

import BotAvatar from './components/BotAvatar/BotAvatar';
import MarkdownView from 'react-showdown';

const config = {
  botName: "Interview Coach",
  initialMessages: [createChatBotMessage(`🌟 Welcome to your personalized mock interview session! 🌟`, { widget: "startBtn" })],
  customComponents: {
    botAvatar: (probs) => <BotAvatar {...probs} />
  },
  state: {
    checker: null,
    userData: {
      industry: "",
      job_role: "",
      topics: "",
      self_score: ""
    },
    user_answer: "",
    questions: "",
  },
  widgets: [
    {
      widgetName: "startBtn",
      widgetFunc: (props) => <StartBtn {...props} />,
    },
   
    {
      widgetName: 'textWidget',
      widgetFunc: (props) => <MarkdownView markdown={props.message} />,
    },
  ],
};

export default config;
