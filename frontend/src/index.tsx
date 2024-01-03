import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './Root';
import { RouterProvider } from 'react-router';
import { createHashRouter, Navigate } from 'react-router-dom';
import HistoryItemPage from './history/pages/history-item.page';
import TrainingsPage from "./training/trainings.page";
import TrainingStartPage from "./training/training-start.page";
import TrainingPage from "./training/training.page";
import QuestionEditPage from "./questions/question-edit.page";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [{ 
        index: true, 
        element: <Navigate to="/start" replace /> 
      },{
        path: "start",
        element: <TrainingStartPage/>,
      },{
        path: "training/:trainingId",
        element: <TrainingPage/>,
      },{
        path: "training/:trainingId/history",
        element: <HistoryItemPage/>,
      },{
        path: "question/:questionId/editor",
        element: <QuestionEditPage/>,
      },{
        path: "trainings",
        element: <TrainingsPage/>,
      }]

  },
  
]);

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(
    <React.StrictMode>
      <RouterProvider router={router} ></RouterProvider>
    </React.StrictMode>
  );
