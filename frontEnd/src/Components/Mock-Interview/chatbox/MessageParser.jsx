import React from 'react';
import { ChatContext } from './ActionProvider';

const MessageParser = ({ children, actions }) => {
  const { createChatBotMessage, updateState } = React.useContext(ChatContext);
    // console.log(children.props.state)
    const { checker } = children.props.state;
    const parse = (message) => {
      if (checker===null) {
        console.log(checker);
        updateState(createChatBotMessage("Please click on 'Click here to Start' button to proceed further."), null);
        return;
    }


      

      
      


      if (checker === "domain") {
        children.props.state.userData.domain = message;
        actions.afterInitialMessage(children.props.state.userData.domain);
        
      
        
    }

        if (checker === "role") {
          children.props.state.userData.role = message;
            actions.afterDomainMessage(children.props.state.userData.role);
            
            
        }

        if (checker === "specific_topic" ) {
          children.props.state.userData.specific_topic = message;
            actions.afterRoleMessage(children.props.state.userData.specific_topic);
            
            
        }
        

        if (checker === "difficulty_level") {
          children.props.state.userData.difficulty_level = message; // Update difficulty level in state
          // Pass the difficulty level to the finalResult action
        
        }
     
    //   if (checker === "questions" ) {
    //     console.log(checker)
    //     actions.fetchData();
        
        
    // } 
    if (checker === "questions" ) {
     
      actions.finalAction();
      
      
  } 

   
    }
    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    parse: parse,
                    actions,
                });
            })}
        </div>
    );
};

export default MessageParser;