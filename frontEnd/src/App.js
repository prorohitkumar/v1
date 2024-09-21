import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNav from './Components/Side-Nav/SideNav';
import QuickQuiz from './Components/Quick-Quiz/QuickQuiz';
import Output from './Components/IT-Component/Output';
import CaseStudyCreator from './Components/Case-Study-Creator/CaseStudyCreator';
import WorkInProgress from './Components/work-in-progress/WorkInProgress';
import HomePage from './Components/HomePage/HomePage';
import PromptEnhancer from './Components/Prompt-Enhancer/PromptEnhancer';
import CodeGenerator from './Components/Code-Generator/CodeGenerator';
import ImageTranslate from './Components/Image-Translate/ImageTranslate';
import QuickQuizz from './Components/Quick-Quizz/QuickQuizz';
import DocChat from './Components/Doc-Chat/DocChat';
import Blog from './Components/blog-generator/Blog';
import RolePlay from './Components/Role-Play-Creator/RolePlay';
import UserStories from './Components/User-Story/UserStories';
import AssessmentCreatorV2 from './Components/Assessment-CreatorV2/AssessmentCreatorV2';
import ExcerciseCreator from './Components/Exercise-Creator/ExcerciseCreator';
import Choice from './Components/Code-Reviewer/Choice';
import ReviewCode from './Components/Code-Reviewer/ReviewCode';
import ReviewProject from './Components/Code-Reviewer/ReviewProject';
import InterviewCoach from './Components/Interview-Coach/InterviewCoach';

import Login from './Components/Login/Login';
import AuthGuard from './Components/Login/AuthGuard';
import Callback from './Components/Login/Callback';

function RoutesWithNavbar() {
  return (
    <>
      <SideNav />
      <div className='main-content'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/callback' element={<Callback />} />

          <Route
            path='/'
            element={
              <AuthGuard>
                <HomePage />
              </AuthGuard>
            }
          />
          <Route
            path='/home'
            element={
              <AuthGuard>
                <HomePage />
              </AuthGuard>
            }
          />
          <Route
            path='/quick-quiz'
            element={
              <AuthGuard>
                <QuickQuiz />
              </AuthGuard>
            }
          />
          <Route
            path='/assessment-creator'
            element={
              <AuthGuard>
                <AssessmentCreatorV2 />
              </AuthGuard>
            }
          />
          <Route
            path='/case-study-creator'
            element={
              <AuthGuard>
                <CaseStudyCreator />
              </AuthGuard>
            }
          />
          {/* <Route path='/code-reviewer' element={<AuthGuard><CodeReviewer /></AuthGuard>} /> */}
          <Route
            path='/work-in-progress'
            element={
              <AuthGuard>
                <WorkInProgress />
              </AuthGuard>
            }
          />
          <Route
            path='/assessment-output'
            element={
              <AuthGuard>
                <Output />
              </AuthGuard>
            }
          />
          <Route
            path='/mock-interview'
            element={
              <AuthGuard>
                {/* <MockInterview /> */}
                <InterviewCoach />
              </AuthGuard>
            }
          />
          <Route
            path='/prompt-enhancer'
            element={
              <AuthGuard>
                <PromptEnhancer />
              </AuthGuard>
            }
          />
          <Route
            path='/code-generator'
            element={
              <AuthGuard>
                <CodeGenerator />
              </AuthGuard>
            }
          />
          <Route
            path='/image-translate'
            element={
              <AuthGuard>
                <ImageTranslate />
              </AuthGuard>
            }
          />
          <Route
            path='/quick-quizz'
            element={
              <AuthGuard>
                <QuickQuizz />
              </AuthGuard>
            }
          />
          <Route
            path='/docChat'
            element={
              <AuthGuard>
                <DocChat />
              </AuthGuard>
            }
          />
          <Route
            path='/blog-generator'
            element={
              <AuthGuard>
                <Blog />
              </AuthGuard>
            }
          />
          <Route
            path='/role-play'
            element={
              <AuthGuard>
                <RolePlay />
              </AuthGuard>
            }
          />
          <Route
            path='/user-story'
            element={
              <AuthGuard>
                <UserStories />
              </AuthGuard>
            }
          />
          <Route
            path='/subjective-based-assessment'
            element={
              <AuthGuard>
                <ExcerciseCreator />
              </AuthGuard>
            }
          />
          <Route
            path='/code-reviewer'
            element={
              <AuthGuard>
                <Choice />
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Navbar */}
        <Route path='*' element={<RoutesWithNavbar />} />

        {/* Routes without Navbar */}
        <Route
          path='/review-code'
          element={
            <AuthGuard>
              <ReviewCode />
            </AuthGuard>
          }
        />
        <Route
          path='/review-project'
          element={
            <AuthGuard>
              <ReviewProject />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
