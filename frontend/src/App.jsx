import MainContent from "./pages/Main Contents/MainContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { SignedIn } from "@clerk/clerk-react";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/main content"
          element={
            <SignedIn>
              <MainContent />
            </SignedIn>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
