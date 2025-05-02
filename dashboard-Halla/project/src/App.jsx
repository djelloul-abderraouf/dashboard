import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';

import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import StudentsData from './pages/StudentsData';
import Predictions from './pages/Predictions';
import ClerkWrapper, { applyClerkTheme } from './components/Auth/ClerkWrapper';

function App() {
  // Configuration des composants Clerk avec notre thème
  const customSignIn = applyClerkTheme(SignIn);
  const customSignUp = applyClerkTheme(SignUp);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Routes d'authentification personnalisées */}
      <Route 
        path="/sign-in/*" 
        element={
          <ClerkWrapper>
            <SignIn 
              routing="path" 
              path="/sign-in" 
              appearance={customSignIn.appearance}
              localization={customSignIn.localization}
              afterSignInUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </ClerkWrapper>
        } 
      />
      
      <Route 
        path="/sign-up/*" 
        element={
          <ClerkWrapper>
            <SignUp 
              routing="path" 
              path="/sign-up" 
              appearance={customSignUp.appearance}
              localization={customSignUp.localization}
              afterSignUpUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </ClerkWrapper>
        } 
      />

      {/* Zone protégée */}
      <Route
        path="/*"
        element={
          <>
            <SignedIn>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-100 min-h-screen ml-64">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students" element={<StudentsData />} />
                    <Route path="/predictions" element={<Predictions />} />
                  </Routes>
                </main>
              </div>
            </SignedIn>

            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;