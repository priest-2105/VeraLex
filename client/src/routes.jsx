import App from "./App";
import PublicRoute from "./pages/public/routes";
import AuthRoute from "./pages/auth/routes";
import Home from "./pages/public/homepage";
import Signin from "./pages/auth/signin";
import LawyerSignUp from "./pages/auth/lawyer/signup";
import UserSignUp from "./pages/auth/user/signup";
import ForgotPassword from "./pages/auth/forgotpassword";
import React from "react";


export const routes = [
  {
    path: "/public",
    element: <App />,
    children: [
      {
        path: "",
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <Home /> },
        ],
      },
      {
        path: "auth",
        element: <AuthRoute />,
        children: [
          { path: "resetpassword", element: <ForgotPassword /> },
          {
            path: "lawyer",
            children: [
              { path: "login", element: <Signin userType="lawyer" /> },
              { path: "signup", element: <LawyerSignUp /> },
            ],
          },
          {
            path: "client",
            children: [
              { path: "login", element: <Signin userType="client" /> },
              { path: "signup", element: <UserSignUp /> },
            ],
          },
        ],
      },
    ],
  },
];
