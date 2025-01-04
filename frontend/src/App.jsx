import MainContent from "./pages/Main Contents/MainContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

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
      </Routes>
    </Router>
  );
};

export default App;
