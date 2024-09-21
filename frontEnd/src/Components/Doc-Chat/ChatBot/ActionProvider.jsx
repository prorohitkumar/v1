// ActionProvider starter code
class ActionProvider {
    constructor(
     createChatBotMessage,
     setStateFunc,
     createClientMessage,
     stateRef,
     createCustomMessage,
     ...rest
   ) {
     this.createChatBotMessage = createChatBotMessage;
     this.setState = setStateFunc;
     this.createClientMessage = createClientMessage;
     this.stateRef = stateRef;
     this.createCustomMessage = createCustomMessage;
   }

   messageHandler = (prompt) => {
    const requestData = {
      prompt: prompt,
    };
    console.log("Data:", requestData);
    const session_id = localStorage.getItem("session_id");
    fetch(`https://localhost:8000/process_doc/${session_id}`, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response:", data);
      const message = this.createChatBotMessage(data.response.output_text);
      this.setChatBotMessage(message);
    })
    .catch(error => {
      console.error('Error sending request:', error);
      const message = this.createChatBotMessage("Exception occured while retrieving your answer, Please try again..");
      this.setChatBotMessage(message);
    });
   }

   setChatBotMessage = (message) => {
    this.setState(state => ({...state, messages: [...state.messages, message]}))
   }
 }
 
 export default ActionProvider;