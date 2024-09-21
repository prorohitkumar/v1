// MessageParser starter code
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(prompt) {
    console.log(prompt);
    this.actionProvider.messageHandler(prompt);
  }
}

export default MessageParser;
