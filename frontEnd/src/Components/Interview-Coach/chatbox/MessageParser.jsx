import React from 'react';
import { ChatContext } from './ActionProvider';

const MessageParser = ({ children, actions }) => {
  const { createChatBotMessage, updateState } = React.useContext(ChatContext);

  const parse = (message) => {
    const { checker } = children.props.state;

    if (checker === null) {
      updateState(createChatBotMessage("Please click on 'Click here to Start' button to proceed further."), null);
      return;
    }

    if (checker === "industry") {
      children.props.state.userData.industry = message;
      actions.afterInitialMessage(children.props.state.userData.industry);
    }

    if (checker === "job_role") {
      children.props.state.userData.job_role = message;
      actions.afterDomainMessage(children.props.state.userData.job_role);
    }

    if (checker === "topics") {
      children.props.state.userData.topics = message;
      actions.afterRoleMessage(children.props.state.userData.topics);
    }

    if (checker === "self_score") {
      children.props.state.userData.self_score = message;
      actions.finalResult(children.props.state.userData.self_score);
    }

    if (checker === "questions") {
      actions.finalAction();
    }
  };

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
