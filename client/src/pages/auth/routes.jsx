import { Routes, Route } from "react-router-dom";
import React from "react";
import Signin from "./signin";
import LawyerSignUp from "./lawyer/signup";
import UserSignUp from "./user/signup";
import ForgotPassword from "./forgotpassword";


function AuthRoute() {
  return (
    <div className="w-full max-h-[80vh] ">
      <Routes>
        <Route path="lawyer">
          <Route path="login" element={<Signin />} />
          <Route path="signup" element={<LawyerSignUp />} />
          <Route path="" element={<UserSignUp />} />
        </Route>
        <Route path="client">
          <Route path="login" element={<Signin />} />
          <Route path="signup" element={<UserSignUp />} />
        </Route>

        <Route path="login"  element={<Signin />} />
       

        <Route path="resetpassword"element={<ForgotPassword />} />
        
        
      </Routes>
    </div>
  );
}

export default AuthRoute;
