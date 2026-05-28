import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import ProjectRoutes from "./Routes";

import { AuthProvider }
  from "./authContext";

import "./index.css";

import "./styles/global.css";

import "./styles/animations.css";

import "./styles/responsive.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

 

    <AuthProvider>

      <BrowserRouter>

        <ProjectRoutes />

      </BrowserRouter>
 
    </AuthProvider>


);