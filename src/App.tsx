import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { JSX, useState } from "react";
import LoginPage from "./pages/login/login";
import CreateAcctPage from "./pages/login/createacct";
import TermsCond from "./pages/login/termscond";
import Nav from "./pages/main-site/navbar";
import Home from "./pages/main-site/home";
import Analytics from "./pages/main-site/analytics";
import Campaigns from "./pages/main-site/campaigns";
import Chatbot from "./pages/main-site/chatbot";
import Reports from "./pages/main-site/reports";
import UserOverview from "./pages/main-site/user_overview";
import MountainLine from "./pages/main-site/graphs-charts/handleMountainLine";
import BarChart from "./pages/main-site/graphs-charts/handleBar";
import Messages from "./pages/main-site/messages";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/graph" element={<BarChart />} />
        <Route path="/nav" element={<Nav />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateAcctPage />} />
        <Route path="/create/termsandconditions" element={<TermsCond />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/user-overview" element={<UserOverview />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
