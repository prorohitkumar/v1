// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./BotAvatar/BotAvatar";

const config = {
  initialMessages: [createChatBotMessage(`Hello, I'm Document Quest, your dedicated agent poised to assist you in answering questions related to your documents.`)],
  botName: "Document Quest",
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />
  }
}

export default config;