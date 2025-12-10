// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import AppRoutes from '@routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
// src/App.jsx

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Contexts
import { AuthProvider, NotificationProvider, SidebarProvider } from "@context";

// Components
import { ChatbotWidget } from "@components/Chatbot";

// Routes
import AppRoutes from "./routes";

// Styles
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SidebarProvider>
            <AppRoutes />
            <ChatbotWidget />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </SidebarProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
