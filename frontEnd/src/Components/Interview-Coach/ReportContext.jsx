// ReportContext.js
import React, { createContext, useState } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [report, setReport] = useState({
    interviewer_question_scenario: "",
    interviewer_question_challenge: "",
    suggested_answer: "",
    user_answer: "",
    user_answer_score: 0,
    feedback_to_user: ""
  });

  return (
    <ReportContext.Provider value={{ report, setReport }}>
      {children}
    </ReportContext.Provider>
  );
};
