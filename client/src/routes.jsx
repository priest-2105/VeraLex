import App from "./App";
import PublicRoute from "./pages/public/routes";
import AuthRoute from "./pages/auth/routes";
import Home from "./pages/public/homepage";
import Signin from "./pages/auth/signin";
import LawyerSignUp from "./pages/auth/lawyer/signup";
import UserSignUp from "./pages/auth/user/signup";
import ForgotPassword from "./pages/auth/forgotpassword";
import React from "react";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <div>Something went wrong!</div>,
    children: [
      {
        path: "/",
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <Home /> }
        ]
      },
      {
        path: "auth",
        element: <AuthRoute />,
        children: [
          { index: true, element: <Navigate to="lawyer/login" /> },
          { path: "resetpassword", element: <ForgotPassword /> },
          {
            path: "lawyer",
            children: [
              { index: true, element: <Navigate to="login" /> },
              { path: "login", element: <Signin userType="lawyer" /> },
              { path: "signup", element: <LawyerSignUp /> }
            ]
          },
          {
            path: "user",
            children: [
              { index: true, element: <Navigate to="login" /> },
              { path: "login", element: <Signin userType="user" /> },
              { path: "signup", element: <UserSignUp /> }
            ]
          }
        ]
      }
    ]
  }
];
